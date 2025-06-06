'use client'; 

import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthResponse } from '@/lib/api';

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (authResponse: AuthResponse) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 组件挂载时，从 localStorage 加载状态
        try {
            const savedToken = localStorage.getItem('blog_token');
            const savedUser = localStorage.getItem('blog_user');
            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Failed to load auth state from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (authResponse: AuthResponse) => {
        const userData = { id: authResponse.id, username: authResponse.username, email: authResponse.email };
        setUser(userData);
        setToken(authResponse.accessToken);
        localStorage.setItem('blog_user', JSON.stringify(userData));
        localStorage.setItem('blog_token', authResponse.accessToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('blog_user');
        localStorage.removeItem('blog_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
