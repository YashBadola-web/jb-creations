import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-cream to-beige">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <span className="inline-block text-sm font-medium text-primary mb-4 tracking-wider uppercase">
              Handcrafted with Love
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
              Artisanal Crafts for{' '}
              <span className="text-primary">Your Home</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Discover unique resin art, handcarved wooden toys, and beautiful 
              home decor. Each piece is lovingly crafted to bring warmth and 
              character to your space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="rounded-2xl overflow-hidden shadow-card"
                >
                  <img
                    src="https://images.unsplash.com/photo-1620783770629-122b7f187703?w=400"
                    alt="Resin Art Coasters"
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="rounded-2xl overflow-hidden shadow-card"
                >
                  <img
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
                    alt="Wooden Toys"
                    className="w-full h-32 object-cover"
                  />
                </motion.div>
              </div>
              <div className="space-y-4 pt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="rounded-2xl overflow-hidden shadow-card"
                >
                  <img
                    src="https://images.unsplash.com/photo-1616627988170-6c5c0f586d14?w=400"
                    alt="Resin Tray"
                    className="w-full h-36 object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="rounded-2xl overflow-hidden shadow-card"
                >
                  <img
                    src="https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=400"
                    alt="Macrame Decor"
                    className="w-full h-44 object-cover"
                  />
                </motion.div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full shadow-soft"
            >
              <span className="text-sm font-medium">🇮🇳 Made in India</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-sage/10 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
