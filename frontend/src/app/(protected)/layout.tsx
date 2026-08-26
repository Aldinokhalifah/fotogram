import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ReactNode } from "react";
import Provider from "../provider/QueryProvider";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <Provider>
            <ProtectedRoute>
                {children}
            </ProtectedRoute>
        </Provider>
    );
}