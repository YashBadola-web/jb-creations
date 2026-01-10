import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

import { CATEGORY_HIERARCHY } from '@/data/categories';

interface CategoryItem {
  id: string;
  label: string;
  icon?: string;
}

const categories: CategoryItem[] = [
  { id: 'all', label: 'All Products', icon: '✨' },
  ...CATEGORY_HIERARCHY.map(cat => ({
    id: cat.id,
    label: cat.label,
  }))
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-col gap-4 py-8">
      {/* Main Categories */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          // Check if this category or one of its subcategories is selected
          const main = CATEGORY_HIERARCHY.find(m => m.id === category.id);
          const isActive = selectedCategory === category.id || main?.subCategories.some(s => s.id === selectedCategory);

          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.label}
            </motion.button>
          );
        })}
      </div>

      {/* Subcategories */}
      <div className="flex flex-wrap justify-center gap-2 min-h-[40px]">
        {(() => {
          // Find the active main category
          const activeMain = CATEGORY_HIERARCHY.find(
            (m) => m.id === selectedCategory || m.subCategories.some((s) => s.id === selectedCategory)
          );

          if (!activeMain || activeMain.subCategories.length === 0) return null;

          return (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-2 bg-muted/30 p-2 rounded-xl"
            >
              <button
                key={`${activeMain.id}-all`}
                onClick={() => onCategoryChange(activeMain.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === activeMain.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-muted/50'
                  }`}
              >
                All {activeMain.label.split(' ')[1]}
              </button>
              {activeMain.subCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onCategoryChange(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === sub.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                >
                  {sub.label}
                </button>
              ))}
            </motion.div>
          );
        })()}
      </div>
    </div>
  );
};

export default CategoryFilter;
