'use client';

type GalleryPageClientProps = {
    searchParams: Promise<{ userId?: string }>;
};

export default function GalleryPageClient({ searchParams }: GalleryPageClientProps) {
    // Gunakan searchParams untuk menampilkan galeri user yang sesuai
    // searchParams.userId = untuk menampilkan galeri user lain
    // Jika tidak ada userId, tampilkan galeri user yang sedang login
    
    return (
        <div className="">
            {/* Implementasi galeri akan di sini */}
        </div>
    )
}