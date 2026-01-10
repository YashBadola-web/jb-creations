import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { format, parseISO } from 'date-fns';

const PLATFORM_FEE_PERCENTAGE = 0.02;

export interface DailyItemSummary {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    revenue: number;
    unitCost: number;
    totalCost: number;
    orderIds: string[];
}

export interface DailyPnL {
    date: string;
    revenue: number;
    cogs: number;
    fees: number;
    shipping: number;
    netProfit: number;
    margin: number;
    items: DailyItemSummary[];
}

export const usePnL = () => {
    const { orders, products, shippingOverrides, feeOverrides } = useStore();

    const data = useMemo(() => {
        const dailyMap = new Map<string, DailyPnL>();

        // Create a map of current product costs for fast lookup
        const productCostMap = new Map<string, number>();
        products.forEach(p => productCostMap.set(p.id, p.costPriceInPaise || 0));

        orders.forEach(order => {
            if (['cancelled', 'pending'].includes(order.status)) return;

            const dateStr = format(parseISO(order.createdAt), 'yyyy-MM-dd');

            const current = dailyMap.get(dateStr) || {
                date: dateStr,
                revenue: 0,
                cogs: 0,
                fees: 0,
                shipping: 0,
                netProfit: 0,
                margin: 0,
                items: [] as DailyItemSummary[]
            };

            // Process Items for Revenue & Aggregation
            const itemsMap = new Map<string, DailyItemSummary>();
            current.items.forEach(i => itemsMap.set(i.productId, i));

            // Revenue
            const orderRevenue = order.totalInPaise;

            // COGS
            let orderCOGS = 0;
            order.items.forEach(item => {
                // USE GLOBAL COST PRICE
                const globalCost = productCostMap.get(item.product.id) || 0;

                const totalItemCost = globalCost * item.quantity;
                const totalItemRev = item.product.priceInPaise * item.quantity;

                orderCOGS += totalItemCost;

                // Aggregate Item
                const existingItem = itemsMap.get(item.product.id);
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                    existingItem.revenue += totalItemRev;
                    existingItem.totalCost += totalItemCost;
                    if (!existingItem.orderIds.includes(order.id)) {
                        existingItem.orderIds.push(order.id);
                    }
                    existingItem.unitCost = globalCost;
                } else {
                    itemsMap.set(item.product.id, {
                        productId: item.product.id,
                        productName: item.product.name,
                        productImage: item.product.images[0] || '',
                        quantity: item.quantity,
                        revenue: totalItemRev,
                        unitCost: globalCost,
                        totalCost: totalItemCost,
                        orderIds: [order.id]
                    });
                }
            });

            current.items = Array.from(itemsMap.values());

            // Calculated Fees (default)
            const orderFees = Math.round(orderRevenue * PLATFORM_FEE_PERCENTAGE);

            current.revenue += orderRevenue;
            current.cogs += orderCOGS;
            current.fees += orderFees;

            dailyMap.set(dateStr, current);
        });

        // Apply Overrides and Calculate Net Profit
        return Array.from(dailyMap.values()).map(day => {
            // Shipping
            const shippingOverride = shippingOverrides[day.date];
            const shippingCostRupees = shippingOverride !== undefined ? shippingOverride : 0;
            const shippingCostPaise = shippingCostRupees * 100;

            // Fees
            const feeOverride = feeOverrides[day.date];
            let finalFeePaise = day.fees;
            if (feeOverride !== undefined) {
                finalFeePaise = feeOverride * 100;
            }

            day.shipping = shippingCostPaise;
            day.fees = finalFeePaise;

            day.netProfit = day.revenue - (day.cogs + day.fees + day.shipping);
            day.margin = day.revenue > 0 ? (day.netProfit / day.revenue) * 100 : 0;

            return day;
        });
    }, [orders, products, shippingOverrides, feeOverrides]);

    const totals = useMemo(() => {
        return data.reduce((acc, curr) => ({
            revenue: acc.revenue + curr.revenue,
            cogs: acc.cogs + curr.cogs,
            fees: acc.fees + curr.fees,
            shipping: acc.shipping + curr.shipping,
            netProfit: acc.netProfit + curr.netProfit
        }), { revenue: 0, cogs: 0, fees: 0, shipping: 0, netProfit: 0 });
    }, [data]);

    return { data, totals };
};
