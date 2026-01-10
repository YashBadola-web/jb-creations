import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[image:var(--gradient-hero)] text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-sm font-medium text-white/90 mb-4 tracking-wider uppercase">
            Handcrafted with Love
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
            Artisanal Crafts for{' '}
            <span className="text-yellow-gold">Your Home</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Discover unique resin art, handcarved wooden toys, and beautiful
            home decor. Each piece is lovingly crafted to bring warmth and
            character to your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="w-full sm:w-auto group">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/category/resin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Resin Art
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-sage/10 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
