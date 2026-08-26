'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ReactNode } from "react";

export default function Provider( {children}: { children: ReactNode }) {
    const [qc] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 20, 
                gcTime: 1000 * 60 * 30,
                retry: 1
            }
        }
    }));

    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}