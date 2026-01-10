import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloater from '@/components/common/WhatsAppFloater';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <WhatsAppFloater />
      <Footer />
    </div>
  );
};

export default Layout;
