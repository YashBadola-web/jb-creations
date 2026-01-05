import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
              JB Crafts
            </h3>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Handcrafted with love. Each piece tells a story of artisanal 
              dedication, bringing unique resin art, wooden toys, and home 
              decor to your doorstep.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@jbcrafts.in"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="tel:+919876543210"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Phone"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/category/resin" className="text-muted-foreground hover:text-primary transition-colors">
                  Resin Art
                </Link>
              </li>
              <li>
                <Link to="/category/kids" className="text-muted-foreground hover:text-primary transition-colors">
                  Kids Collection
                </Link>
              </li>
              <li>
                <Link to="/category/decor" className="text-muted-foreground hover:text-primary transition-colors">
                  Home Decor
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground">
                  Free shipping on orders over ₹999
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} JB Crafts. All rights reserved. Made with ♥ in India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
