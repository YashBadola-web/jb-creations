import React from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/common/SEO';

const RefundPolicy = () => {
    return (
        <Layout>
            <SEO title="Refund Policy | JB Creations" description="Our refund and return policy." />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="font-display text-4xl font-bold mb-8">Refund Policy</h1>
                <div className="prose max-w-none text-muted-foreground space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Your Cancellation Rights</h2>
                        <p>You have 7 days from the date you receive your goods to cancel your order without giving a reason.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How to Return</h2>
                        <p>To cancel, you must notify us through one of the following:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Email:</strong> <a href="mailto:jbcreations1983@gmail.com" className="text-primary hover:underline">jbcreations1983@gmail.com</a></li>
                            <li><strong>Phone:</strong> <a href="tel:+919958686464" className="text-primary hover:underline">+91 99586 86464</a></li>
                            <li><strong>Website:</strong> JB Creations</li>
                            <li><strong>Address:</strong> Delhi, India</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Conditions for Returns</h2>
                        <p>To be eligible for a refund, the following must apply:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>The items were purchased in the last 7 days.</li>
                            <li>The items are in their original packaging.</li>
                        </ul>
                        <p className="mt-4 font-medium text-foreground">Non-Returnable Items:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Personalized or custom-made goods.</li>
                            <li>Items that deteriorate rapidly or are past their expiry date.</li>
                            <li>Items unsealed after delivery (for hygiene/health protection).</li>
                            <li>Items that have been inseparably mixed with other materials.</li>
                            <li><strong>Sale items:</strong> Only regular-priced items can be refunded. Sale items are final unless required by law.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Shipping & Refunds</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Cost:</strong> You are responsible for the cost and risk of shipping items back to us. We recommend using a trackable and insured mail service.</li>
                            <li><strong>Proof:</strong> We cannot issue a refund without the physical goods or valid proof of delivery.</li>
                            <li><strong>Processing:</strong> Once we receive the goods, we will refund you within 14 days using the same payment method you used for the purchase.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Gifts</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>If the item was marked as a gift and shipped directly to you, you will receive a gift credit.</li>
                            <li>If it wasn't marked as a gift, the refund will be sent back to the original purchaser.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default RefundPolicy;
