'use server';

import { Metadata } from "next";
import GalleryPageClient from "./galleryClient";
import { getGalleryMetadata } from "@/lib/getGalleryMetadata";

type Props = {
    searchParams: Promise<{ userId?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    const userId = params.userId;

    const metadata = await getGalleryMetadata(userId);

    return {
        title: metadata.title,
        description: metadata.description,
    };
}

export default function Gallery({ searchParams }: Props) {
    return <GalleryPageClient searchParams={searchParams} />;
}