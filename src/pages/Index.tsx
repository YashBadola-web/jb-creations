import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';

const Index: React.FC = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const featuredProducts = products.filter((p) => p.featured);
  
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <Hero />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <ProductGrid
          products={featuredProducts.slice(0, 4)}
          title="Featured Pieces"
          subtitle="Hand-selected favorites from our artisan collection"
        />
      </section>

      {/* All Products with Filter */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-4">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Shop All Products
          </h2>
        </div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id}>
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

// Import at component level to avoid circular deps
import ProductCard from '@/components/products/ProductCard';

export default Index;
