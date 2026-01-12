import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'admin' | 'customer';
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<boolean>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Map Supabase User to App User
    const mapUser = (sbUser: SupabaseUser): User => {
        const isAdmin = sbUser.email?.toLowerCase() === 'admin@jbcreations.com';
        return {
            id: sbUser.id,
            email: sbUser.email || '',
            name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0],
            role: isAdmin ? 'admin' : 'customer',
        };
    };

    useEffect(() => {
        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                setUser(mapUser(session.user));
            }
            setIsLoading(false);
        });

        // 2. Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                setUser(mapUser(session.user));
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast({ variant: "destructive", title: "Login Failed", description: error.message });
                return false;
            }

            toast({ title: "Welcome back!", description: "Login successful." });
            return true;
        } catch (error) {
            toast({ variant: "destructive", title: "Login Error", description: "An unexpected error occurred." });
            return false;
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                // Make sure to set the redirect URL for email verification if enabled
                // options: { emailRedirectTo: window.location.origin } 
            });

            if (error) {
                toast({ variant: "destructive", title: "Registration Failed", description: error.message });
                return false;
            }

            toast({ title: "Registration Successful", description: "Welcome to JB Creations!" });
            return true;
        } catch (error) {
            toast({ variant: "destructive", title: "Registration Error", description: "Could not create account." });
            return false;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        toast({ title: "Logged Out", description: "See you soon!" });
    };

    const resetPassword = async (email: string) => {
        try {
            // This URL must match your routed 'Reset Password' page
            const redirectTo = `${window.location.origin}/reset-password`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo,
            });

            if (error) {
                toast({ variant: "destructive", title: "Request Failed", description: error.message });
                return false;
            }

            toast({ title: "Email Sent", description: "Check your inbox for the password reset link." });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, resetPassword, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
