import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/common/SEO';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useStore();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = products.find((p) => p.id === id);
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== id)
    .slice(0, 4);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Product not found</h1>
          <Link to="/shop">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isCustomizable = product.category === 'customised_items' ||
    product.category === 'custom_mdf' ||
    product.category === 'custom_quotes' ||
    product.category === 'custom_stickers' ||
    product.category === 'resin_stickers' ||
    product.subcategory === 'custom_mdf' ||
    product.subcategory === 'custom_quotes' ||
    product.subcategory === 'custom_stickers' ||
    product.subcategory === 'resin_stickers';

  const handleAddToCart = () => {
    if (isCustomizable && !customText.trim()) {
      toast({
        variant: "destructive",
        title: "Customization Required",
        description: "Please enter your custom text/name.",
      });
      return;
    }
    addToCart(product, quantity, customText);
    toast({
      title: 'Added to cart',
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
    setCustomText('');
  };

  return (
    <Layout>
      <SEO
        title={product.name}
        description={product.description}
        type="product"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl overflow-hidden bg-muted aspect-square">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              {product.category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              {product.name}
            </h1>
            <p className="font-display text-3xl text-primary mb-6">
              {product.displayPrice}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Customization Input */}
            {isCustomizable && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Personalization Required:
                </label>
                <textarea
                  className="w-full p-2 rounded-md border border-input bg-background text-sm min-h-[80px]"
                  placeholder="Enter custom text, names, or quotes here..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="inline-flex items-center text-sm text-secondary-foreground">
                  <span className="w-2 h-2 bg-sage rounded-full mr-2" />
                  {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                </span>
              ) : (
                <span className="inline-flex items-center text-sm text-destructive">
                  <span className="w-2 h-2 bg-destructive rounded-full mr-2" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-border pt-6 space-y-3 text-sm text-muted-foreground">
              <p>✓ Handcrafted with care</p>
              <p>✓ Free shipping on orders over ₹999</p>
              <p>✓ Secure packaging for safe delivery</p>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ProductGrid
            products={relatedProducts}
            title="You May Also Like"
          />
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
