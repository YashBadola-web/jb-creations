import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { cart } = useStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/category/resin', label: 'Resin Art' },
    { href: '/category/kids', label: 'Kids' },
    { href: '/category/decor', label: 'Decor' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              JB Crafts
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hidden md:block">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-base font-medium transition-colors ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-muted-foreground"
                >
                  Admin Panel
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
