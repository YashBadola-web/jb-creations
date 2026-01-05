import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardTab from '@/components/admin/DashboardTab';
import ProductsTab from '@/components/admin/ProductsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import PaymentsTab from '@/components/admin/PaymentsTab';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'products' && <ProductsTab />}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'payments' && <PaymentsTab />}
      {activeTab === 'analytics' && (
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground mb-6">Analytics</h1>
          <p className="text-muted-foreground">Analytics dashboard coming soon. Connect to a backend for detailed insights.</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default Admin;
