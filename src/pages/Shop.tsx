import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';

const Shop: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const categoryTitles: Record<string, string> = {
    all: 'All Products',
    resin: 'Resin Art Collection',
    kids: 'Kids Collection',
    decor: 'Home Decor',
  };

  const categoryDescriptions: Record<string, string> = {
    all: 'Explore our complete collection of handcrafted artisanal pieces',
    resin: 'Mesmerizing ocean waves, geode patterns, and botanical beauty captured in crystal-clear resin',
    kids: 'Handcrafted wooden toys designed to spark imagination and provide safe, sustainable play',
    decor: 'Statement pieces that transform your space with artisanal charm and handmade character',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            {categoryTitles[selectedCategory] || 'Shop'}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {categoryDescriptions[selectedCategory]}
          </p>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ProductGrid products={filteredProducts} />
      </div>
    </Layout>
  );
};

export default Shop;
