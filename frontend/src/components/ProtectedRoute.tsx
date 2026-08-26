"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) return <LoadingSpinner/>; // atau null, spinner, dst
    if (!user) return null; // sambil nunggu redirect jalan

    return <>{children}</>;
}