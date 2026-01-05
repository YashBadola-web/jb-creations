import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All Products', icon: '✨' },
  { id: 'resin', label: 'Resin Art', icon: '🌊' },
  { id: 'kids', label: 'Kids Toys', icon: '🧸' },
  { id: 'decor', label: 'Home Decor', icon: '🏠' },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 py-8">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategory === category.id
              ? 'bg-primary text-primary-foreground shadow-soft'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.label}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
