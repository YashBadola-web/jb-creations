import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShippingPolicyText from "@/components/policies/ShippingPolicyText";

interface ShippingPolicyModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAccept: () => void;
}

const ShippingPolicyModal: React.FC<ShippingPolicyModalProps> = ({
    isOpen,
    onOpenChange,
    onAccept,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl">Shipping & Delivery Policy</DialogTitle>
                    <DialogDescription>
                        Please review our shipping policy before confirming your order.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden p-6 pt-2">
                    <ScrollArea className="h-full w-full rounded-md border p-4">
                        <ShippingPolicyText />
                    </ScrollArea>
                </div>

                <DialogFooter className="p-6 pt-2 gap-2 sm:gap-0 mt-auto border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        onAccept();
                        onOpenChange(false);
                    }}>
                        I Agree & Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ShippingPolicyModal;
