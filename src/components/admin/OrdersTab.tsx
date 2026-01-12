import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { downloadInvoice } from '@/utils/invoiceGenerator';

const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [filterStatus, setFilterStatus] = React.useState<Order['status'] | 'all'>('all');

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const FilterButton = ({ status, label, count, colorClass }: { status: Order['status'] | 'all', label: string, count?: number, colorClass: string }) => (
    <button
      onClick={() => setFilterStatus(status)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === status
        ? 'ring-2 ring-primary ring-offset-2 ' + colorClass
        : 'opacity-70 hover:opacity-100 bg-muted text-muted-foreground'
        }`}
    >
      {label} {count !== undefined && `(${count})`}
    </button>
  );

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-foreground">Orders</h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <FilterButton status="all" label="All Orders" count={orders.length} colorClass="bg-gray-800 text-white" />
          <FilterButton status="pending" label="Pending" count={stats.pending} colorClass="bg-amber-100 text-amber-800" />
          <FilterButton status="confirmed" label="Confirmed" count={stats.confirmed} colorClass="bg-blue-100 text-blue-800" />
          <FilterButton status="shipped" label="Shipped" count={stats.shipped} colorClass="bg-purple-100 text-purple-800" />
          <FilterButton status="delivered" label="Delivered" count={stats.delivered} colorClass="bg-green-100 text-green-800" />
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No orders found in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{order.customerInfo.name}</span>
                      <span className="bg-muted px-2 py-0.5 rounded text-xs text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customerInfo.email}</p>
                    <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                    <div className="mt-1 text-xs text-muted-foreground">
                      <p>{order.customerInfo.address}</p>
                      <p>{order.customerInfo.city}, {order.customerInfo.state} - {order.customerInfo.pincode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-foreground">{order.displayTotal}</p>
                    {order.transactionId && (
                      <p className="text-xs font-mono text-primary my-0.5 selection:bg-primary selection:text-white">
                        TID: {order.transactionId}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground capitalize">{order.paymentMethod}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Order Items List */}
                <div className="bg-muted/30 rounded p-3 mb-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Order Items</div>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={`${order.id}-item-${idx}`} className="text-sm flex flex-col gap-0.5">
                        <div className="flex justify-between">
                          <span><span className="font-medium">{item.quantity}x</span> {item.product.name}</span>
                          <span className="text-muted-foreground">{item.product.displayPrice}</span>
                        </div>
                        {item.customText && (
                          <div className="text-primary text-xs italic ml-4 bg-primary/10 px-2 py-1 rounded inline-block w-fit">
                            "{item.customText}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Select value={order.status} onValueChange={async (value: Order['status']) => await updateOrderStatus(order.id, value)}>
                    <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <span className="text-xs text-muted-foreground px-2">{order.items.length} item(s)</span>

                  <div className="flex items-center gap-2 ml-auto">
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-9 gap-2"
                        title="Cancel Order (No Payment Received)"
                        onClick={async () => {
                          if (confirm('Are you sure you want to cancel this order due to missing payment?')) {
                            await updateOrderStatus(order.id, 'cancelled');

                            const phone = order.customerInfo.phone.replace(/\D/g, '');
                            const fullPhone = phone.length === 10 ? `91${phone}` : phone;
                            const firstName = order.customerInfo.name.split(' ')[0];
                            const orderId = order.id.slice(-6).toUpperCase();

                            const message = `Hi ${firstName}, this is regarding your order *#${orderId}*.\n\nWe have cancelled this order because the payment was not received or verified. ❌\n\nIf you have already paid, please reply with a screenshot or Transaction ID immediately so we can check.\n\n- JB Creations`;

                            window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, '_blank');
                          }
                        }}
                      >
                        <span className="font-bold">✕</span> No Payment
                      </Button>
                    )}

                    <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => downloadInvoice(order)}>
                      <Download className="h-4 w-4" />
                      Invoice
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-9 gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white border-none"
                      onClick={() => {
                        const phone = order.customerInfo.phone.replace(/\D/g, '');
                        const fullPhone = phone.length === 10 ? `91${phone}` : phone;

                        // Get first name
                        const firstName = order.customerInfo.name.split(' ')[0];
                        const orderId = order.id.slice(-6).toUpperCase();

                        let message = '';

                        if (order.status === 'confirmed') {
                          message = `Hi ${firstName}! 👋\n\nGreat news! We've received your order *#${orderId}*. 🎉\nWe're getting everything ready for you.\n\nThanks for choosing JB Creations! ✨`;
                        } else if (order.status === 'shipped') {
                          message = `Hi ${firstName}! 👋\n\nExciting update! Your order *#${orderId}* has been shipped! 🚚\nIt's on its way to you now.\n\nWe'll keep you posted! 🌟`;
                        } else if (order.status === 'delivered') {
                          message = `Hi ${firstName}! 👋\n\nYour order *#${orderId}* has been delivered! 🎁\nWe hope you love it as much as we loved making it.\n\nPlease find your invoice attached below. 📄\n\nThanks again for supporting our small business! ✨`;
                          // Auto-trigger download for Admin convenience
                          downloadInvoice(order);
                        } else {
                          // Default/Pending/Cancelled fallback
                          message = `Hi ${firstName}, here is an update on your order *#${orderId}*.\nCurrent Status: *${order.status.toUpperCase()}*.\n\nLet us know if you have questions!`;
                        }

                        window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.374-5.03c0-5.445 4.426-9.876 9.878-9.876 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.444-4.43 9.876-9.874 9.876m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
