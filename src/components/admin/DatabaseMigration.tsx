import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2, Database, CheckCircle, Mail } from 'lucide-react';

const DatabaseMigration: React.FC = () => {
    // Note: We do NOT use useStore() here because we want the OLD LOCAL data.
    const { toast } = useToast();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) => setLog(prev => [...prev, msg]);

    const testConnection = async () => {
        setStatus('loading');
        addLog('Testing connection to Supabase...');
        const url = import.meta.env.VITE_SUPABASE_URL;

        try {
            const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });
            if (error) throw error;
            addLog('✅ Connection Successful!');
            setStatus('idle');
            return true;
        } catch (error: any) {
            addLog(`❌ Connection Failed: ${error.message}`);
            setStatus('error');
            return false;
        }
    };

    const getLocalData = () => {
        return {
            products: JSON.parse(localStorage.getItem('jbcrafts_products') || '[]'),
            orders: JSON.parse(localStorage.getItem('jbcrafts_orders') || '[]'),
            usersDb: JSON.parse(localStorage.getItem('jbcrafts_users_db') || '{}'),
        };
    };

    const processEmails = async (orders: any[], usersDb: any) => {
        addLog(`Scanning for customer emails...`);
        const uniqueCustomers = new Map<string, { name: string, phone: string, source: string }>();

        // 1. Collect from Users DB (Base Layer - usually just email/password)
        Object.entries(usersDb).forEach(([email, _]) => {
            const normalizedEmail = (email as string).trim().toLowerCase();
            uniqueCustomers.set(normalizedEmail, {
                name: normalizedEmail.split('@')[0],
                phone: '',
                source: 'migration_user'
            });
        });

        // 2. Collect from Orders (Enrichment Layer)
        let ordersWithPhone = 0;

        orders.forEach(o => {
            const email = o.customerInfo?.email?.trim().toLowerCase();
            if (email) {
                const phone = o.customerInfo?.phone;
                if (phone && phone.length > 0) ordersWithPhone++;

                const existing = uniqueCustomers.get(email);
                uniqueCustomers.set(email, {
                    name: o.customerInfo.name || existing?.name || email.split('@')[0],
                    phone: phone || existing?.phone || '',
                    source: 'migration_order'
                });
            }
        });

        addLog(`Analysis: Found ${orders.length} total orders.`);
        addLog(`Analysis: ${ordersWithPhone} orders have phone numbers.`);

        if (orders.length > 0 && ordersWithPhone === 0) {
            addLog(`⚠️ WARNING: Your local orders DO NOT contain phone numbers.`);
            addLog(`First order keys: ${JSON.stringify(Object.keys(orders[0]?.customerInfo || {}))}`);
        }

        addLog(`Found ${uniqueCustomers.size} customers.`);

        // Debug Log for verification
        const sample = Array.from(uniqueCustomers.entries())[0];
        if (sample) {
            addLog(`Sample: ${sample[0]} -> Name: ${sample[1].name}, Phone: ${sample[1].phone || '(empty)'}`);
        } else {
            addLog(`⚠️ No customers found in local storage.`);
        }

        let successCount = 0;
        let firstError = null;

        for (const [email, info] of uniqueCustomers.entries()) {
            const { error: custError } = await supabase
                .from('customers')
                .upsert({
                    email: email,
                    name: info.name,
                    phone: info.phone,
                    source: info.source
                }, { onConflict: 'email' });

            if (!custError) {
                successCount++;
            } else {
                if (!firstError) firstError = custError.message;
                console.error("Sync failed for", email, custError);
            }
        }

        if (firstError) {
            addLog(`⚠️ Sync warning (first error): ${firstError}`);
            if (firstError.includes('does not exist') || firstError.includes('relation "customers"')) {
                addLog('❌ CRITICAL: The "customers" table does not exist!');
                addLog('👉 You MUST run the SQL script in Supabase first.');
            }
        }
        addLog(`✅ Synced ${successCount} / ${uniqueCustomers.size} customers.`);
    };

    const syncEmailsOnly = async () => {
        setStatus('loading');
        setLog([]);
        addLog('Starting Email Sync (Cloud Backfill)...');

        try {
            // 1. Fetch ALL orders from Supabase (Source of Truth)
            addLog('Fetching orders from Supabase...');
            const { data: cloudOrders, error } = await supabase
                .from('orders')
                .select('customer_info');

            if (error) throw error;

            addLog(`✅ Found ${cloudOrders.length} orders in Cloud.`);

            // 2. Extract Customer Info
            const uniqueCustomers = new Map<string, { name: string, phone: string, source: string }>();

            cloudOrders.forEach((o: any) => {
                const info = o.customer_info;
                const email = info?.email?.trim().toLowerCase();

                if (email) {
                    // Update if exists (to capture phone if found later)
                    const existing = uniqueCustomers.get(email);
                    const phone = info.phone || existing?.phone || '';
                    const name = info.name || existing?.name || email.split('@')[0];

                    uniqueCustomers.set(email, { name, phone, source: 'backfill_cloud' });
                }
            });

            addLog(`Found ${uniqueCustomers.size} unique customers from Order History.`);

            // 3. Upsert to Customers Table
            let successCount = 0;
            // Also merge legacy local users if any
            const { usersDb } = getLocalData();
            if (Object.keys(usersDb).length > 0) {
                addLog(`Merging ${Object.keys(usersDb).length} local legacy users...`);
                Object.entries(usersDb).forEach(([email, _]) => {
                    const normalized = email.trim().toLowerCase();
                    if (!uniqueCustomers.has(normalized)) {
                        uniqueCustomers.set(normalized, { name: normalized.split('@')[0], phone: '', source: 'migration_user' });
                    }
                });
            }

            for (const [email, info] of uniqueCustomers.entries()) {
                const { error: custError } = await supabase
                    .from('customers')
                    .upsert({
                        email: email,
                        name: info.name,
                        phone: info.phone,
                        source: info.source
                    }, { onConflict: 'email' });

                if (!custError) successCount++;
                else console.error(custError);
            }

            addLog(`✅ Successfully synced ${successCount} customers!`);
            setStatus('success');
            toast({ title: 'Sync Complete', description: 'Customer database updated from Orders.' });

        } catch (e: any) {
            setStatus('error');
            addLog(`Error: ${e.message}`);
        }
    };

    const migrateData = async () => {
        setStatus('loading');
        setLog([]);
        addLog('Starting full migration...');

        const { products, orders, usersDb } = getLocalData();
        addLog(`Found ${products.length} products, ${orders.length} orders locally.`);

        if (!await testConnection()) return;

        try {
            // 1. Migrate Products
            if (products.length > 0) {
                addLog(`Migrating products...`);
                // ... product migration logic can stay same ...
                const productInserts = products.map((p: any) => ({
                    name: p.name,
                    description: p.description,
                    price_in_paise: p.priceInPaise || p.price,
                    stock: p.stock,
                    category: p.category,
                    image_urls: p.images || [],
                    featured: p.featured,
                    cost_price_in_paise: p.costPriceInPaise
                }));

                const { error: prodError } = await supabase.from('products').insert(productInserts);
                if (prodError) addLog(`⚠️ Product insert warning: ${prodError.message}`);
                else addLog(`✅ Products migrated.`);
            }

            // 2. Migrate Orders
            if (orders.length > 0) {
                addLog(`Migrating orders...`);
                for (const order of orders) {
                    const { data: newOrderData, error: orderError } = await supabase
                        .from('orders')
                        .insert({
                            created_at: order.createdAt,
                            status: order.status,
                            total_in_paise: order.totalInPaise,
                            payment_method: order.paymentMethod,
                            payment_status: order.paymentStatus || 'pending',
                            transaction_id: order.transactionId,
                            customer_info: order.customerInfo
                        })
                        .select()
                        .single();

                    if (orderError) {
                        addLog(`⚠️ Order ${order.id} failed: ${orderError.message}`);
                        continue;
                    }

                    if (order.items && newOrderData) {
                        const items = order.items.map((item: any) => ({
                            order_id: newOrderData.id,
                            product_id: null,
                            product_name_snapshot: item.product.name,
                            quantity: item.quantity,
                            price_at_purchase: item.product.priceInPaise
                        }));
                        await supabase.from('order_items').insert(items);
                    }
                }
                addLog(`✅ Orders migrated.`);
            }

            // 3. Migrate Emails
            await processEmails(orders, usersDb);

            setStatus('success');
            toast({ title: 'Full Migration Complete', description: 'All data moved to Supabase.' });

        } catch (error: any) {
            setStatus('error');
            addLog(`❌ Fatal Error: ${error.message}`);
        }
    };

    return (
        <div className="p-6 border rounded-lg bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Database Migration & Sync</h3>
                    <p className="text-sm text-muted-foreground">Manage your Cloud Data (Supabase).</p>
                </div>
            </div>

            <div className="bg-muted p-4 rounded-md h-40 overflow-y-auto text-xs font-mono space-y-1">
                {log.length === 0 && <span className="text-muted-foreground">Ready...</span>}
                {log.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={syncEmailsOnly} disabled={status === 'loading'}>
                    <Mail className="mr-2 h-4 w-4" />
                    Sync Emails Only
                </Button>

                <Button variant="outline" onClick={migrateData} disabled={status === 'loading'}>
                    {status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Run Full Migration'}
                </Button>
            </div>

            {status === 'success' && (
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-md">
                    <CheckCircle className="h-4 w-4" />
                    <span>Success! Operation completed.</span>
                </div>
            )}
        </div>
    );
};

export default DatabaseMigration;
