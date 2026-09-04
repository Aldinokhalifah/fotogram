import { Metadata } from "next";
import GalleryPageClient from "./galleryClient";
import { getGalleryMetadata } from "@/lib/getGalleryMetadata";
import { cookies } from "next/headers";

interface Props {
    searchParams: Promise<{ userId?: string | string[] }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const query = await searchParams;
    const userId = Array.isArray(query.userId) ? query.userId[0] : query.userId;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

    return getGalleryMetadata(userId, cookieHeader);
}


export default function Gallery() {
    return <GalleryPageClient />;
}