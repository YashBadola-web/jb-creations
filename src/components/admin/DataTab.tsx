import React, { useRef } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePnL } from '@/hooks/usePnL';
import { useStore } from '@/context/StoreContext';
import { formatPriceINR } from '@/types';
import DatabaseMigration from './DatabaseMigration';

const DataTab: React.FC = () => {
    const { toast } = useToast();
    const { clearAllOrders } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper to get all relevant data from localStorage
    const getAllData = () => {
        return {
            products: JSON.parse(localStorage.getItem('jbcrafts_products') || '[]'),
            orders: JSON.parse(localStorage.getItem('jbcrafts_orders') || '[]'),
            settings: JSON.parse(localStorage.getItem('jbcrafts_settings') || '{}'),
            users: JSON.parse(localStorage.getItem('jbcrafts_user') || 'null'), // Note: this is just current session user
            cart: JSON.parse(localStorage.getItem('jbcrafts_cart') || '[]'),
        };
    };

    const handleExport = () => {
        const data = getAllData();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `jb-crafts-system-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: 'Export Successful', description: 'Full system backup downloaded.' });
    };

    const handleExportProductsTxt = () => {
        const { products } = getAllData();
        let content = "PRODUCT INVENTORY BACKUP\n";
        content += `Date: ${new Date().toLocaleDateString()}\n`;
        content += "====================================\n\n";

        products.forEach((p: any) => {
            content += `ID: ${p.id}\n`;
            content += `Name: ${p.name}\n`;
            content += `Price: ${p.displayPrice}\n`;
            content += `Stock: ${p.stock}\n`;
            content += `Category: ${p.category}\n`;
            content += "------------------------------------\n";
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jb-products-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Export Successful', description: 'Products exported to text file.' });
    };

    const handleExportEmailsTxt = () => {
        const { orders } = getAllData();
        const usersDb = JSON.parse(localStorage.getItem('jbcrafts_users_db') || '{}');
        const emails = new Set<string>();

        // Add emails from orders
        orders.forEach((o: any) => {
            if (o.customerInfo?.email) {
                emails.add(o.customerInfo.email);
            }
        });

        // Add emails from registered users
        Object.keys(usersDb).forEach(email => {
            emails.add(email);
        });

        let content = "CUSTOMER EMAILS BACKUP\n";
        content += `Date: ${new Date().toLocaleDateString()}\n`;
        content += `Total Unique Emails: ${emails.size}\n`;
        content += "====================================\n\n";

        emails.forEach(email => {
            content += `${email}\n`;
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jb-emails-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (emails.size === 0) {
            toast({
                title: 'No Emails Found',
                description: 'No orders with emails were found in the database.',
                variant: 'destructive'
            });
            return;
        }

        toast({ title: 'Export Successful', description: `${emails.size} unique emails exported to text file.` });
    };

    const { data: pnlData } = usePnL();

    const handleExportPnL = () => {
        // CSV Header
        const headers = ['Date', 'Revenue (INR)', 'COGS (INR)', 'Fees (INR)', 'Shipping (INR)', 'Net Profit (INR)', 'Margin (%)'];

        // CSV Rows
        const rows = pnlData.map(day => {
            return [
                day.date,
                (day.revenue / 100).toFixed(2),
                (day.cogs / 100).toFixed(2),
                (day.fees / 100).toFixed(2),
                (day.shipping / 100).toFixed(2),
                (day.netProfit / 100).toFixed(2),
                day.margin.toFixed(2) + '%'
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `jb-pnl-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: 'Export Successful', description: 'P&L data exported to CSV.' });
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);

                // Validate rudimentary structure
                if (data.products && Array.isArray(data.products)) {
                    // Update localStorage
                    if (data.products) localStorage.setItem('jbcrafts_products', JSON.stringify(data.products));
                    if (data.orders) localStorage.setItem('jbcrafts_orders', JSON.stringify(data.orders));
                    if (data.settings) localStorage.setItem('jbcrafts_settings', JSON.stringify(data.settings));

                    toast({
                        title: 'Import Successful',
                        description: 'Data has been restored. Reloading page...',
                    });

                    // Reload to reflect changes in context
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    throw new Error('Invalid backup file format');
                }
            } catch (error) {
                toast({
                    title: 'Import Failed',
                    description: 'The selected file is not a valid backup.',
                    variant: 'destructive'
                });
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if (confirm('DANGER: This will delete ALL your products, orders, and settings. Are you sure?')) {
            if (confirm('Really sure? This cannot be undone.')) {
                localStorage.clear();
                toast({ title: 'Data Reset', description: 'All data has been cleared.' });
                setTimeout(() => window.location.reload(), 1000);
            }
        }
    };

    const dataStats = getAllData();

    return (
        <div>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-6">Data & Backups</h1>

            <div className="mb-8">
                <DatabaseMigration />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Storage Stats */}
                <div className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Database className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-medium">Storage Statistics</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-muted-foreground">Total Products</span>
                            <span className="font-semibold">{dataStats.products.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-muted-foreground">Total Orders</span>
                            <span className="font-semibold">{dataStats.orders.length}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                            <span className="text-muted-foreground">Data Location</span>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">Browser LocalStorage</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                    <h2 className="text-lg font-medium mb-4">Export Data</h2>
                    <div className="space-y-3">
                        <Button
                            onClick={handleExportProductsTxt}
                            className="w-full flex items-center justify-center gap-2"
                            variant="outline"
                        >
                            <Download className="h-4 w-4" />
                            Export Products (TXT)
                        </Button>

                        <Button
                            onClick={handleExportEmailsTxt}
                            className="w-full flex items-center justify-center gap-2"
                            variant="outline"
                        >
                            <Download className="h-4 w-4" />
                            Export Emails (TXT)
                        </Button>

                        <Button
                            onClick={handleExportPnL}
                            className="w-full flex items-center justify-center gap-2"
                            variant="outline"
                        >
                            <Download className="h-4 w-4" />
                            Export P&L (CSV)
                        </Button>

                        <div className="h-px bg-border my-4" />

                        <Button
                            onClick={handleExport}
                            className="w-full flex items-center justify-center gap-2"
                            variant="secondary"
                        >
                            <Download className="h-4 w-4" />
                            Full System Backup (JSON)
                        </Button>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-medium mb-4">Import Data</h2>
                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImport}
                                accept=".json"
                                className="hidden"
                            />
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2"
                                variant="outline"
                            >
                                <Upload className="h-4 w-4" />
                                Restore System (JSON)
                            </Button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <h3 className="text-sm font-medium text-destructive mb-3">Danger Zone</h3>
                        <Button
                            onClick={handleReset}
                            variant="destructive"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Reset All Data
                        </Button>

                        <Button
                            onClick={async () => {
                                if (confirm('WARNING: This will permanently delete ALL order history and analytics data from the database. This action cannot be undone.')) {
                                    if (confirm('Are you absolutely sure?')) {
                                        await clearAllOrders();
                                    }
                                }
                            }}
                            variant="destructive"
                            className="w-full flex items-center justify-center gap-2 mt-3"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear Order History
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="flex items-center gap-2 text-blue-800 font-medium mb-1">
                    <RefreshCw className="h-4 w-4" />
                    About Your Data
                </h4>
                <p className="text-sm text-blue-700">
                    Your data is stored locally in your browser. This makes it fast and keeps it on your device.
                    However, if you clear your browser's "Site Data" or "Cache", you might lose it.
                    We recommend <strong>exporting a backup regularly</strong>.
                </p>
            </div>
        </div>
    );
};

export default DataTab;
