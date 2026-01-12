import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getCategoryLabel } from '@/data/categories';

const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useStore();
  const { displayTotal } = getCartTotal();

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items yet. Start exploring our handcrafted collection.
            </p>
            <Link to="/shop">
              <Button>
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-semibold text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 bg-card rounded-lg border border-border"
              >
                <Link to={`/product/${item.product.id}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground capitalize mb-1">
                    {getCategoryLabel(item.product.category)}
                  </p>
                  {item.customText && (
                    <p className="text-xs text-primary italic mb-1">
                      " {item.customText} "
                    </p>
                  )}
                  {item.customSize && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Size: {item.customSize}
                    </p>
                  )}
                  <p className="font-display text-lg text-foreground">
                    {item.product.displayPrice}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.product.id, item.customText, item.customSize)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.customText, item.customSize)}
                      className="h-8 w-8"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.customText, item.customSize)}
                      disabled={item.quantity >= item.product.stock}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{displayTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between py-4">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-display text-xl text-foreground">{displayTotal}</span>
              </div>

              <Link to="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Free shipping on orders over ₹999
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
