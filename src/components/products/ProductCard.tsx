import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

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

  const isBestSeller = product.featured || (product.sales && product.sales > 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-muted aspect-square mb-4">
          {/* Product Image Carousel */}
          <div className="relative w-full h-full">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {product.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

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
