import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'resin',
    title: 'Resin Art',
    description: 'Mesmerizing ocean waves, geode patterns, and botanical beauty captured in crystal-clear resin.',
    image: 'https://images.unsplash.com/photo-1620783770629-122b7f187703?w=600',
    color: 'from-blue-100/50 to-cyan-50/50',
  },
  {
    id: 'kids',
    title: 'Kids Collection',
    description: 'Handcrafted wooden toys designed to spark imagination and provide safe, sustainable play.',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600',
    color: 'from-amber-100/50 to-yellow-50/50',
  },
  {
    id: 'decor',
    title: 'Home Decor',
    description: 'Statement pieces that transform your space with artisanal charm and handmade character.',
    image: 'https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=600',
    color: 'from-sage/20 to-green-50/50',
  },
];

const CategoryShowcase: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Explore Our Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each collection tells a unique story of craftsmanship and creativity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Link
                to={`/category/${category.id}`}
                className="group block relative overflow-hidden rounded-2xl bg-background"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
                <div className="relative p-6 pb-0">
                  <div className="overflow-hidden rounded-xl mb-6">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium pb-6">
                    <span>Browse Collection</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
