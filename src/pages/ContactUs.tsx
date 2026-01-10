import React from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/common/SEO';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
    return (
        <Layout>
            <SEO title="Contact Us | JB Creations" description="Get in touch with us." />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="font-display text-4xl font-bold mb-8 text-center">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
                            <p className="text-muted-foreground">Have questions about our products or your order? We're here to help.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <a href="mailto:jbcreations1983@gmail.com" className="text-muted-foreground hover:text-primary">jbcreations1983@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Phone</p>
                                    <a href="tel:+919958686464" className="text-muted-foreground hover:text-primary">+91 99586 86464</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-muted-foreground">Delhi, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <input id="name" className="w-full px-3 py-2 border rounded-md" placeholder="Your name" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <input id="email" type="email" className="w-full px-3 py-2 border rounded-md" placeholder="your@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <textarea id="message" rows={4} className="w-full px-3 py-2 border rounded-md" placeholder="How can we help?" />
                            </div>
                            <button className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90 transition-opacity">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ContactUs;
