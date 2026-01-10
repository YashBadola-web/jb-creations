import React from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/common/SEO';

const TermsOfService = () => {
    return (
        <Layout>
            <SEO title="Terms of Service | JB Creations" description="Terms and conditions for using our website." />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="font-display text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose max-w-none text-muted-foreground space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance & Eligibility</h2>
                        <p>By using our website, you agree to these Terms and our Privacy Policy. You must be at least 18 years old to use our services. If you do not agree, please stop using the site and contact us at <a href="mailto:jbcreations1983@gmail.com" className="text-primary hover:underline">jbcreations1983@gmail.com</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Account Responsibilities</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Accuracy:</strong> You must provide true and updated account information.</li>
                            <li><strong>Security:</strong> You are responsible for keeping your password safe and for all activities under your account.</li>
                            <li><strong>Termination:</strong> We reserve the right to suspend accounts or refuse service for any breach of terms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Purchases & Payments</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Information:</strong> You may be required to provide billing and shipping details to complete a purchase.</li>
                            <li><strong>Verification:</strong> You warrant that you have the legal right to use your chosen payment method.</li>
                            <li><strong>Cancellations:</strong> We may cancel orders due to errors in pricing, availability, or suspicion of fraud.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Refunds & Promotions</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Refunds:</strong> Requests must be made within 5 days of the original purchase.</li>
                            <li><strong>Promotions:</strong> Contests or sweepstakes may have separate rules that override these general terms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Intellectual Property & Content</h2>
                        <p>All content on this site is the property of JB Creations. You may not use, copy, or distribute any material for commercial or personal gain without written permission.</p>
                        <p className="mt-2"><strong>DMCA:</strong> We respect copyrights. If you believe your work has been infringed, please email us a formal notice with specific details.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Prohibited Conduct</h2>
                        <p>You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Violate any laws or exploit minors.</li>
                            <li>Send spam or impersonate others.</li>
                            <li>Use robots, spiders, or viruses to interfere with the site’s functionality.</li>
                            <li>Attempt to gain unauthorized access to our servers or databases.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Legal Disclaimers</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>"As Is" Basis:</strong> We provide our services without any warranties regarding reliability, accuracy, or availability.</li>
                            <li><strong>Limitation of Liability:</strong> To the extent permitted by law, the Company is not liable for indirect or consequential damages. Our total liability is limited to the amount you paid for the product.</li>
                            <li><strong>Governing Law:</strong> These terms are governed by the laws of India (Gujarat).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Changes & Updates</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Amendments:</strong> We may update these terms at any time. Continued use of the site means you accept the new terms.</li>
                            <li><strong>Feedback:</strong> Any suggestions or feedback you provide can be used by us without compensation or confidentiality.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Us</h2>
                        <p>For support or questions, please email: <a href="mailto:jbcreations1983@gmail.com" className="text-primary hover:underline">jbcreations1983@gmail.com</a></p>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default TermsOfService;
