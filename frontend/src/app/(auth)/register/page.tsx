import { Metadata } from "next";
import RegisterPageClient from "./registerClient";

export const metadata: Metadata = {
    title: "Register FotoGram",
    description: "Halaman untuk mendafatarkan akun di FotoGram",
};

export default function RegisterPage() {
    return (
        <RegisterPageClient />
    )
}