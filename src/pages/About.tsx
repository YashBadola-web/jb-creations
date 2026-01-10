import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success('Message sent!', {
                description: "Thank you for contacting us. We'll get back to you shortly.",
            });
            setFormData({ name: '', email: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 px-4 md:py-32 overflow-hidden bg-secondary/30">
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                    <Link to="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto text-center max-w-4xl"
                >
                    <h1 className="text-4xl md:text-6xl font-display font-semibold mb-6 tracking-tight text-foreground">
                        Crafting Harmony in Every Piece
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Welcome to JB Creations, where passion meets craftsmanship. We are dedicated to creating unique,
                        handmade items that bring joy and beauty to your life. From intricate resin art pieces
                        to delightful kids' toys and stylish home decor, each item is crafted with love and
                        attention to detail.
                    </p>
                </motion.div>
            </section>

            {/* Story Section */}
            <section className="py-16 px-4 md:py-24">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80"
                                alt="Artisan working in studio"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-6">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Founded with a passion for handmade artistry, JB Crafts began as a small studio dedicated to exploring the beautiful versatility of resin art. What started as a hobby quickly blossomed into a mission to create unique, personalized items that tell a story.
                                </p>
                                <p>
                                    Every piece we create—from intricate resin bookmarks to personalized kids' decor—is handcrafted with meticulous attention to detail. We take pride in sourcing high-quality materials and pouring our heart into every design, ensuring that what you receive is not just a product, but a piece of art.
                                </p>
                                <p>
                                    Today, JB Crafts continues to grow, offering a wide range of custom resin art, home decor, and gifts. Our goal remains simple: to spread joy and harmony through our crafts.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-4 md:py-24 bg-secondary/30">
                <div className="container mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">Get in Touch</h2>
                        <p className="text-muted-foreground">
                            Have a question about a custom order or just want to say hello? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-8 md:col-span-1">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-background rounded-full shadow-sm text-primary">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Email Us</h3>
                                    <a href="mailto:hello@jbcrafts.com" className="text-muted-foreground hover:text-primary transition-colors">
                                        hello@jbcrafts.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-background rounded-full shadow-sm text-primary">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Call Us</h3>
                                    <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary transition-colors">
                                        +91 98765 43210
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-background rounded-full shadow-sm text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Our Studio</h3>
                                    <p className="text-muted-foreground">
                                        Mumbai, Maharashtra<br />
                                        India
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-2 bg-background p-8 rounded-2xl shadow-sm border border-border/50">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                                        <Input
                                            id="name"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Your email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                                    <Textarea
                                        id="message"
                                        placeholder="How can we help you?"
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
