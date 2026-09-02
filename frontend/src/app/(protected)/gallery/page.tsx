import { Metadata } from "next";
import GalleryPageClient from "./galleryClient";

export const metadata: Metadata = {
    title: "Galeri Foto - FotoGram",
    description: "Lihat dan kelola koleksi foto dan video kamu",
};

export default function Gallery() {
    return <GalleryPageClient />;
}