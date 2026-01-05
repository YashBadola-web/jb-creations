import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'payments', label: 'Payment Settings', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold text-foreground">
            JB Crafts
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <Link to="/" className="font-display text-2xl font-semibold text-foreground">
            JB Crafts
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
