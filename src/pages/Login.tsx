
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    const [searchParams] = useSearchParams();
    const isRegisterMode = searchParams.get('mode') === 'register';

    // Toggle between login and register by changing URL
    const toggleMode = () => {
        if (isRegisterMode) {
            navigate('/login');
        } else {
            navigate('/login?mode=register');
        }
    };

    const { login, register } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast(); // For feedback

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsLoading(true);

        if (isRegisterMode) {
            const success = await register(email, password);
            if (success) {
                navigate('/');
            }
            // Error handled in context toast
        } else {
            const success = await login(email, password);

            if (success) {
                if (email.toLowerCase() === 'admin@jbcrafts.com') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        }
        setIsLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Contact Administrator",
            description: "Please contact the administrator to reset your password.",
        });
        setIsResetMode(false);
    };

    return (
        <Layout>
            <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
                {/* Background decorative elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 animate-pulse delay-700" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10 mx-4"
                >
                    <div className="backdrop-blur-xl bg-card/40 border border-white/10 shadow-2xl rounded-2xl p-8 md:p-10">
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="font-display text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-3">
                                    {isResetMode
                                        ? "Reset Password"
                                        : isRegisterMode
                                            ? "Create Account"
                                            : "Welcome Back"
                                    }
                                </h1>
                                <p className="text-muted-foreground">
                                    {isResetMode
                                        ? "Enter your email to receive a reset link"
                                        : isRegisterMode
                                            ? "Sign up to start shopping with us"
                                            : "Enter your credentials to access your account"}
                                </p>
                            </motion.div>
                        </div>

                        {isResetMode ? (
                            // FORGOT PASSWORD FORM
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reset-email">Email Address</Label>
                                        <Input
                                            id="reset-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-background/50 border-white/10 focus:border-primary/50 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 text-lg font-medium shadow-lg hover:shadow-primary/25 transition-all duration-300"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </Button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsResetMode(false)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Back to {isRegisterMode ? 'Register' : 'Login'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // LOGIN FORM
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-background/50 border-white/10 focus:border-primary/50 transition-all duration-300"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            <button
                                                type="button"
                                                onClick={() => setIsResetMode(true)}
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-background/50 border-white/10 focus:border-primary/50 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 text-lg font-medium shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            {isRegisterMode ? "Sign Up" : "Sign In"}
                                            {/* Arrow icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        </span>
                                    )}
                                </Button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-muted/30" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            Demo Credentials
                                        </span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                        {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
                                        <button
                                            type="button"
                                            onClick={toggleMode}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {isRegisterMode ? "Login" : "Register"}
                                        </button>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border/50">
                                    <div>
                                        <p className="font-semibold mb-1">User:</p>
                                        <p>@gmail.com</p>
                                        <p> 6+ or 8+ chars</p>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Login;
