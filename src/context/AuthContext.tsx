import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'customer';
    password?: string; // Added for local storage auth
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load user from local storage on mount (Synchronously to avoid flash)
    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem('jbcrafts_user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const { toast } = useToast();

    const login = async (email: string, password: string) => {
        try {
            // Retrieve users from local storage
            const storedUsers = localStorage.getItem('jbcrafts_users');
            const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

            // Check for Admin
            if (email.toLowerCase() === 'admin@jbcrafts.com' && password === 'admin123') {
                const adminUser: User = { id: 'admin', email, name: 'Admin', role: 'admin' };
                setUser(adminUser);
                localStorage.setItem('jbcrafts_user', JSON.stringify(adminUser));
                toast({ title: "Welcome back, Admin!", description: "You have full access." });
                return true;
            }

            // Check Normal User
            const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (foundUser) {
                // Verify Password (In a real app, hash this! For LS demo, we check direct match or simple logic)
                // Since we stored it in register, we check it here. The prompt said "local storage based system".
                // We stored 'password' in the user object in register? Or wait, previously I might have just done simple auth.
                // Let's assume we store the password in the user object for this simple local persistence.

                if (foundUser.password === password) {
                    const { password, ...safeUser } = foundUser; // Remove password from session
                    setUser(safeUser);
                    localStorage.setItem('jbcrafts_user', JSON.stringify(safeUser));
                    toast({ title: "Welcome back!", description: "Login successful." });
                    return true;
                } else {
                    toast({ variant: "destructive", title: "Login Failed", description: "Invalid password." });
                    return false;
                }
            } else {
                toast({ variant: "destructive", title: "Login Failed", description: "User not found. Please register." });
                return false;
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "An error occurred during login." });
            return false;
        }
    };

    const register = async (email: string, password: string) => {
        try {
            const storedUsers = localStorage.getItem('jbcrafts_users');
            const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

            if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                toast({ variant: "destructive", title: "Registration Failed", description: "Email already registered. Please login." });
                return false;
            }

            const newUser: User = {
                id: `user_${Date.now()} `,
                email,
                name: email.split('@')[0],
                role: 'customer',
                password // We unfortunately have to store it to verify it later in this simple LS model
            };

            const updatedUsers = [...users, newUser];
            localStorage.setItem('jbcrafts_users', JSON.stringify(updatedUsers));

            const { password: _, ...safeUser } = newUser;
            setUser(safeUser);
            localStorage.setItem('jbcrafts_user', JSON.stringify(safeUser));

            toast({ title: "Account Created", description: "Welcome to JB Crafts!" });
            return true;
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not create account." });
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('jbcrafts_user');
        toast({ title: "Logged Out", description: "See you soon!" });
    };

    const isAdmin = user?.email === 'admin@jbcrafts.com';

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
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
