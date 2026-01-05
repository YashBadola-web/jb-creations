import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, AdminSettings, formatPriceINR } from '@/types';
import { initialProducts } from '@/data/products';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  adminSettings: AdminSettings;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { totalInPaise: number; displayTotal: string };
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'displayPrice'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const defaultAdminSettings: AdminSettings = {
  payment: {
    upiId: 'jbcrafts@upi',
    upiQrCode: null,
    razorpayEnabled: true,
    codEnabled: true,
  },
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('jbcrafts_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jbcrafts_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('jbcrafts_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('jbcrafts_settings');
    return saved ? JSON.parse(saved) : defaultAdminSettings;
  });

  useEffect(() => {
    localStorage.setItem('jbcrafts_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('jbcrafts_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jbcrafts_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('jbcrafts_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    const totalInPaise = cart.reduce(
      (sum, item) => sum + item.product.priceInPaise * item.quantity,
      0
    );
    return { totalInPaise, displayTotal: formatPriceINR(totalInPaise) };
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'displayPrice'>) => {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      displayPrice: formatPriceINR(product.priceInPaise),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              ...updates,
              displayPrice: updates.priceInPaise
                ? formatPriceINR(updates.priceInPaise)
                : p.displayPrice,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateAdminSettings = (settings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({
      ...prev,
      ...settings,
      payment: { ...prev.payment, ...settings.payment },
    }));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        adminSettings,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        addProduct,
        updateProduct,
        deleteProduct,
        updateAdminSettings,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
