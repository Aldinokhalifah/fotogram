'use client';

import { useAuth } from "@/context/AuthContext";
import { LoginInput, LoginSchema } from "@/schemas/authSchema";
import { authService } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function LoginPageClient() {
    const auth = useAuth();
    const router = useRouter()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (user: LoginInput) => {
        try {
            const isLoggedIn = await authService.login(user);
            toast.success(isLoggedIn.message);
            await auth.refreshUser();
            router.push('/gallery')
        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-gray-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Selamat Datang</h1>
                    <p className="text-sm text-gray-500 mt-1">Masuk ke FotoGram</p>
                </div>

                {(errors.email || errors.password) && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {errors.email?.message || errors.password?.message}
                    </div>
                )}

                <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
                    <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label> <span className="text-red-400">*</span>
                    <input
                        id="email"
                        type="email"
                        placeholder="nama@perusahaan.com"
                        {...register("email")}
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    />
                    </div>

                    <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Kata Sandi</label> <span className="text-red-400">*</span>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    />
                    </div>

                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors mt-2"
                    >
                    {isSubmitting ? 'Diproses...' : 'Masuk'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-center text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <Link href="/register" className="text-violet-600 hover:underline font-medium">
                        Daftar di sini
                    </Link>
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
}