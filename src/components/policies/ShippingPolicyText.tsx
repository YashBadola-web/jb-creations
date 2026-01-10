import React from 'react';

const ShippingPolicyText = () => {
    return (
        <div className="prose max-w-none text-muted-foreground space-y-8">
            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Shipping Costs & Stock</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Costs:</strong> Calculated at checkout based on weight, dimensions, and destination.</li>
                    <li><strong>Availability:</strong> If an item is out of stock after you order, we will ship the available items and offer you a choice between a refund for the missing item or waiting for a restock.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Delivery Timelines</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Dispatch:</strong> Usually within 4-5 business days (Mon–Fri).</li>
                    <li><strong>Domestic (India):</strong> Typically 2 – 7 days in transit.</li>
                    <li><strong>Tracking:</strong> You will receive a tracking link via whatshapp/email once your order ships.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Returns & Warranties</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Change of Mind:</strong> Returns accepted within 7 days of receipt. Items must be unused and in original packaging. You pay for return shipping. Refunds for these are issued as store credit (shipping costs are non-refundable).</li>
                    <li><strong>Warranty Claims:</strong> Valid for 90 days. We reimburse return shipping if the claim is approved. You can choose a refund, store credit, or a replacement.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Damaged or Lost Parcels</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Damaged in Transit:</strong> If possible, reject the parcel from the courier. Otherwise, contact us immediately. We will issue a refund/replacement after the courier's investigation.</li>
                    <li><strong>Lost in Transit:</strong> We will replace or refund the order once the courier confirms the parcel is lost.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Address Changes & Restrictions</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Changes:</strong> We can update your address only before the order is dispatched.</li>
                    <li><strong>P.O. Boxes/Military:</strong> We ship to these via postal services only (no couriers).</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Customer Service</h2>
                <p>For shipping inquiries or to report a delay:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Phone:</strong> <a href="tel:+919958686464" className="text-primary hover:underline">+91 99586 86464</a></li>
                    <li><strong>Website:</strong> JB Creations</li>
                </ul>
            </section>
        </div>
    );
};

export default ShippingPolicyText;
