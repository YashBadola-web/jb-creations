import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import { getCategoryLabel } from '@/data/categories';
import SEO from '@/components/common/SEO';

const Shop: React.FC = () => {
  // Normalize legacy categories to new hierarchy
  const normalizeCategory = (cat: string | undefined): string => {
    if (!cat) return '';
    const lower = cat.toLowerCase().trim();
    if (lower === 'resin' || lower === 'resin art' || lower === 'resin works') return 'resin_materials';
    if (lower === 'decor' || lower === 'home decor' || lower === 'kids') return 'home_decor';
    return cat; // Return as-is if no overwrite needed (e.g. 'candle_making')
  };

  // Helper to normalize subcategories by trying to match IDs or Labels from hierarchy
  const normalizeSubcategory = (sub: string | undefined): string => {
    if (!sub) return '';
    const lower = sub.toLowerCase().trim();

    // Direct Hierarchy Lookup (Reverse Search)
    // We want to find if 'sub' matches any known subcategory ID or Label in our data
    // import { CATEGORY_HIERARCHY } from '@/data/categories' is needed but expensive to iterate every time? 
    // Data is small enough.

    // Hardcoded common mappings for robustness
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

  const { category: paramCategory } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchCategory = searchParams.get('category');

  const { products } = useStore();

  // Prioritize search param, then path param, then 'all'
  // Normalize the input category to ensure it matches current hierarchy
  const rawCategory = searchCategory || paramCategory || 'all';
  const initialCategory = rawCategory === 'all' ? 'all' : normalizeCategory(rawCategory);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Sync state with URL changes
  useEffect(() => {
    const current = searchCategory || paramCategory || 'all';
    setSelectedCategory(current === 'all' ? 'all' : normalizeCategory(current));
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
      : products.filter((p) => {
        const productCategory = normalizeCategory(p.category);
        const productSubcategory = normalizeSubcategory(p.subcategory);

        // Debugging Log (Temporary)
        console.log(`Checking ${p.name}: Cat('${p.category}'->'${productCategory}') Sub('${p.subcategory}'->'${productSubcategory}') vs Selected('${selectedCategory}')`);

        // Check exact match on category (normalized)
        if (productCategory === selectedCategory) return true;

        // Check exact match on subcategory (normalized)
        if (productSubcategory === selectedCategory) return true;

        // Check if the selected category is actually the subcategory ID that matches
        // e.g. User selected 'resin_color', product has subcategory 'resin_color'
        if (p.subcategory === selectedCategory) return true;

        return false;
      });

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

      {/* TEMP DEBUGGER */}
      <div className="fixed top-20 left-0 w-full z-[9999] bg-yellow-400 border-b border-black text-black font-bold p-4 text-sm font-mono text-center shadow-lg">
        DEBUG MODE ACTIVE: Selected="{selectedCategory}" | Total Products={products.length} | Filtered={filteredProducts.length}
      </div>

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
