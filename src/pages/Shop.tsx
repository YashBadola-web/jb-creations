import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import { getCategoryLabel } from '@/data/categories';
import SEO from '@/components/common/SEO';

const Shop: React.FC = () => {
  const { category: paramCategory } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchCategory = searchParams.get('category');

  const { products } = useStore();

  // Prioritize search param, then path param, then 'all'
  const initialCategory = searchCategory || paramCategory || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sync state with URL changes
  useEffect(() => {
    const current = searchCategory || paramCategory || 'all';
    setSelectedCategory(current);
  }, [searchCategory, paramCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL to reflect change (optional but good for UX)
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory || p.subcategory === selectedCategory);

  // Dynamic titles based on category ID
  const pageTitle = selectedCategory === 'all' ? 'All Products' : getCategoryLabel(selectedCategory);
  const pageDescription = selectedCategory === 'all'
    ? 'Explore our complete collection of handcrafted artisanal pieces'
    : `Browse our exclusive collection of ${pageTitle}`;

  return (
    <Layout>
      <SEO
        title={pageTitle}
        description={pageDescription}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {pageDescription}
          </p>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />



        <ProductGrid products={filteredProducts} />
      </div>
    </Layout>
  );
};

export default Shop;
