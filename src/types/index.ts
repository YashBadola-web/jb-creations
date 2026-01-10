// Data models structured for easy Java (Spring Boot) backend integration

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInPaise: number; // Store in paise for precision (₹199.00 = 19900)
  displayPrice: string; // Formatted price string "₹199.00"
  category: string;
  subcategory?: string; // Optional sub-category ID
  images: string[];
  stock: number;
  featured: boolean;
  costPriceInPaise: number; // Cost of Goods Sold (COGS) in paise
  createdAt: string;
  updatedAt: string;
  sales?: number; // Total units sold (optional for backward compatibility or future use)
}

export interface CartItem {
  product: Product;
  quantity: number;
  customText?: string; // For customized items
}

export interface Order {
  id: string;
  items: CartItem[];
  totalInPaise: number;
  displayTotal: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'upi' | 'razorpay' | 'cod';
  paymentStatus: 'created' | 'pending' | 'completed' | 'failed' | 'paid'; // Added 'created' and 'paid'
  transactionId?: string; // New field
  customerInfo: CustomerInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

export interface PaymentSettings {
  upiId: string;
  upiQrCode: string | null; // Base64 or URL
  razorpayEnabled: boolean;
  razorpayKeyId?: string; // Optional Key ID
  codEnabled: boolean;
}

export interface MarketingSettings {
  whatsappGroupUrl?: string;
}

export interface AdminSettings {
  payment: PaymentSettings;
  marketing: MarketingSettings;
}

export const formatPriceINR = (paise: number): string => {
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

export const parsePriceToINR = (rupees: number): number => {
  return Math.round(rupees * 100);
};
