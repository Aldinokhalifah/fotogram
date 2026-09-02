import { Metadata } from "next";
import GalleryPageClient from "./galleryClient";

// type Props = {
//     searchParams: Promise<{ userId?: string }>;
// };

export const metadata: Metadata = {
    title: "Galeri Foto - FotoGram",
    description: "Lihat dan kelola koleksi foto dan video kamu",
};

export default function Gallery() {
    return <GalleryPageClient />;
}