import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getCategoryLabel } from '@/data/categories';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Badge Logic
  const isNew = React.useMemo(() => {
    const isRecent = (new Date().getTime() - new Date(product.createdAt).getTime()) < (30 * 24 * 60 * 60 * 1000);
    return isRecent || product.category === 'pipe_cleaners';
  }, [product]);

  const isBestSeller = product.featured || product.category === 'diy_kits';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-muted aspect-square mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            {isNew && (
              <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                New Arrival
              </span>
            )}
            {isBestSeller && (
              <span className="bg-amber-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                Best Seller
              </span>
            )}
            {product.stock < 5 && product.stock > 0 && (
              <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                Only {product.stock} left
              </span>
            )}
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-foreground font-medium">Out of Stock</span>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute bottom-3 right-3"
          >
            <Button
              size="icon"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {getCategoryLabel(product.category)}
            {product.subcategory && ` > ${getCategoryLabel(product.subcategory).split(' > ').pop()}`}
          </p>
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="font-display text-lg text-foreground">
            {product.displayPrice}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
