import React from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/common/SEO';

const PrivacyPolicy = () => {
    return (
        <Layout>
            <SEO title="Privacy Policy | JB Creations" description="How we handle your data." />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="font-display text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose max-w-none text-muted-foreground space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information Collection</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Personal Data:</strong> We collect information you provide (name, address, email) when you buy something or browse our shop.</li>
                            <li><strong>Technical Data:</strong> We automatically receive your computer’s IP address to help us understand your browser and operating system.</li>
                            <li><strong>Marketing:</strong> With your permission, we may send emails about new products and updates.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Consent</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>How we get it:</strong> When you complete a transaction, we imply that you consent to us using your data for that specific reason only.</li>
                            <li><strong>Withdrawing Consent:</strong> You can opt-out of marketing or data collection at any time by contacting us at <a href="tel:+919958686464" className="text-primary hover:underline">+91 99586 86464</a>.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Third-Party Services & Disclosure</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Disclosure:</strong> We only share your info if required by law or if you violate our Terms of Service.</li>
                            <li><strong>Service Providers:</strong> Third parties (like delivery or payment partners) only collect and use your info to the extent necessary to perform their services for us.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Payment Security (Razorpay)</h2>
                        <p>We use Razorpay for processing payments.</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>PCI-DSS Standards:</strong> Your data is encrypted through the Payment Card Industry Data Security Standard.</li>
                            <li>Your transaction data is stored only as long as needed to complete your purchase, then it is deleted.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Security & Cookies</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Security:</strong> We follow industry best practices to ensure your information is not lost, misused, or altered.</li>
                            <li><strong>Cookies:</strong> We use cookies to keep track of your current session, but they are not used to identify you on other websites.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Age of Consent</h2>
                        <p>By using this site, you confirm that you are at least the age of majority in your state or province, or that you have given consent for your minor dependents to use this site.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Policy Changes</h2>
                        <p>We may update this policy at any time. Significant changes will be posted here so you are always aware of what information we collect and how we use it.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Information</h2>
                        <p>To access, correct, or delete any personal information we have about you, contact us at:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li><strong>Phone:</strong> <a href="tel:+919958686464" className="text-primary hover:underline">+91 99586 86464</a></li>
                            <li><strong>Email:</strong> <a href="mailto:jbcreations1983@gmail.com" className="text-primary hover:underline">jbcreations1983@gmail.com</a></li>
                        </ul>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPolicy;
