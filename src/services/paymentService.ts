// This service mocks a real Payment Gateway API (like Razorpay/PhonePe)
import { Order } from '@/types';

export interface TransactionResponse {
    transactionId: string;
    status: 'CREATED' | 'FAILED';
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const initiateTransaction = async (amount: number): Promise<TransactionResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        status: 'CREATED'
    };
};

export const initiateRazorpayTransaction = (
    order: Order,
    keyId: string,
    onSuccess: (paymentId: string) => void,
    onFailure: (error: any) => void
) => {
    if (!window.Razorpay) {
        onFailure({ description: "Razorpay SDK failed to load. Are you online?" });
        return;
    }

    const options = {
        key: keyId,
        amount: order.totalInPaise, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "JB Creations",
        description: `Order #${order.id}`,
        image: "/placeholder.svg", // You can replace this with your logo
        order_id: "", // For now, we are skipping backend order creation (Client-side only)
        handler: function (response: any) {
            onSuccess(response.razorpay_payment_id);
        },
        prefill: {
            name: order.customerInfo.name,
            email: order.customerInfo.email,
            contact: order.customerInfo.phone
        },
        notes: {
            address: order.customerInfo.address
        },
        theme: {
            color: "#83705C" // Primary color
        }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response: any) {
        onFailure(response.error);
    });
    rzp1.open();
};


export const checkPaymentStatus = async (transactionId: string): Promise<'PENDING' | 'SUCCESS' | 'FAILED'> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call

    // Logic to simulate payment flow:
    // In a real app, this would hit your backend which queries the gateway.
    // For this specific user request, we have DISABLED auto-success to prevent false positives.
    // The user must manually "Simulate Success" or "Cancel" in the UI overlay.

    return 'PENDING';
};
