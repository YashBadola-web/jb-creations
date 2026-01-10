
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, AdminSettings, formatPriceINR, Coupon } from '@/types';
import { initialProducts } from '@/data/products';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  adminSettings: AdminSettings;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number, customText?: string) => void;
  removeFromCart: (productId: string, customText?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, customText?: string) => void;
  clearCart: () => void;
  getCartTotal: () => { totalInPaise: number; displayTotal: string };
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'displayPrice'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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

  // --- Remote Data ---
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // --- Local Data ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jbcrafts_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('jbcrafts_settings');
    return saved ? JSON.parse(saved) : defaultAdminSettings;
  });

  const [shippingOverrides, setShippingOverrides] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('jbcrafts_shipping_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  const [feeOverrides, setFeeOverrides] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('jbcrafts_fee_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('jbcrafts_coupons');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // --- Initial Fetch ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Products
      const { data: productsData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (prodError) throw prodError;

      const productsSource = productsData || [];
      let formattedProducts: Product[] = [];

      if (productsSource.length === 0) {
        console.log("Using local mock data (DB empty or not populated)");
        formattedProducts = initialProducts;
        setProducts(initialProducts);
      } else {
        formattedProducts = productsSource.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          priceInPaise: p.price_in_paise,
          displayPrice: formatPriceINR(p.price_in_paise),
          category: p.category,
          subcategory: p.subcategory,
          images: p.image_urls || [],
          stock: p.stock,
          featured: p.featured,
          costPriceInPaise: p.cost_price_in_paise,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          sales: p.sales
        }));
        setProducts(formattedProducts);
      }

      // Fetch Orders
      const { data: ordersData, error: orderError } = await supabase
        .from('orders')
        .select(`
  *,
  order_items(
    product_id,
    product_name_snapshot,
    quantity,
    price_at_purchase,
    custom_text
  )
    `)
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;

      // Map DB Orders to Context Order Type
      // We need to reconstruct the "items" array with product details
      const formattedOrders: Order[] = ordersData?.map((o: any) => {
        const items = o.order_items.map((item: any) => {
          // Try to find the live product, fallback to snapshot
          const product = formattedProducts.find(p => p.id === item.product_id) || {
            id: item.product_id || 'deleted',
            name: item.product_name_snapshot,
            priceInPaise: item.price_at_purchase,
            displayPrice: formatPriceINR(item.price_at_purchase),
            images: [], // Placeholder if deleted
            category: 'resin', // Default fallback
            stock: 0,
            featured: false,
            description: '',
            costPriceInPaise: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Product;

          return {
            product,
            quantity: item.quantity,
            customText: item.custom_text
          } as CartItem;
        });

        return {
          id: o.id,
          items,
          totalInPaise: o.total_in_paise,
          displayTotal: formatPriceINR(o.total_in_paise),
          status: o.status,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          transactionId: o.transaction_id,
          customerInfo: o.customer_info,
          createdAt: o.created_at,
          updatedAt: o.updated_at
        };
      }) || [];

      setOrders(formattedOrders);

    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to load data from Cloud."
      });
    } finally {
      setIsLoading(false);
    }
  };


  // --- Local Persistence Effects (Cart, Settings) ---
  useEffect(() => localStorage.setItem('jbcrafts_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('jbcrafts_settings', JSON.stringify(adminSettings)), [adminSettings]);
  useEffect(() => localStorage.setItem('jbcrafts_shipping_overrides', JSON.stringify(shippingOverrides)), [shippingOverrides]);
  useEffect(() => localStorage.setItem('jbcrafts_fee_overrides', JSON.stringify(feeOverrides)), [feeOverrides]);
  useEffect(() => localStorage.setItem('jbcrafts_coupons', JSON.stringify(coupons)), [coupons]);


  // --- Cart Actions ---
  const addToCart = (product: Product, quantity = 1, customText?: string) => {
    setCart(prev => {
      const existing = prev.find(item =>
        item.product.id === product.id && item.customText === customText
      );

      if (existing) {
        return prev.map(item =>
          (item.product.id === product.id && item.customText === customText)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, customText }];
    });
  };

  const removeFromCart = (productId: string, customText?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.customText === customText)));
  };

  const updateCartQuantity = (productId: string, quantity: number, customText?: string) => {
    if (quantity <= 0) return removeFromCart(productId, customText);
    setCart(prev => prev.map(item =>
      (item.product.id === productId && item.customText === customText)
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


  // --- Product Actions (Supabase) ---
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'displayPrice'>) => {
    try {
      const { data, error } = await supabase.from('products').insert({
        name: product.name,
        description: product.description,
        price_in_paise: product.priceInPaise,
        stock: product.stock,
        category: product.category,
        subcategory: product.subcategory,
        image_urls: product.images,
        featured: product.featured,
        cost_price_in_paise: product.costPriceInPaise
      }).select().single();

      if (error) throw error;

      // Refresh local state to match DB
      fetchData();
      toast({ title: "Product Added", description: "Synced to Cloud." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.priceInPaise) dbUpdates.price_in_paise = updates.priceInPaise;
      if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.subcategory) dbUpdates.subcategory = updates.subcategory;
      if (updates.images) dbUpdates.image_urls = updates.images;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      if (updates.costPriceInPaise !== undefined) dbUpdates.cost_price_in_paise = updates.costPriceInPaise;
      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
      if (error) throw error;

      // Optimistic update or fetch
      fetchData();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Update Failed", description: e.message });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      toast({ variant: "destructive", title: "Delete Failed", description: e.message });
    }
  };


  // --- Order Actions (Supabase) ---
  const addOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order | null> => {
    try {
      // 1. Insert Order
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          status: order.status,
          total_in_paise: order.totalInPaise,
          payment_method: order.paymentMethod,
          payment_status: order.paymentStatus || 'pending',
          customer_info: order.customerInfo
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Order Items
      const items = order.items.map(item => ({
        order_id: newOrder.id,
        product_id: item.product.id.includes('prod_') ? null : item.product.id, // Handle legacy IDs if any? actually UUIDs now
        product_name_snapshot: item.product.name,
        quantity: item.quantity,
        price_at_purchase: item.product.priceInPaise,
        custom_text: item.customText || null
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(items);
      if (itemsError) throw itemsError;

      // 3. Update Stock (Simple decrements)
      for (const item of order.items) {
        if (!item.product.id) continue;
        // RPC would be better for concurrency, but client-side calc is okay for this scale
        const currentStock = item.product.stock;
        const newStock = Math.max(0, currentStock - item.quantity);
        await supabase.from('products').update({ stock: newStock }).eq('id', item.product.id);
      }

      // 4. Upsert Customer (Save Email)
      if (order.customerInfo && order.customerInfo.email) {
        const { error: custError } = await supabase
          .from('customers')
          .upsert({
            email: order.customerInfo.email.trim().toLowerCase(),
            name: order.customerInfo.name,
            phone: order.customerInfo.phone,
            source: 'website_order'
          }, { onConflict: 'email' });

        if (custError) console.error("Failed to save customer", custError);
      }

      toast({ title: "Order Placed", description: `Order #${newOrder.id.slice(0, 8)} created.` });

      // Optimistic return structure for UI immediate feedback
      // We don't have the full joined structure without refetching, so refetch is safer.
      fetchData();

      return { ...order, id: newOrder.id, createdAt: newOrder.created_at, updatedAt: newOrder.updated_at } as Order;

    } catch (e: any) {
      console.error(e);
      toast({ variant: "destructive", title: "Order Failed", description: e.message });
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  const updatePaymentStatus = async (orderId: string, status: Order['paymentStatus'], transactionId?: string) => {
    try {
      const updates: any = { payment_status: status };
      if (transactionId) updates.transaction_id = transactionId;

      const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
      if (error) throw error;

    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  const clearAllOrders = async () => {
    try {
      // Delete all orders from Supabase
      // Using a condition that is always true to delete all rows if no other filters
      const { error } = await supabase.from('orders').delete().gt('created_at', '1970-01-01');

      if (error) throw error;

      setOrders([]);
      toast({ title: "Success", description: "All order history has been cleared." });
    } catch (e: any) {
      console.error(e);
      toast({ variant: "destructive", title: "Failed to Clear Orders", description: e.message });
    }
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
    // This was previously local-only on the order structure. 
    // In DB schema, we don't have per-order-item cost override column yet. 
    // For now, we will update the LOCAL STATE only to not break UI, 
    // but warn that it won't persist to DB unless we add a column.
    // Ideally we add `cost_at_purchase` to `order_items` table.
    // For this migration scope, let's just update local state.
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
