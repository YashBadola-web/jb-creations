import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import SEO from '@/components/common/SEO';

const Index: React.FC = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const featuredProducts = products.filter((p) => p.featured);

  // Normalize helper (duplicated from Shop.tsx for now to ensure consistency)
  const normalizeCategory = (cat: string | undefined): string => {
    if (!cat) return '';
    const lower = cat.toLowerCase().trim();
    if (lower === 'resin' || lower === 'resin art' || lower === 'resin works') return 'resin_materials';
    if (lower === 'decor' || lower === 'home decor' || lower === 'kids') return 'home_decor';
    return cat;
  };

  // Helper to normalize subcategories
  const normalizeSubcategory = (sub: string | undefined): string => {
    if (!sub) return '';
    const lower = sub.toLowerCase().trim();
    if (lower.includes('color') || lower.includes('pigment')) return 'resin_color';
    if (lower.includes('mould') || lower.includes('mold')) return 'resin_moulds';
    if (lower.includes('flower') || lower.includes('dry')) return 'resin_dry_flower';
    if (lower.includes('essential') && lower.includes('resin')) return 'resin_essentials';
    if (lower.includes('sticker')) return 'resin_stickers';
    if (lower.includes('wax')) return 'candle_wax';
    if (lower.includes('fragrance') || lower.includes('scent')) return 'candle_fragrance';
    if (lower.includes('wick')) return 'candle_wicks';
    return sub;
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => {
        const productCategory = normalizeCategory(p.category);
        const productSubcategory = normalizeSubcategory(p.subcategory);

        if (productCategory === selectedCategory) return true;
        if (productSubcategory === selectedCategory) return true;
        if (p.subcategory === selectedCategory) return true;

        return false;
      });

  return (
    <Layout>
      <SEO title="Home" />
      {/* Hero Section */}
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <ProductGrid
          products={featuredProducts.slice(0, 4)}
          title="Featured Pieces"
          subtitle="Hand-selected favorites from our artisan collection"
        />
      </section>

      {/* Most Purchased Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">MOST PURCHASED</h2>
          <p className="text-muted-foreground mt-2">Our customer favorites</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...products]
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 4)
            .map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
        </div>
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
