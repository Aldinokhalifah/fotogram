"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/auth";
import { UserResponse } from "@/types/User";
import { AuthContextType } from "@/types/AuthContextType";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function getInitialUser(): Promise<UserResponse | null> {
    try {
        const user = await authService.getMe();
        return user.data ?? null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadUser = async () => {
            const initialUser = await getInitialUser();

            if (isMounted) {
                setUser(initialUser);
                setIsLoading(false);
            }
        };

        void loadUser();

        return () => {
            isMounted = false;
        };
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const user = await authService.getMe();
            setUser(user.data ?? null);
        } catch {
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new Error(String(error));
        }
    }, []);

    const value = useMemo(
        () => ({ user, refreshUser, logout, isLoading }),
        [user, refreshUser, logout, isLoading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}