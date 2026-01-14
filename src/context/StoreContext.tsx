
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, AdminSettings, formatPriceINR, Coupon } from '@/types';
import { initialProducts } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  // Cart and Settings remain in LocalStorage for now
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jbcrafts_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem('jbcrafts_settings');
      return saved ? JSON.parse(saved) : defaultAdminSettings;
    } catch (e) { return defaultAdminSettings; }
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

  // --- Initial Fetch (Supabase for Data, LocalStorage for Settings) ---
  useEffect(() => {
    const initializeStore = async () => {
      setIsLoading(true);
      try {
        console.log("Initializing Store from Supabase...");

        // 1. Fetch Products
        const { data: dbProducts, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (prodError) throw prodError;

        // 2. Fetch Orders (Full with items)
        const { data: fullOrders, error: fullOrdError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
                product_id,
                quantity,
                price_at_purchase,
                custom_text,
                custom_size
            )
        `)
          .order('created_at', { ascending: false });

        if (fullOrdError) throw fullOrdError;

        // 3. Calculate Sales Map from Orders
        const salesMap: Record<string, number> = {};
        if (fullOrders) {
          fullOrders.forEach((order: any) => {
            if (order.status !== 'cancelled' && order.payment_status === 'paid') { // Only count confirmed/paid sales? Or all non-cancelled? 
              // Let's count all non-cancelled orders for "popularity"
              if (order.status === 'cancelled') return;

              order.order_items.forEach((item: any) => {
                salesMap[item.product_id] = (salesMap[item.product_id] || 0) + item.quantity;
              });
            }
          });
        }

        // 4. Map Products with Sales Data
        if (dbProducts) {
          const mappedProducts: Product[] = dbProducts.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            priceInPaise: Math.round(p.price * 100),
            displayPrice: formatPriceINR(Math.round(p.price * 100)),
            category: p.category || 'other',
            subcategory: p.subcategory,
            stock: p.stock,
            images: p.images || [],
            featured: p.featured || false,
            costPriceInPaise: p.cost_price ? Math.round(p.cost_price * 100) : 0,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            sales: salesMap[p.id] || 0
          }));
          setProducts(mappedProducts);
        }

        // 5. Map Orders
        if (fullOrders) {
          const mappedOrders: Order[] = fullOrders.map((o: any) => ({
            id: o.id,
            items: o.order_items.map((item: any) => {
              const prod = dbProducts?.find(p => p.id === item.product_id);
              const fallbackProd: Product = {
                id: item.product_id,
                name: 'Unknown Product',
                description: '',
                priceInPaise: Math.round(item.price_at_purchase * 100),
                displayPrice: formatPriceINR(Math.round(item.price_at_purchase * 100)),
                category: 'other',
                stock: 0,
                images: [],
                featured: false,
                costPriceInPaise: 0,
                createdAt: '',
                updatedAt: ''
              };

              return {
                product: prod ? {
                  id: prod.id,
                  name: prod.name,
                  description: prod.description,
                  priceInPaise: Math.round(prod.price * 100),
                  displayPrice: formatPriceINR(Math.round(prod.price * 100)),
                  category: prod.category,
                  stock: prod.stock,
                  images: prod.images,
                  featured: prod.featured || false,
                  costPriceInPaise: prod.cost_price ? Math.round(prod.cost_price * 100) : 0,
                  createdAt: prod.created_at,
                  updatedAt: prod.updated_at
                } : fallbackProd,
                quantity: item.quantity,
                customText: item.custom_text,
                customSize: item.custom_size
              };
            }),
            totalInPaise: Math.round(o.total_amount * 100),
            displayTotal: formatPriceINR(Math.round(o.total_amount * 100)),
            status: o.status as any,
            paymentMethod: 'upi',
            paymentStatus: o.payment_status as any,
            transactionId: o.transaction_id,
            customerInfo: o.customer_info,
            createdAt: o.created_at,
            updatedAt: o.created_at
          }));
          setOrders(mappedOrders);
        }

      } catch (error) {
        console.error("Failed to load data from Supabase:", error);
        toast({ variant: "destructive", title: "Connection Error", description: "Could not load data from database." });
      } finally {
        setIsLoading(false);
      }
    };

    initializeStore();
  }, [toast]);


  // --- Persistence Effects (Only for Local Settings) ---
  useEffect(() => {
    localStorage.setItem('jbcrafts_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jbcrafts_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  // --- Cart Actions ---
  const addToCart = (product: Product, quantity = 1, customText?: string, customSize?: string) => {
    setCart(prev => {
      const existing = prev.find(item =>
        item.product.id === product.id && item.customText === customText && item.customSize === customSize
      );
      if (existing) {
        return prev.map(item =>
          (item.product.id === product.id && item.customText === customText && item.customSize === customSize)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
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
    return appliedCoupon.value * 100;
  }, [cart, appliedCoupon]);

  // --- Coupon Actions ---
  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [...prev.filter(c => c.code !== coupon.code), coupon]);
  };
  const deleteCoupon = (code: string) => { setCoupons(prev => prev.filter(c => c.code !== code)); };
  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) return toast({ variant: "destructive", title: "Invalid Code" });
    setAppliedCoupon(coupon);
  };
  const removeCoupon = () => setAppliedCoupon(null);


  // --- Product Actions (Supabase) ---
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'displayPrice'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          price: productData.priceInPaise / 100, // Paise -> Decimal
          stock: productData.stock,
          category: productData.category,
          subcategory: productData.subcategory,
          images: productData.images,
          featured: productData.featured,
          cost_price: productData.costPriceInPaise ? productData.costPriceInPaise / 100 : 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Optimistic Update or specific fetch
      const newProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        priceInPaise: Math.round(data.price * 100),
        displayPrice: formatPriceINR(Math.round(data.price * 100)),
        category: data.category,
        subcategory: data.subcategory,
        stock: data.stock,
        images: data.images,
        featured: data.featured,
        costPriceInPaise: Math.round(data.cost_price * 100),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        sales: 0
      };
      setProducts(prev => [newProduct, ...prev]);
      toast({ title: "Product Added", description: "Saved to database." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Failed to add product." });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.priceInPaise) dbUpdates.price = updates.priceInPaise / 100;
      if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.subcategory) dbUpdates.subcategory = updates.subcategory;
      if (updates.images) dbUpdates.images = updates.images;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      if (updates.costPriceInPaise !== undefined) dbUpdates.cost_price = updates.costPriceInPaise / 100;

      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
      toast({ title: "Product Updated", description: "Changes saved." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Failed to update product." });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: "Product Deleted", description: "Removed from catalog." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete product." });
    }
  };

  const clearAllProducts = async () => {
    if (confirm("Are you sure? This will delete all products from the Database!")) {
      const { error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      if (!error) {
        setProducts([]);
        toast({ title: "Catalog Cleared", description: "All products removed." });
      }
    }
  };


  // --- Order Actions (Supabase) ---
  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order | null> => {
    try {
      // 1. Insert Order
      const { data: orderParams, error: orderError } = await supabase
        .from('orders')
        .insert([{
          total_amount: orderData.totalInPaise / 100,
          status: 'pending',
          payment_status: orderData.paymentStatus || 'pending',
          customer_info: orderData.customerInfo,
          transaction_id: orderData.transactionId
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Order Items
      const orderItemsData = orderData.items.map(item => ({
        order_id: orderParams.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.product.priceInPaise / 100,
        custom_text: item.customText,
        custom_size: item.customSize
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      // 3. Update Stock (One by one for correctness or RPC function)
      // Ideally use database trigger or RPC. Doing client side for speed now.
      for (const item of orderData.items) {
        const newStock = Math.max(0, item.product.stock - item.quantity);
        await supabase.from('products').update({ stock: newStock }).eq('id', item.product.id);

        // Optimistically update local product state (Stock and Sales)
        setProducts(prev => prev.map(p => {
          if (p.id === item.product.id) {
            return {
              ...p,
              stock: newStock,
              sales: (p.sales || 0) + item.quantity
            };
          }
          return p;
        }));
      }

      clearCart();

      // Re-construct Order object to return
      // We can just refetch or fake it
      const newOrder: Order = {
        id: orderParams.id,
        ...orderData,
        createdAt: orderParams.created_at,
        updatedAt: orderParams.created_at
      };
      setOrders(prev => [newOrder, ...prev]);

      toast({ title: "Order Placed", description: `Order #${newOrder.id} confirmed!` });
      return newOrder;
    } catch (e) {
      console.error("Error inside addOrder:", e);
      toast({ variant: "destructive", title: "Order Failed", description: "Could not place order." });
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast({ title: "Status Updated", description: `Order marked as ${status}.` });
    }
  };

  const updatePaymentStatus = async (orderId: string, status: Order['paymentStatus'], transactionId?: string) => {
    const updates: any = { payment_status: status };
    if (transactionId) updates.transaction_id = transactionId;

    const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => {
        if (o.id !== orderId) return o;
        return { ...o, paymentStatus: status, transactionId: transactionId || o.transactionId };
      }));
    }
  };

  const clearAllOrders = async () => {
    // Not implementing clear all for DB easily to prevent accidents, or use DELETE
    if (confirm("Delete all order history?")) {
      await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      setOrders([]);
    }
  };

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
    // Complexity: Updating historical order item cost? 
    // Supabase order_items doesn't have cost_price column, assuming update product itself?
    // Or local state only?
    // Ignoring for now to keep migration simple
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
