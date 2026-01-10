import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadInvoice } from '@/utils/invoiceGenerator';
import { ArrowLeft, ArrowRight, Check, CreditCard, QrCode, Banknote, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CustomerInfo, Order } from '@/types';
import { initiateTransaction, checkPaymentStatus, initiateRazorpayTransaction } from '@/services/paymentService';
import ShippingPolicyModal from '@/components/policies/ShippingPolicyModal';

type PaymentMethod = 'upi' | 'razorpay' | 'cod';

const steps = [
  { id: 1, title: 'Shipping Details' },
  { id: 2, title: 'Payment Method' },
  { id: 3, title: 'Confirmation' },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, adminSettings, addOrder, clearCart, updatePaymentStatus, updateOrderStatus, applyCoupon, appliedCoupon, removeCoupon, discountAmount } = useStore();
  const { toast } = useToast();
  const { totalInPaise } = getCartTotal();
  const [couponCode, setCouponCode] = useState('');

  const finalTotal = Math.max(0, totalInPaise - discountAmount);
  const displayTotal = React.useMemo(() => {
    return `₹${(finalTotal / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  }, [finalTotal]);

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

  // Order & Payment State
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [finalOrder, setFinalOrder] = useState<Order | null>(null);
  const [utrInput, setUtrInput] = useState('');

  // ... (Polling logic stays same, ensuring cleanupPayment is available)
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupPayment = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPaymentProcessing(false);
  };

  useEffect(() => {
    return () => cleanupPayment();
  }, []);

  useEffect(() => {
    if (isPaymentProcessing && transactionId && currentOrderId) {
      timeoutRef.current = setTimeout(() => {
        handlePaymentTimeout();
      }, 180000);

      pollingRef.current = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(transactionId);
          console.log(`Polling Transaction: ${transactionId} - Status: ${status}`);

          if (status === 'SUCCESS') {
            handlePaymentSuccess(currentOrderId, transactionId);
          } else if (status === 'FAILED') {
            // Polling noticed failure
            handlePaymentFailure('Payment failed or cancelled.');
          }
        } catch (error) {
          console.error('Polling error', error);
        }
      }, 5000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPaymentProcessing, transactionId, currentOrderId]);

  // ... (Cart empty check stays same)
  if (cart.length === 0 && !finalOrder && !isPaymentProcessing) {
    return (
      <Layout>
        <ShippingPolicyModal
          isOpen={showShippingPolicy}
          onOpenChange={setShowShippingPolicy}
          onAccept={handlePolicyAccepted}
        />
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const pincodeRegex = /^\d{6}$/;

    return (
      customerInfo.name.trim().length > 0 &&
      emailRegex.test(customerInfo.email) &&
      phoneRegex.test(customerInfo.phone) &&
      customerInfo.address.trim().length > 0 &&
      customerInfo.city.trim().length > 0 &&
      customerInfo.state.trim().length > 0 &&
      pincodeRegex.test(customerInfo.pincode)
    );
  };

  // ... inside component ...
  const [showShippingPolicy, setShowShippingPolicy] = useState(false);

  // ... (existing helper functions) ...

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validation Logic
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;
      const pincodeRegex = /^\d{6}$/;

      if (!customerInfo.name.trim()) { toast({ variant: "destructive", title: "Missing Name", description: "Please enter your full name." }); return; }
      if (!emailRegex.test(customerInfo.email)) { toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." }); return; }
      if (!phoneRegex.test(customerInfo.phone)) { toast({ variant: "destructive", title: "Invalid Phone", description: "Phone number must be exactly 10 digits." }); return; }
      if (!customerInfo.address.trim()) { toast({ variant: "destructive", title: "Missing Address", description: "Please enter your address." }); return; }
      if (!pincodeRegex.test(customerInfo.pincode)) { toast({ variant: "destructive", title: "Invalid Pincode", description: "Pincode must be exactly 6 digits." }); return; }

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      // Step 2 is Payment Method selection.
      // Before proceeding to Step 3 (Confirmation/Review or Payment), show Policy.
      setShowShippingPolicy(true);
    }
  };



  // Triggered by "Next" on Step 2 for Online Methods
  const initiateOnlinePayment = async () => {
    // Create Order in 'created' state
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      items: cart,
      totalInPaise: finalTotal,
      displayTotal,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'created',
      customerInfo,
    };

    const newOrder = await addOrder(orderData);
    if (!newOrder) {
      toast({ variant: "destructive", title: "Failed", description: "Could not create order." });
      return;
    }

    setCurrentOrderId(newOrder.id);
    setIsPaymentProcessing(true);
    setPaymentError(null);

    if (paymentMethod === 'razorpay') {
      const keyId = adminSettings.payment.razorpayKeyId;
      if (!keyId) {
        toast({ variant: "destructive", title: "Configuration Error", description: "Merchant has not set up Razorpay Key." });
        setIsPaymentProcessing(false);
        return;
      }

      initiateRazorpayTransaction(
        newOrder as Order,
        keyId,
        async (paymentId) => {
          await updatePaymentStatus(newOrder.id, 'paid', paymentId);
          setTransactionId(paymentId);
          setIsPaymentProcessing(false);
          setCurrentStep(3); // Move to Success
        },
        (error) => {
          console.error("Razorpay Error", error);
          handlePaymentFailure(error.description || "Payment Failed");
        }
      );
      return;
    }

    try {
      const txnResponse = await initiateTransaction(finalTotal);
      await updatePaymentStatus(newOrder.id, 'pending', txnResponse.transactionId);
      setTransactionId(txnResponse.transactionId);
      // Polling effect handles the rest...
    } catch (error) {
      console.error("Payment Init Error", error);
      handlePaymentFailure("Could not initiate payment. Order cancelled.");
    }
  };

  const handlePolicyAccepted = () => {
    if (paymentMethod === 'cod') {
      setCurrentStep(3);
    } else {
      initiateOnlinePayment();
    }
  };

  // Triggered by "Place Order" on Step 3 for COD
  const handlePlaceOrderCOD = async () => {
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      items: cart,
      totalInPaise: finalTotal,
      displayTotal,
      status: 'pending', // COD starts as pending
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      customerInfo,
    };

    const newOrder = await addOrder(orderData);
    if (!newOrder) {
      toast({ variant: "destructive", title: "Failed", description: "Could not create order." });
      return;
    }
    setCurrentOrderId(newOrder.id);

    // COD Instant Success
    completeOrder(newOrder);
  };

  const handlePaymentSuccess = async (orderId: string, txnId: string) => {
    cleanupPayment();
    await updatePaymentStatus(orderId, 'paid', txnId);

    // We need to fetch/construct the full order object properly or reuse state?
    // For simplicity, we construct a partial one or rely on local state if needed
    // But better to just complete the flow.
    // Creating a pseudo-Order object since we don't have the full one returned from update
    // Actually, let's just use the cart state which is still there
    const completedOrder: any = { id: orderId, items: cart, totalInPaise: totalInPaise };
    completeOrder(completedOrder);
  };

  const handlePaymentFailure = async (reason: string) => {
    cleanupPayment();
    if (currentOrderId) {
      await updatePaymentStatus(currentOrderId, 'failed');
      await updateOrderStatus(currentOrderId, 'cancelled'); // STRICT CANCELLATION
    }
    setPaymentError(reason);
    setTransactionId(null);
    setCurrentOrderId(null); // Reset current order so they try again with a NEW order
    toast({
      variant: "destructive",
      title: "Payment Failed",
      description: "Verification failed. Order has been cancelled."
    });
  };

  const handlePaymentTimeout = () => {
    handlePaymentFailure("Payment session timed out. Order cancelled.");
  };

  const completeOrder = (order: Order) => {
    setFinalOrder(order);
    clearCart(); // IMPORTANT: Clears global cart
    setCurrentStep(3); // Ensure we are on Step 3 (Confirmation/Receipt)

    toast({
      title: 'Order Placed Successfully! 🎉',
      description: `Order confirmation sent to ${customerInfo.email}.`,
      duration: 5000,
    });
  };

  // Helper to determine what items to show
  const displayItems = finalOrder ? finalOrder.items : cart;
  const isReceipt = !!finalOrder;

  return (
    <Layout>
      <ShippingPolicyModal
        isOpen={showShippingPolicy}
        onOpenChange={setShowShippingPolicy}
        onAccept={handlePolicyAccepted}
      />
      {/* Payment Overlay */}
      {/* Payment Overlay - Manual UTR Entry */}
      {isPaymentProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card w-full max-w-md rounded-xl border shadow-2xl p-6 text-center space-y-6"
          >
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">Complete Your Payment</h2>
              <p className="text-muted-foreground">
                Scan the QR code and enter the Reference ID (UTR) below.
              </p>
            </div>

            {/* QR Code Display in Overlay for convenience */}
            {adminSettings.payment.upiQrCode && (
              <div className="flex justify-center p-2 bg-white rounded-lg border border-border w-48 h-48 mx-auto">
                <img
                  src={adminSettings.payment.upiQrCode}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount to Pay:</span>
                <span className="font-bold text-xl">{displayTotal}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>UPI ID: {adminSettings.payment.upiId}</span>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="utr">Transaction ID / UTR Number</Label>
                <Input
                  id="utr"
                  placeholder="Enter 12-digit UTR (e.g. 123456789012)"
                  value={utrInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                    setUtrInput(val);
                  }}
                  maxLength={12}
                  className="text-center font-mono text-lg tracking-widest"
                />
                <p className="text-xs text-muted-foreground text-center">
                  You must enter the 12-digit reference number from your payment app.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handlePaymentFailure("Cancelled by user")}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handlePaymentSuccess(currentOrderId!, utrInput)}
                  disabled={utrInput.length !== 12}
                >
                  Verify Payment
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {!isReceipt && (
          <Link
            to="/cart"
            className={`inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors ${isPaymentProcessing ? 'pointer-events-none opacity-50' : ''}`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        )}

        {/* Error Message */}
        {paymentError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>{paymentError}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 md:gap-4">
            {/* ... Steps Code ... reuse existing map, just ensuring it reflects receipt state if needed */}
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${(isReceipt ? 3 : currentStep) >= step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {(isReceipt ? 3 : currentStep) > step.id ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && <div className="w-8 md:w-16 h-0.5 bg-muted" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                // ... Step 1 (Shipping) Same ...
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-card rounded-lg border border-border p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">Shipping Details</h2>
                  {/* ... Inputs ... Reuse from file view above, keeping lines 315-394 essentially implies we need to be careful with replace_content if I can't put it all here. 
                        Wait, I'm replacing a huge chunk. I should keep the layout consistent. 
                        The inputs are essentially the same.
                    */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" value={customerInfo.name} onChange={handleInputChange} className="mt-1" /></div>
                    <div><Label htmlFor="email">Email</Label><Input id="email" name="email" value={customerInfo.email} onChange={handleInputChange} className="mt-1" /></div>
                    <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" value={customerInfo.phone} onChange={handleInputChange} maxLength={10} className="mt-1" /></div>
                    <div className="md:col-span-2"><Label htmlFor="address">Address</Label><Input id="address" name="address" value={customerInfo.address} onChange={handleInputChange} className="mt-1" /></div>
                    <div><Label htmlFor="city">City</Label><Input id="city" name="city" value={customerInfo.city} onChange={handleInputChange} className="mt-1" /></div>
                    <div><Label htmlFor="state">State</Label><Input id="state" name="state" value={customerInfo.state} onChange={handleInputChange} className="mt-1" /></div>
                    <div><Label htmlFor="pincode">Pincode</Label><Input id="pincode" name="pincode" value={customerInfo.pincode} onChange={handleInputChange} maxLength={6} className="mt-1" /></div>
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
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${paymentMethod === 'upi'
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
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${paymentMethod === 'razorpay'
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

                  </div>

                  {/* UPI Details - RESTORED */}
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
                          <span className="font-mono text-foreground font-bold select-all">
                            {adminSettings.payment.upiId}
                          </span>
                        </div>
                        {adminSettings.payment.upiQrCode && (
                          <div className="flex justify-center p-4 bg-background rounded-lg border border-border">
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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {isReceipt ? "Order Receipt" : "Order Confirmation"}
                    </h2>
                    {isReceipt && <span className="text-green-600 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Paid</span>}
                  </div>

                  {/* Summary Details ... */}
                  <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-3">Shipping Address</h3>
                    <div className="p-4 bg-muted rounded-lg text-sm">
                      <p>{customerInfo.name}</p>
                      <p className="text-muted-foreground">{customerInfo.address} - {customerInfo.pincode}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-3">{isReceipt ? "Order Items" : "Review Items"}</h3>
                    <div className="space-y-3">
                      {displayItems.map((item, idx) => (
                        <div key={`${item.product.id}-${idx}`} className="flex flex-col gap-1 p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 text-sm font-medium">{item.product.name} <span className="text-muted-foreground">x {item.quantity}</span></div>
                            <div className="font-medium">{item.product.displayPrice}</div>
                          </div>
                          {item.customText && (
                            <p className="text-xs text-primary italic">Note: "{item.customText}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep === 2 && !isReceipt && (
                <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)} disabled={isPaymentProcessing}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              )}

              <div className="ml-auto">
                {currentStep === 1 && <Button onClick={handleNextStep}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>}

                {currentStep === 2 && (
                  <Button onClick={handleNextStep} disabled={isPaymentProcessing}>
                    {isPaymentProcessing ? <Loader2 className="animate-spin mr-2" /> : (paymentMethod === 'cod' ? 'Next' : 'Verify & Pay')}
                  </Button>
                )}

                {currentStep === 3 && !isReceipt && paymentMethod === 'cod' && (
                  <Button onClick={handlePlaceOrderCOD}>Place Order (COD)</Button>
                )}

                {isReceipt && (
                  <Link to="/"><Button>Back to Home</Button></Link>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar ... */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold mb-4">Summary</h2>

              {/* Coupon Input */}
              <div className="mb-4 space-y-2">
                <Label>Discount Code</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <Button variant="destructive" onClick={() => { removeCoupon(); setCouponCode(''); }}>Remove</Button>
                  ) : (
                    <Button onClick={() => applyCoupon(couponCode)}>Apply</Button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-sm text-green-600">
                    Success! {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}%` : `₹${appliedCoupon.value}`} off
                  </p>
                )}
              </div>

              <div className="space-y-2 py-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{`₹${(totalInPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{`₹${(discountAmount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{displayTotal}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
