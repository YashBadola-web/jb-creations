
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, UserCheck, Power } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CATEGORY_HIERARCHY } from '@/data/categories';
import { ChevronDown, ChevronRight } from 'lucide-react';

const Header: React.FC = () => {
  const { cart } = useStore();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[image:var(--gradient-hero)] text-white border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="/" className="text-2xl font-display font-bold text-white hover:opacity-90 transition-opacity">
              JB Creations
            </a>
          </div>

          {/* Desktop Navigation - Mega Menu */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Home</Link>

            {/* Shop Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveCategory('shop-root')}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <div className="flex items-center gap-1 cursor-pointer py-4">
                <Link
                  to="/shop"
                  className="text-sm font-medium transition-colors text-white/90 group-hover:text-white flex items-center gap-1"
                >
                  Shop
                  <ChevronDown className="h-3 w-3 opacity-70 group-hover:rotate-180 transition-transform" />
                </Link>
              </div>

              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-0 w-[600px] -ml-20 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="bg-card border border-border rounded-lg shadow-xl p-6 grid grid-cols-3 gap-6">
                  {CATEGORY_HIERARCHY.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <Link
                        to={`/shop?category=${category.id}`}
                        className="font-medium text-foreground hover:text-primary block"
                      >
                        {category.label}
                      </Link>
                      {!category.isStandalone && (
                        <div className="space-y-1">
                          {category.subCategories.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/shop?category=${sub.id}`}
                              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/about" className="text-sm font-medium text-white/90 hover:text-white transition-colors">About</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin" className="hidden md:block">
                <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                  <UserCheck className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {user ? (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-white/80 hover:text-white hover:bg-white/10"
                onClick={logout}
                title="Logout"
              >
                <Power className="h-5 w-5" />
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link to="/login?mode=register">
                  <Button variant="default" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-yellow-gold text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
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
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div >

        {/* Mobile Navigation */}
        <AnimatePresence>
          {
            mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden border-t border-border"
              >
                <div className="py-4 space-y-2">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base font-medium text-foreground border-b border-border/50"
                  >
                    Home
                  </Link>

                  <div className="border-b border-border/50">
                    <button
                      onClick={() => setMobileExpandedCategory(mobileExpandedCategory === 'shop' ? null : 'shop')}
                      className="flex items-center justify-between w-full py-3 text-base font-medium text-foreground"
                    >
                      Shop
                      <ChevronRight className={`h-4 w-4 transition-transform ${mobileExpandedCategory === 'shop' ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {mobileExpandedCategory === 'shop' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-muted/30"
                        >
                          {CATEGORY_HIERARCHY.map((category) => (
                            <div key={category.id} className="border-l-2 border-border ml-2 pl-2 my-1">
                              <Link
                                to={`/shop?category=${category.id}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 text-sm font-medium text-foreground hover:text-primary"
                              >
                                {category.label}
                              </Link>
                              {!category.isStandalone && (
                                <div className="pl-2 space-y-1 border-l border-border/50 ml-1">
                                  {category.subCategories.map((sub) => (
                                    <Link
                                      key={sub.id}
                                      to={`/shop?category=${sub.id}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block py-1 text-xs text-muted-foreground hover:text-primary"
                                    >
                                      {sub.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base font-medium text-foreground border-b border-border/50"
                  >
                    About
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-base font-medium text-muted-foreground"
                    >
                      Admin Panel
                    </Link>
                  )}
                  {user ? (
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-base font-medium text-muted-foreground"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-base font-medium text-muted-foreground"
                      >
                        Login
                      </Link>
                      <Link
                        to="/login?mode=register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-base font-medium text-primary"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </motion.nav>
            )
          }
        </AnimatePresence >
      </div >
    </header >
  );
};

export default Header;
