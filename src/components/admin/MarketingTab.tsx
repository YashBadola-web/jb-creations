import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MarketingTab: React.FC = () => {
    const { coupons, addCoupon, deleteCoupon, adminSettings, updateAdminSettings } = useStore();
    const { toast } = useToast();
    const [newCode, setNewCode] = useState('');
    const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
    const [newValue, setNewValue] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCode || !newValue) return;

        addCoupon({
            code: newCode.toUpperCase(),
            type: newType,
            value: Number(newValue),
            isActive: true,
        });
        setNewCode('');
        setNewValue('');
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create Discount Code</CardTitle>
                    <CardDescription>Add new coupons for checkout.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="grid gap-2 flex-1">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                placeholder="e.g. SUMMER10"
                                value={newCode}
                                onChange={(e) => setNewCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2 w-32">
                            <Label>Type</Label>
                            <Select value={newType} onValueChange={(v: any) => setNewType(v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">% Off</SelectItem>
                                    <SelectItem value="fixed">₹ Off</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2 w-32">
                            <Label>Value</Label>
                            <Input
                                type="number"
                                placeholder="10"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Community Settings</CardTitle>
                    <CardDescription>Grow your community on WhatsApp.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="waLink">WhatsApp Group Invite Link</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="waLink"
                                    placeholder="https://chat.whatsapp.com/..."
                                    defaultValue={adminSettings?.marketing?.whatsappGroupUrl || ''}
                                    onChange={(e) => updateAdminSettings({ marketing: { whatsappGroupUrl: e.target.value } })}
                                />
                                <Button onClick={() => toast({ title: "Saved", description: "Community link updated." })}>Save</Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Leave empty to hide the floating button.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Active Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No coupons active.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                coupons.map((coupon) => (
                                    <TableRow key={coupon.code}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-primary" />
                                            {coupon.code}
                                        </TableCell>
                                        <TableCell>
                                            {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => deleteCoupon(coupon.code)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default MarketingTab;
