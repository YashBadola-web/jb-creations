import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CreditCard, QrCode, Banknote } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CustomerInfo, Order } from '@/types';

type PaymentMethod = 'upi' | 'razorpay' | 'cod';

const steps = [
  { id: 1, title: 'Shipping Details' },
  { id: 2, title: 'Payment Method' },
  { id: 3, title: 'Confirmation' },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, adminSettings, addOrder, clearCart } = useStore();
  const { toast } = useToast();
  const { displayTotal, totalInPaise } = getCartTotal();

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Your cart is empty</h1>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const isStep1Valid = () => {
    return (
      customerInfo.name.trim() &&
      customerInfo.email.trim() &&
      customerInfo.phone.trim() &&
      customerInfo.address.trim() &&
      customerInfo.city.trim() &&
      customerInfo.state.trim() &&
      customerInfo.pincode.trim()
    );
  };

  const handlePlaceOrder = () => {
    const order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      items: cart,
      totalInPaise,
      displayTotal,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      customerInfo,
    };

    addOrder(order);
    clearCart();
    
    toast({
      title: 'Order Placed Successfully! 🎉',
      description: `Your order has been placed. ${paymentMethod === 'cod' ? 'Pay on delivery.' : 'Complete payment to confirm.'}`,
    });

    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/cart"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 md:gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep >= step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <span
                    className={`hidden md:block text-sm font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-lg border border-border p-6"
                >
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Shipping Details
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        placeholder="Street address, apartment, etc."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={customerInfo.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={customerInfo.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={customerInfo.pincode}
                        onChange={handleInputChange}
                        placeholder="123456"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-lg border border-border p-6"
                >
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    {/* UPI Option */}
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <QrCode className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">UPI Payment</p>
                          <p className="text-sm text-muted-foreground">
                            Pay using any UPI app
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Razorpay Option */}
                    {adminSettings.payment.razorpayEnabled && (
                      <button
                        onClick={() => setPaymentMethod('razorpay')}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          paymentMethod === 'razorpay'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">Razorpay</p>
                            <p className="text-sm text-muted-foreground">
                              Cards, Net Banking, Wallets & more
                            </p>
                          </div>
                        </div>
                      </button>
                    )}

                    {/* COD Option */}
                    {adminSettings.payment.codEnabled && (
                      <button
                        onClick={() => setPaymentMethod('cod')}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Banknote className="h-6 w-6 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              Pay when you receive your order
                            </p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* UPI Details */}
                  {paymentMethod === 'upi' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-4 bg-muted rounded-lg"
                    >
                      <h3 className="font-medium text-foreground mb-3">UPI Payment Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                          <span className="text-sm text-muted-foreground">UPI ID:</span>
                          <span className="font-mono text-foreground">
                            {adminSettings.payment.upiId}
                          </span>
                        </div>
                        {adminSettings.payment.upiQrCode && (
                          <div className="flex justify-center p-4 bg-background rounded-lg">
                            <img
                              src={adminSettings.payment.upiQrCode}
                              alt="UPI QR Code"
                              className="w-48 h-48 object-contain"
                            />
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground text-center">
                          Scan QR code or use UPI ID to make payment
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-lg border border-border p-6"
                >
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Order Confirmation
                  </h2>

                  {/* Shipping Summary */}
                  <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-3">Shipping Address</h3>
                    <div className="p-4 bg-muted rounded-lg text-sm">
                      <p className="font-medium text-foreground">{customerInfo.name}</p>
                      <p className="text-muted-foreground">{customerInfo.address}</p>
                      <p className="text-muted-foreground">
                        {customerInfo.city}, {customerInfo.state} - {customerInfo.pincode}
                      </p>
                      <p className="text-muted-foreground mt-2">{customerInfo.phone}</p>
                      <p className="text-muted-foreground">{customerInfo.email}</p>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-3">Payment Method</h3>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="font-medium text-foreground capitalize">
                        {paymentMethod === 'upi' && 'UPI Payment'}
                        {paymentMethod === 'razorpay' && 'Razorpay'}
                        {paymentMethod === 'cod' && 'Cash on Delivery'}
                      </p>
                      {paymentMethod === 'upi' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay to: {adminSettings.payment.upiId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {item.product.displayPrice}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <Button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={currentStep === 1 && !isStep1Valid()}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handlePlaceOrder}>
                    Place Order
                    <Check className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 pb-4 border-b border-border">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-foreground">{item.product.displayPrice}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{displayTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-secondary font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between py-4">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-display text-xl text-foreground">{displayTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
