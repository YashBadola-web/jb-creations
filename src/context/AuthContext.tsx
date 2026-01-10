import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

type UserRole = 'admin' | 'user';

interface User {
    email: string;
    role: UserRole;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => boolean;
    register: (email: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('jbcrafts_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('jbcrafts_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('jbcrafts_user');
        }
    }, [user]);

    // Persistent User Database
    const [usersDb, setUsersDb] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem('jbcrafts_users_db');
        return saved ? JSON.parse(saved) : {};
    });

    // Save users DB whenever it changes
    useEffect(() => {
        localStorage.setItem('jbcrafts_users_db', JSON.stringify(usersDb));
    }, [usersDb]);

    const login = (email: string, password: string): boolean => {
        // Admin check - Hardcoded
        const isAdmin = email.toLowerCase() === 'admin@jbcrafts.com';
        if (isAdmin) {
            if (password === 'admin123') {
                const adminUser: User = { email, role: 'admin', name: 'Admin' };
                setUser(adminUser);
                toast.success('Welcome back, Admin!');
                return true;
            } else {
                toast.error('Invalid admin credentials');
                return false;
            }
        }

        // Regular User Check
        const existingPassword = usersDb[email];

        if (existingPassword) {
            // User exists, verify password
            if (existingPassword === password) {
                const returningUser: User = { email, role: 'user', name: email.split('@')[0] };
                setUser(returningUser);
                toast.success(`Welcome back, ${returningUser.name}!`);
                return true;
            } else {
                toast.error('Incorrect password for this email.');
                return false;
            }
        } else {
            // User does not exist
            toast.error('No account found with this email. Please register first.');
            return false;
        }
    };

    const register = (email: string, password: string): boolean => {
        if (usersDb[email]) {
            toast.error('Account already exists. Please login.');
            return false;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }

        setUsersDb(prev => ({ ...prev, [email]: password }));
        const newUser: User = { email, role: 'user', name: email.split('@')[0] };
        setUser(newUser);
        toast.success(`Account created! Welcome, ${newUser.name}!`);
        return true;
    };

    const logout = () => {
        setUser(null);
        toast.info('Logged out successfully');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
