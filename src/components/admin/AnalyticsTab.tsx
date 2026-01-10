import React, { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { formatPriceINR, parsePriceToINR } from '@/types';
import { IndianRupee, ShoppingBag, TrendingUp, Package } from 'lucide-react';
import PnLView from './PnLView';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsTab: React.FC = () => {
    const { orders, products } = useStore();

    const metrics = useMemo(() => {
        // Basic Metrics
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status !== 'cancelled');
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalInPaise, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Average Items Per Order
        const totalItemsSold = completedOrders.reduce((sum, order) => sum + order.items.reduce((acc, item) => acc + item.quantity, 0), 0);
        const avgItemsPerOrder = totalOrders > 0 ? (totalItemsSold / totalOrders).toFixed(1) : "0";

        // Returning Customer Rate
        const customerOrders = new Map<string, number>();
        orders.forEach(o => {
            const email = o.customerInfo.email;
            customerOrders.set(email, (customerOrders.get(email) || 0) + 1);
        });
        const returningCustomers = Array.from(customerOrders.values()).filter(count => count > 1).length;
        const totalCustomers = customerOrders.size;
        const returningRate = totalCustomers > 0 ? ((returningCustomers / totalCustomers) * 100).toFixed(1) : "0";

        // Low Stock Products
        const lowStockProducts = products.filter(p => p.stock < 5 && p.stock > 0);
        const outOfStockProducts = products.filter(p => p.stock === 0);

        // Sales Trend
        const salesByDateMap = new Map<string, number>();
        completedOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();
            const current = salesByDateMap.get(date) || 0;
            salesByDateMap.set(date, current + (order.totalInPaise / 100)); // Store in Rupees for chart
        });

        const salesTrend = Array.from(salesByDateMap.entries())
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Order Status Distribution
        const statusCount = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const statusDistribution = Object.keys(statusCount).map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: statusCount[status]
        }));

        // Revenue by Category
        const categoryRevenue = new Map<string, number>();
        completedOrders.forEach(order => {
            order.items.forEach(item => {
                const current = categoryRevenue.get(item.product.category) || 0;
                categoryRevenue.set(item.product.category, current + (item.product.priceInPaise * item.quantity / 100));
            });
        });

        const revenueByCategory = Array.from(categoryRevenue.entries())
            .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

        // Top Products
        const productSales = new Map<string, number>();
        completedOrders.forEach(order => {
            order.items.forEach(item => {
                const current = productSales.get(item.product.name) || 0;
                productSales.set(item.product.name, current + item.quantity);
            });
        });

        const topProducts = Array.from(productSales.entries())
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        return {
            totalOrders,
            totalRevenue,
            averageOrderValue,
            salesTrend,
            statusDistribution,
            topProducts,
            avgItemsPerOrder,
            returningRate,
            lowStockProducts,
            outOfStockProducts,
            revenueByCategory
        };
    }, [orders, products]);

    const [view, setView] = React.useState<'overview' | 'pnl'>('overview');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="font-display text-2xl font-semibold text-foreground">Analytics Overview</h1>
                    <p className="text-muted-foreground">Key metrics and business performance insights.</p>
                </div>
                <div className="flex bg-muted rounded-lg p-1">
                    <button
                        onClick={() => setView('overview')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'overview' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setView('pnl')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'pnl' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Profit & Loss
                    </button>
                </div>
            </div>

            {view === 'pnl' ? (
                <PnLView />
            ) : (
                <>
                    {/* Key Metrics Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatPriceINR(metrics.totalRevenue)}</div>
                                <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatPriceINR(metrics.averageOrderValue)}</div>
                                <p className="text-xs text-muted-foreground">Per order average</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Return Customer Rate</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics.returningRate}%</div>
                                <p className="text-xs text-muted-foreground">Loyalty metric</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Items/Order</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metrics.avgItemsPerOrder}</div>
                                <p className="text-xs text-muted-foreground">Basket size</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Inventory Alerts */}
                    {metrics.lowStockProducts.length > 0 || metrics.outOfStockProducts.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {metrics.outOfStockProducts.length > 0 && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                    <h3 className="text-destructive font-medium flex items-center gap-2 mb-2">
                                        <Package className="h-4 w-4" /> Out of Stock ({metrics.outOfStockProducts.length})
                                    </h3>
                                    <ul className="text-sm text-destructive/80 space-y-1">
                                        {metrics.outOfStockProducts.slice(0, 3).map(p => (
                                            <li key={p.id}>• {p.name}</li>
                                        ))}
                                        {metrics.outOfStockProducts.length > 3 && <li>...and more</li>}
                                    </ul>
                                </div>
                            )}
                            {metrics.lowStockProducts.length > 0 && (
                                <div className="bg-amber-100 border border-amber-200 rounded-lg p-4">
                                    <h3 className="text-amber-800 font-medium flex items-center gap-2 mb-2">
                                        <Package className="h-4 w-4" /> Low Stock Alert ({metrics.lowStockProducts.length})
                                    </h3>
                                    <ul className="text-sm text-amber-700 space-y-1">
                                        {metrics.lowStockProducts.slice(0, 3).map(p => (
                                            <li key={p.id}>• {p.name} ({p.stock} left)</li>
                                        ))}
                                        {metrics.lowStockProducts.length > 3 && <li>...and more</li>}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : null}

                    {/* Charts Row 1: Trends & Distribution */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Revenue Trend</CardTitle>
                                <CardDescription>Daily revenue from completed orders</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[300px]">
                                    {metrics.salesTrend.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={metrics.salesTrend}>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                                <Tooltip
                                                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                                />
                                                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">No sales data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Order Status</CardTitle>
                                <CardDescription>Distribution of order statuses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    {metrics.statusDistribution.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={metrics.statusDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {metrics.statusDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">No orders available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row 2: Category & Top Products */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue by Category</CardTitle>
                                <CardDescription>Which categories earn the most</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    {metrics.revenueByCategory.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={metrics.revenueByCategory}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    paddingAngle={5}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {metrics.revenueByCategory.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Top Selling Products</CardTitle>
                                <CardDescription>Most popular items by quantity</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    {metrics.topProducts.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={metrics.topProducts} layout="vertical" margin={{ left: 50 }}>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={150} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} itemStyle={{ color: 'hsl(var(--foreground))' }} />
                                                <Bar dataKey="quantity" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]}>
                                                    {metrics.topProducts.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">No sales data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsTab;
