import { Metadata } from "next";

export async function getGalleryMetadata(userId: string | undefined, cookieHeader: string): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    if (!baseUrl) {
        return { title: 'Galeri Foto' }
    }

    try {
        const endpoint = userId ? `/users/${userId}` : '/users/me';
        const res = await fetch(`${baseUrl}${endpoint}`, {
            headers: { Cookie: cookieHeader },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error('metadata fetch failed')
            return { title: 'Galeri Foto' }
        }

        const json = await res.json()
        const gallery = json?.data

        if (!gallery) {
            console.error('metadata gallery is null')
            return { title: 'Galeri Foto' }
        }

        return {
            title: `${gallery.name} | Galeri Foto`,
            description: `Lihat koleksi foto dan video dari ${gallery.name}`,
            openGraph: {
                title: gallery.name,
                description: `Lihat koleksi foto dan video dari ${gallery.name}`,
                type: 'website',
            },
        }
    } catch (error) {
        console.error('generateMetadata error', error)
        return {
            title: 'Galeri Foto',
        }
    }
}