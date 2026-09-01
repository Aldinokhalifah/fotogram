'use server';

import { Metadata } from "next";
import GalleryPageClient from "./galleryClient";
import { userService } from "@/services/user";
import { authService } from "@/services/auth";

type Props = {
    searchParams: Promise<{ userId?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    const userId = params.userId;

    try {
        let user;

        if (userId) {
            // Tampilkan galeri user lain berdasarkan userId
            const response = await userService.getById(userId);
            user = response.data;
        } else {
            // Tampilkan galeri user yang sedang login
            const response = await authService.getMe();
            user = response.data;
        }

        if (user?.name) {
            return {
                title: `${user.name} - Galeri Foto`,
                description: `Lihat koleksi foto dari ${user.name}`,
            };
        }
    } catch (error) {
        console.error("Error generating metadata:", error);
    }

    // Fallback jika error
    return {
        title: "Galeri Foto",
        description: "Galeri foto",
    };
}

export default function Gallery({ searchParams }: Props) {
    return <GalleryPageClient searchParams={searchParams} />;
}