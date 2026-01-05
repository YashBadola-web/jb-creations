import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground mb-6">Orders</h1>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No orders yet</div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-medium text-foreground">{order.customerInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{order.customerInfo.email}</p>
                    <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-foreground">{order.displayTotal}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={order.status} onValueChange={(value: Order['status']) => updateOrderStatus(order.id, value)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">{order.items.length} item(s)</span>
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
