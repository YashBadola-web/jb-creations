// Data models structured for easy Java (Spring Boot) backend integration

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInPaise: number; // Store in paise for precision (₹199.00 = 19900)
  displayPrice: string; // Formatted price string "₹199.00"
  category: 'resin' | 'kids' | 'decor';
  images: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalInPaise: number;
  displayTotal: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'upi' | 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
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

export interface PaymentSettings {
  upiId: string;
  upiQrCode: string | null; // Base64 or URL
  razorpayEnabled: boolean;
  codEnabled: boolean;
}

export interface AdminSettings {
  payment: PaymentSettings;
}

export const formatPriceINR = (paise: number): string => {
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

export const parsePriceToINR = (rupees: number): number => {
  return Math.round(rupees * 100);
};
