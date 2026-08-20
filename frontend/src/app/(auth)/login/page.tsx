import { Metadata } from "next";
import LoginPageClient from "./loginClient";

export const metadata: Metadata = {
    title: "Login FotoGram",
    description: "Halaman untuk masuk ke FotoGram",
};

export default function LoginPage() {

    return (
        <LoginPageClient />
    );
}