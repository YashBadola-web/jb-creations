import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, CreditCard, Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail('');
  };
  return (
    <footer className="bg-[#F9F9F9] text-[#333333] font-body border-t border-gray-200 mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 tracking-wide">Stay Connected</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Know about the resin, candles, home decor work and items.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-white border-gray-300 focus-visible:ring-primary h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="font-bold h-12 px-8 tracking-wider bg-black text-white hover:bg-gray-800"
              onClick={handleSubscribe}
            >
              SUBSCRIBE
            </Button>
          </div>

          <div className="mt-8">
            <p className="text-gray-600 mb-4 text-sm">Join our community for exclusive updates & offers!</p>
            <a
              href="https://chat.whatsapp.com/GcsdoaQw3lHB2uxE1wZHKP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#25D366] px-8 text-sm font-bold text-white shadow transition-colors hover:bg-[#128C7E] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              JOIN WHATSAPP COMMUNITY
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Information */}
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-wide uppercase text-black">Information</h4>
            <ul className="space-y-4">
              <li><Link to="/search" className="text-gray-600 hover:text-black transition-colors text-sm">Search</Link></li>
              <li><Link to="/contact-us" className="text-gray-600 hover:text-black transition-colors text-sm">Contact us</Link></li>
              <li><Link to="/refund-policy" className="text-gray-600 hover:text-black transition-colors text-sm">Refund policy</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-black transition-colors text-sm">Privacy policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-600 hover:text-black transition-colors text-sm">Terms of service</Link></li>
              <li><Link to="/shipping-policy" className="text-gray-600 hover:text-black transition-colors text-sm">Shipping policy</Link></li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-wide uppercase text-black">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/shop?category=resin_materials" className="text-gray-600 hover:text-black transition-colors text-sm">Resin Materials</Link></li>
              <li><Link to="/shop?category=candle_making" className="text-gray-600 hover:text-black transition-colors text-sm">Candle Making</Link></li>
              <li><Link to="/shop?category=customised_items" className="text-gray-600 hover:text-black transition-colors text-sm">Customised Items</Link></li>
              <li><Link to="/shop?category=packing_material" className="text-gray-600 hover:text-black transition-colors text-sm">Packing Material</Link></li>
              <li><Link to="/shop?category=diy_kits" className="text-gray-600 hover:text-black transition-colors text-sm">DIY Kits</Link></li>
              <li><Link to="/shop?category=pipe_cleaners" className="text-gray-600 hover:text-black transition-colors text-sm">Pipe Cleaners</Link></li>
            </ul>
          </div>

          {/* Column 3: Mission & Brand */}
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-wide uppercase text-black">Our Mission</h4>
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed text-sm">
                At JB Creations, we provide high-quality resin materials, candle waxes, and tools for artists and hobbyists. We believe in quality supplies for quality creations.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/jb_creations_supplies" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-black transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="mailto:jbcreations1983@gmail.com" aria-label="Email" className="text-gray-500 hover:text-black transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
                <a href="tel:+919958686464" aria-label="Contact" className="text-gray-500 hover:text-black transition-colors">
                  <Phone className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-gray-700">
            India | INR ₹
          </div>

          <div className="flex gap-4 text-gray-400">
            {/* Payment Icons Placeholder - using Lucide/Text as generic placeholders or SVGs if available */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold border border-gray-300 px-2 py-1 rounded tracking-tighter">UPI</span>
              <CreditCard className="h-6 w-6" />
              <span className="text-xs font-bold text-blue-800 tracking-tighter">VISA</span>
              <span className="text-xs font-bold text-red-600 tracking-tighter">MC</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center md:text-right">
            © {new Date().getFullYear()}, JB Creations Powered by JB Tech
          </div>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
