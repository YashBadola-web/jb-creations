import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Check if we are actually in a recovery session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // If accessed directly without a link, kick them out
                navigate('/login');
            }
        });
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
            return;
        }

        if (password.length < 6) {
            toast({ variant: "destructive", title: "Error", description: "Password must be at least 6 characters." });
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            toast({ variant: "destructive", title: "Update Failed", description: error.message });
        } else {
            toast({ title: "Success", description: "Your password has been updated. You are now logged in." });
            navigate('/');
        }

        setIsLoading(false);
    };

    return (
        <Layout>
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-muted/20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md p-6 bg-card rounded-xl border shadow-lg"
                >
                    <h1 className="text-2xl font-display font-bold text-center mb-2">Set New Password</h1>
                    <p className="text-center text-muted-foreground text-sm mb-6">
                        Enter your new password below.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </Layout>
    );
};

export default ResetPassword;
