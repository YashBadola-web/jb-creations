import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardTab from '@/components/admin/DashboardTab';
import ProductsTab from '@/components/admin/ProductsTab';
import OrdersTab from '@/components/admin/OrdersTab';
import PaymentsTab from '@/components/admin/PaymentsTab';
import DataTab from '@/components/admin/DataTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import MarketingTab from '@/components/admin/MarketingTab';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAdmin, user } = useAuth();

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You do not have permission to view this page.</p>
        <a href="/login" className="text-primary hover:underline">Go to Login</a>
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'products' && <ProductsTab />}
      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'payments' && <PaymentsTab />}
      {activeTab === 'data' && <DataTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'marketing' && <MarketingTab />}
    </AdminLayout>
  );
};

export default Admin;
