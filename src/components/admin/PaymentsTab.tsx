import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

const PaymentsTab: React.FC = () => {
  const { adminSettings, updateAdminSettings } = useStore();
  const { toast } = useToast();
  const [upiId, setUpiId] = useState(adminSettings.payment.upiId);
  const [qrCode, setQrCode] = useState<string | null>(adminSettings.payment.upiQrCode);
  const [rzpKey, setRzpKey] = useState(adminSettings.payment.razorpayKeyId || '');

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setQrCode(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateAdminSettings({
      payment: {
        ...adminSettings.payment,
        upiId,
        upiQrCode: qrCode,
        razorpayKeyId: rzpKey
      }
    });
    toast({ title: 'Payment settings updated!', description: 'Changes are now live on checkout.' });
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground mb-6">Payment Settings</h1>
      <div className="bg-card rounded-lg border border-border p-6 max-w-xl space-y-6">
        <div>
          <Label htmlFor="upiId">UPI ID</Label>
          <Input id="upiId" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="mt-1" placeholder="yourname@upi" />
          <p className="text-xs text-muted-foreground mt-1">This will be shown to customers at checkout</p>
        </div>
        <div>
          <Label>UPI QR Code</Label>
          <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
            {qrCode ? (
              <div className="space-y-3">
                <img src={qrCode} alt="UPI QR" className="w-40 h-40 mx-auto object-contain" />
                <Button variant="outline" size="sm" onClick={() => setQrCode(null)}>Remove</Button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload QR code</p>
                <input type="file" accept="image/*" onChange={handleQRUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>
        <div className="space-y-4 p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <Label htmlFor="razorpay">Enable Razorpay</Label>
            <Switch id="razorpay" checked={adminSettings.payment.razorpayEnabled} onCheckedChange={(checked) => updateAdminSettings({ payment: { ...adminSettings.payment, razorpayEnabled: checked } })} />
          </div>
          {adminSettings.payment.razorpayEnabled && (
            <div>
              <Label htmlFor="rzpKey">Razorpay Key ID (Test/Live)</Label>
              <Input
                id="rzpKey"
                value={rzpKey}
                onChange={(e) => setRzpKey(e.target.value)}
                placeholder="rzp_test_..."
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Found in Razorpay Dashboard &gt; Settings &gt; API Keys</p>
            </div>
          )}
        </div>

        <Button onClick={handleSave} className="w-full">Save Settings</Button>
      </div>
    </div>
  );
};

export default PaymentsTab;
