import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, TrendingUp, IndianRupee } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPriceINR } from '@/types';

const DashboardTab: React.FC = () => {
  const { products, orders } = useStore();

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalInPaise, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const lowStockProducts = products.filter((p) => p.stock < 5).length;

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPriceINR(totalRevenue),
      icon: IndianRupee,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Total Products',
      value: products.length.toString(),
      icon: Package,
      color: 'bg-secondary/20 text-sage-dark',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'Completed Orders',
      value: completedOrders.toString(),
      icon: TrendingUp,
      color: 'bg-green-100 text-green-700',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground mb-6">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-lg border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="font-display text-2xl font-semibold text-foreground">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      {lowStockProducts > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <p className="text-amber-800 text-sm font-medium">
            ⚠️ {lowStockProducts} product(s) have low stock (less than 5 units)
          </p>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-5 border-b border-border">
          <h2 className="font-medium text-foreground">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No orders yet
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{order.customerInfo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item(s) • {order.displayTotal}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : order.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'shipped'
                      ? 'bg-purple-100 text-purple-700'
                      : order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;
