'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { RegisterInput, RegisterSchema } from "@/schemas/authSchema";
import { authService } from "@/services/auth";

export default function RegisterPageClient() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (user: RegisterInput) => {
        try {
            const response = await authService.register(user);
            toast.success(response.message || "Registrasi berhasil");
            router.push('/login');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
                return;
            }

            toast.error('Terjadi kesalahan saat mendaftar');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-gray-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Buat Akun</h1>
                        <p className="text-sm text-gray-500 mt-1">Daftar untuk mulai menggunakan FotoGram</p>
                    </div>

                    {(errors.name || errors.email || errors.username || errors.password) && (
                        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                            {errors.name?.message || errors.email?.message || errors.username?.message || errors.password?.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <span className="text-red-400"> *</span>
                            <input
                                id="name"
                                type="text"
                                placeholder="Masukkan nama lengkap"
                                {...register("name")}
                                className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                            <span className="text-red-400"> *</span>
                            <input
                                id="email"
                                type="email"
                                placeholder="nama@perusahaan.com"
                                {...register("email")}
                                className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                            <span className="text-red-400"> *</span>
                            <input
                                id="username"
                                type="text"
                                placeholder="username_kamu"
                                {...register("username")}
                                className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Kata Sandi</label>
                            <span className="text-red-400"> *</span>
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
                            className="w-full h-10 bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white text-sm font-semibold rounded-lg transition-colors mt-2"
                        >
                            {isSubmitting ? 'Diproses...' : 'Daftar'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-center text-sm text-gray-500">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-violet-600 hover:underline font-medium">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}