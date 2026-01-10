import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPriceINR } from '@/types';
import { format, parseISO } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { usePnL, DailyPnL, DailyItemSummary } from '@/hooks/usePnL';

interface FlatRow {
    id: string; // Unique combination of date_productId
    date: string;
    isFirstOfDay: boolean;
    dayData: DailyPnL;
    item: DailyItemSummary;
}

const PnLView: React.FC = () => {
    // We still need store for update functions
    const { shippingOverrides, updateShippingOverride, updateProduct, feeOverrides, updateFeeOverride } = useStore();
    const { data: dailyData, totals } = usePnL();

    // We only support sorting by date for this view to keep grouping intact
    const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);

    const [editingShipping, setEditingShipping] = useState<{ [date: string]: string }>({});
    const [editingFees, setEditingFees] = useState<{ [date: string]: string }>({});
    const [editingCost, setEditingCost] = useState<{ [key: string]: string }>({}); // key: date_productId

    const totalMargin = totals.revenue > 0 ? (totals.netProfit / totals.revenue) * 100 : 0;

    // Flatten The Data
    const flatData = useMemo(() => {
        const rows: FlatRow[] = [];

        // The dailyData from usePnL is typically ordered by date if the source orders are.
        // However, robust sorting should happen here or in the hook.
        // Let's sort dailyData by date desc just to be sure we group correctly before flattening.
        const sortedDaily = [...dailyData].sort((a, b) => b.date.localeCompare(a.date));

        sortedDaily.forEach(day => {
            if (day.items.length === 0) {
                return;
            }

            day.items.forEach((item, index) => {
                rows.push({
                    id: `${day.date}_${item.productId}_${index}`, // Ensure uniqueness even if duplicate product in day (though map prevents that)
                    date: day.date,
                    isFirstOfDay: index === 0,
                    dayData: day,
                    item: item
                });
            });
        });

        return rows;
    }, [dailyData]);

    const handleShippingChange = (date: string, value: string) => {
        setEditingShipping(prev => ({ ...prev, [date]: value }));
    };

    const saveShipping = (date: string) => {
        const value = editingShipping[date];
        if (value === undefined) return;
        const numValue = value === '' ? 0 : parseFloat(value);
        if (!isNaN(numValue)) {
            updateShippingOverride(date, numValue);
            setEditingShipping(prev => {
                const next = { ...prev };
                delete next[date];
                return next;
            });
        }
    };

    const handleFeeChange = (date: string, value: string) => {
        setEditingFees(prev => ({ ...prev, [date]: value }));
    };

    const saveFee = (date: string) => {
        const value = editingFees[date];
        if (value === undefined) return;
        const numValue = value === '' ? 0 : parseFloat(value);
        if (!isNaN(numValue)) {
            updateFeeOverride(date, numValue);
            setEditingFees(prev => {
                const next = { ...prev };
                delete next[date];
                return next;
            });
        }
    };

    const handleCostChange = (key: string, value: string) => {
        setEditingCost(prev => ({ ...prev, [key]: value }));
    };

    const saveCost = (date: string, item: DailyItemSummary) => {
        const key = `${date}_${item.productId}`;
        const value = editingCost[key];
        if (value === undefined) return;

        const numVal = parseFloat(value);
        if (!isNaN(numVal)) {
            // Update Global Product Cost
            const costInPaise = Math.round(numVal * 100);

            // updateProduct only updates fields provided.
            updateProduct(item.productId, { costPriceInPaise: costInPaise });

            setEditingCost(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const columnHelper = createColumnHelper<FlatRow>();

    const columns = useMemo(() => [
        columnHelper.accessor('date', {
            header: ({ column }) => (
                <div className="pl-4">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ),
            cell: ({ row, getValue }) => {
                if (!row.original.isFirstOfDay) return null;
                return (
                    <div className="pl-4 font-medium text-muted-foreground whitespace-nowrap">
                        {format(parseISO(getValue()), 'MMM dd, yyyy')}
                    </div>
                )
            },
        }),
        columnHelper.accessor('item.productName', {
            header: 'Product',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 min-w-[180px]">
                    {row.original.item.productImage && (
                        <img
                            src={row.original.item.productImage}
                            alt=""
                            className="w-8 h-8 rounded object-cover border"
                        />
                    )}
                    <span className="font-medium text-sm">{row.original.item.productName}</span>
                </div>
            )
        }),
        columnHelper.accessor('item.quantity', {
            header: 'Qty',
            cell: info => <div className="text-center text-sm">{info.getValue()}</div>,
        }),
        columnHelper.accessor(row => row.item.revenue, {
            id: 'itemRevenue',
            header: 'Revenue',
            cell: info => <span className="text-sm">{formatPriceINR(info.getValue())}</span>,
        }),
        columnHelper.accessor(row => row.item.unitCost, {
            id: 'unitCost',
            header: 'Unit COGS (₹)',
            cell: ({ row }) => {
                const { item, date } = row.original;
                const key = `${date}_${item.productId}`;
                const contextCost = item.unitCost / 100; // to rupees
                const currentVal = editingCost[key] !== undefined ? editingCost[key] : contextCost.toString();

                return (
                    <Input
                        type="number"
                        className="w-20 h-8 text-right text-sm"
                        value={currentVal}
                        onChange={(e) => handleCostChange(key, e.target.value)}
                        onBlur={() => saveCost(date, item)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                saveCost(date, item);
                                e.currentTarget.blur();
                            }
                        }}
                    />
                );
            }
        }),
        columnHelper.accessor(row => row.item.totalCost, {
            id: 'totalCost',
            header: 'Total COGS',
            cell: info => <span className="text-sm">{formatPriceINR(info.getValue())}</span>,
        }),
        // Daily Metrics - Only Show on First Row
        columnHelper.accessor(row => row.dayData.fees, {
            id: 'dayFees',
            header: 'Fees (Day)',
            cell: ({ row }) => {
                if (!row.original.isFirstOfDay) return null;

                const date = row.original.date;
                const dailyFees = row.original.dayData.fees;
                const contextVal = feeOverrides[date];

                let displayValue = '';
                if (editingFees[date] !== undefined) {
                    displayValue = editingFees[date];
                } else if (contextVal !== undefined) {
                    displayValue = contextVal.toString();
                } else {
                    displayValue = (dailyFees / 100).toFixed(2);
                }

                return (
                    <Input
                        type="number"
                        className="w-20 h-8 text-right text-sm"
                        value={displayValue}
                        placeholder="0"
                        onChange={(e) => handleFeeChange(date, e.target.value)}
                        onBlur={() => saveFee(date)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                saveFee(date);
                                e.currentTarget.blur();
                            }
                        }}
                    />
                );
            }
        }),
        columnHelper.accessor(row => row.dayData.shipping, {
            id: 'dayShipping',
            header: 'Shipping (Day)',
            cell: ({ row }) => {
                if (!row.original.isFirstOfDay) return null;

                const date = row.original.date;
                const contextVal = shippingOverrides[date];
                const currentVal = editingShipping[date] !== undefined ? editingShipping[date] : (contextVal !== undefined ? contextVal.toString() : '');

                return (
                    <Input
                        type="number"
                        className="w-20 h-8 text-right text-sm"
                        value={currentVal}
                        placeholder="0"
                        onChange={(e) => handleShippingChange(date, e.target.value)}
                        onBlur={() => saveShipping(date)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                saveShipping(date);
                                e.currentTarget.blur();
                            }
                        }}
                    />
                );
            }
        }),
        columnHelper.accessor(row => row.dayData.netProfit, {
            id: 'dayNetProfit',
            header: 'Net Profit (Day)',
            cell: ({ row, getValue }) => {
                if (!row.original.isFirstOfDay) return null;
                const val = getValue();
                return (
                    <span className={`font-bold text-sm ${val >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPriceINR(val)}
                    </span>
                );
            }
        }),
    ], [editingCost, editingFees, editingShipping, feeOverrides, shippingOverrides]);

    const table = useReactTable({
        data: flatData,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPriceINR(totals.revenue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {formatPriceINR(totals.cogs + totals.fees + totals.shipping)}
                        </div>
                        <p className="text-xs text-muted-foreground">COGS + Fees + Shipping</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPriceINR(totals.netProfit)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${totalMargin >= 20 ? 'text-green-600' : 'text-amber-600'}`}>
                            {totalMargin.toFixed(1)}%
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table */}
            <div className="rounded-md border bg-card">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg">Daily Profit & Loss</h3>
                    <p className="text-sm text-muted-foreground">
                        Detailed breakdown by item. Daily metrics (Fees, Shipping, Profit) are grouped by date.
                    </p>
                </div>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <tr
                                        key={row.id}
                                        className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${row.original.isFirstOfDay ? 'bg-muted/10' : ''}`}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="h-24 text-center">
                                        No sales data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {/* Total Footer Row */}
                        <tfoot className="border-t bg-muted/50 font-medium [&_tr]:border-b">
                            <tr>
                                <td className="p-4 align-middle pl-12 text-muted-foreground">Total</td>
                                <td className="p-4 align-middle"></td>
                                <td className="p-4 align-middle"></td>
                                <td className="p-4 align-middle">{formatPriceINR(totals.revenue)}</td>
                                <td className="p-4 align-middle"></td>
                                <td className="p-4 align-middle">{formatPriceINR(totals.cogs)}</td>
                                <td className="p-4 align-middle">{formatPriceINR(totals.fees)}</td>
                                <td className="p-4 align-middle">{formatPriceINR(totals.shipping)}</td>
                                <td className={`p-4 align-middle ${totals.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatPriceINR(totals.netProfit)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PnLView;
