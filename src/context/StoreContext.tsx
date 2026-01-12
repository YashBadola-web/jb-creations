
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, AdminSettings, formatPriceINR, Coupon } from '@/types';
import { initialProducts } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  adminSettings: AdminSettings;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, customText?: string, customSize?: string) => void;
  removeFromCart: (productId: string, customText?: string, customSize?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, customText?: string, customSize?: string) => void;
  clearCart: () => void;
  getCartTotal: () => { totalInPaise: number; displayTotal: string };
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'displayPrice'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  shippingOverrides: Record<string, number>;
  updateShippingOverride: (date: string, cost: number) => void;
  feeOverrides: Record<string, number>;
  updateFeeOverride: (date: string, cost: number) => void;
  updateOrderProductCost: (orderId: string, productId: string, costInPaise: number) => void;

  updatePaymentStatus: (orderId: string, status: Order['paymentStatus'], transactionId?: string) => Promise<void>;
  clearAllOrders: () => Promise<void>;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  discountAmount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const defaultAdminSettings: AdminSettings = {
  payment: {
    upiId: 'jbcrafts@upi',
    upiQrCode: null,
    razorpayEnabled: true,
    razorpayKeyId: '', // Default empty, user must configure
    codEnabled: false,
  },
  marketing: {
    whatsappGroupUrl: '',
  },
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // --- Data State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jbcrafts_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse cart from local storage", e);
      return [];
    }
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem('jbcrafts_settings');
      return saved ? JSON.parse(saved) : defaultAdminSettings;
    } catch (e) {
      console.error("Failed to parse settings", e);
      return defaultAdminSettings;
    }
  });

  const [shippingOverrides, setShippingOverrides] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('jbcrafts_shipping_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  const [feeOverrides, setFeeOverrides] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('jbcrafts_fee_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('jbcrafts_coupons');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // --- Initial Fetch (Load from LocalStorage) ---
  useEffect(() => {
    const initializeStore = async () => {
      try {
        console.log("Initializing Store...");
        // Load Cart
        const storedCart = localStorage.getItem('jbcrafts_cart');
        if (storedCart) {
          try {
            setCart(JSON.parse(storedCart));
          } catch (e) { console.error("Error parsing cart in effect", e); }
        }

        // Load Admin Settings
        const storedSettings = localStorage.getItem('jbcrafts_settings');
        if (storedSettings) {
          try { setAdminSettings(JSON.parse(storedSettings)); } catch (e) { }
        }

        // Load Products
        const storedProducts = localStorage.getItem('jbcrafts_products');
        if (storedProducts) {
          try {
            const parsed = JSON.parse(storedProducts);
            console.log("Loaded products from LS:", parsed.length);
            setProducts(parsed);
          } catch (e) {
            console.error("Error parsing products in effect", e);
            setProducts(initialProducts);
          }
        } else {
          console.log("No products in LS, using initialProducts:", initialProducts.length);
          setProducts(initialProducts);
        }

        // Load Orders
        const storedOrders = localStorage.getItem('jbcrafts_orders');
        if (storedOrders) {
          try { setOrders(JSON.parse(storedOrders)); } catch (e) { }
        }

      } catch (error) {
        console.error("Failed to load local data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStore();
  }, []);


  // --- Persistence Effects ---
  useEffect(() => {
    try {
      console.log("Persisting cart:", cart);
      localStorage.setItem('jbcrafts_cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to local storage:", error);
      toast({ variant: "destructive", title: "Storage Full", description: "Cart could not be saved to local storage." });
    }
  }, [cart, toast]);

  useEffect(() => {
    try {
      localStorage.setItem('jbcrafts_settings', JSON.stringify(adminSettings));
    } catch (error) { console.error(error); }
  }, [adminSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('jbcrafts_shipping_overrides', JSON.stringify(shippingOverrides));
    } catch (error) { console.error(error); }
  }, [shippingOverrides]);

  useEffect(() => {
    try {
      localStorage.setItem('jbcrafts_fee_overrides', JSON.stringify(feeOverrides));
    } catch (error) { console.error(error); }
  }, [feeOverrides]);

  useEffect(() => {
    try {
      localStorage.setItem('jbcrafts_coupons', JSON.stringify(coupons));
    } catch (error) { console.error(error); }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('jbcrafts_products', JSON.stringify(products));
    } catch (error) {
      console.error("Failed to save products:", error);
      toast({ variant: "destructive", title: "Storage Full", description: "Products could not be saved locally." });
    }
  }, [products, toast]);

  useEffect(() => {
    try {
      localStorage.setItem('jbcrafts_orders', JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders:", error);
      toast({ variant: "destructive", title: "Storage Full", description: "Orders could not be saved locally." });
    }
  }, [orders, toast]);


  // --- Cart Actions ---
  const addToCart = (product: Product, quantity = 1, customText?: string, customSize?: string) => {
    console.log("addToCart called with:", product.name, quantity, customSize);
    setCart(prev => {
      const existing = prev.find(item =>
        item.product.id === product.id && item.customText === customText && item.customSize === customSize
      );

      if (existing) {
        console.log("Updating existing item quantity");
        return prev.map(item =>
          (item.product.id === product.id && item.customText === customText && item.customSize === customSize)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      console.log("Adding new item");
      return [...prev, { product, quantity, customText, customSize }];
    });
    toast({ title: "Added to Cart", description: `${quantity} x ${product.name}` });
  };

  const removeFromCart = (productId: string, customText?: string, customSize?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.customText === customText && item.customSize === customSize)));
  };

  const updateCartQuantity = (productId: string, quantity: number, customText?: string, customSize?: string) => {
    if (quantity <= 0) return removeFromCart(productId, customText, customSize);
    setCart(prev => prev.map(item =>
      (item.product.id === productId && item.customText === customText && item.customSize === customSize)
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    const totalInPaise = cart.reduce((sum, item) => sum + item.product.priceInPaise * item.quantity, 0);
    return { totalInPaise, displayTotal: formatPriceINR(totalInPaise) };
  };

  const discountAmount = React.useMemo(() => {
    if (!appliedCoupon) return 0;
    const subtotal = cart.reduce((sum, item) => sum + item.product.priceInPaise * item.quantity, 0);
    if (appliedCoupon.type === 'percentage') {
      return Math.round(subtotal * (appliedCoupon.value / 100));
    }
    return appliedCoupon.value * 100; // Fixed value in Rupees -> Paise
  }, [cart, appliedCoupon]);

  // --- Coupon Actions ---
  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [...prev.filter(c => c.code !== coupon.code), coupon]);
    toast({ title: "Coupon Created", description: `Code ${coupon.code} added.` });
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    if (appliedCoupon?.code === code) setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) {
      toast({ variant: "destructive", title: "Invalid Code", description: "Coupon not found or expired." });
      return;
    }
    setAppliedCoupon(coupon);
    toast({ title: "Applied!", description: `Discount ${coupon.code} applied.` });
  };

  const removeCoupon = () => setAppliedCoupon(null);


  // --- Product Actions (Local Storage) ---
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'displayPrice'>) => {
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      ...productData,
      displayPrice: formatPriceINR(productData.priceInPaise),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sales: 0
    };
    setProducts(prev => [newProduct, ...prev]);
    toast({ title: "Product Added", description: "Saved to local storage." });
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }));
    toast({ title: "Product Updated", description: "Changes saved." });
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({ title: "Product Deleted", description: "Removed from catalog." });
  };

  const clearAllProducts = async () => {
    if (confirm("Are you sure? This will delete all products from this browser.")) {
      setProducts([]);
      toast({ title: "Catalog Cleared", description: "All products removed." });
    }
  };


  // --- Order Actions (Local Storage) ---
  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order | null> => {
    console.log("addOrder called with:", orderData);
    try {
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentStatus: orderData.paymentStatus || 'pending'
      };

      setOrders(prev => {
        console.log("Setting orders, prev length:", prev.length);
        return [newOrder, ...prev];
      });

      // Update stock
      setProducts(prev => prev.map(p => {
        const item = orderData.items.find(i => i.product.id === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity), sales: (p.sales || 0) + item.quantity };
        }
        return p;
      }));

      clearCart();
      toast({ title: "Order Placed", description: `Order #${newOrder.id} confirmed!` });
      return newOrder;
    } catch (e) {
      console.error("Error inside addOrder:", e);
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    toast({ title: "Status Updated", description: `Order marked as ${status}.` });
  };

  const updatePaymentStatus = async (orderId: string, status: Order['paymentStatus'], transactionId?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        paymentStatus: status,
        transactionId: transactionId || o.transactionId
      };
    }));
  };

  const clearAllOrders = async () => {
    setOrders([]);
    toast({ title: "History Cleared", description: "All orders removed." });
  };

  // --- Admin Settings Misc ---
  const updateAdminSettings = (settings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...settings, payment: { ...prev.payment, ...settings.payment } }));
  };

  const updateShippingOverride = (date: string, cost: number) => {
    setShippingOverrides(prev => ({ ...prev, [date]: cost }));
  };

  const updateFeeOverride = (date: string, cost: number) => {
    setFeeOverrides(prev => ({ ...prev, [date]: cost }));
  };

  const updateOrderProductCost = (orderId: string, productId: string, costInPaise: number) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map(item => {
            if (item.product.id !== productId) return item;
            return {
              ...item,
              product: { ...item.product, costPriceInPaise: costInPaise }
            };
          })
        };
      })
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        adminSettings,
        isLoading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        updateAdminSettings,
        addOrder,
        updateOrderStatus,
        shippingOverrides,
        updateShippingOverride,
        feeOverrides,
        updateFeeOverride,
        updateOrderProductCost,

        updatePaymentStatus,
        clearAllOrders,

        coupons,
        addCoupon,
        deleteCoupon,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
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
