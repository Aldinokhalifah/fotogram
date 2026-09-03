'use client';

import FileGrid from '@/components/gallery/FileGrid';
import { useSearchParams } from 'next/navigation';

export default function GalleryPageClient() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId') ?? undefined;

    return (
        <div className="w-full">
            <FileGrid userId={userId} />
        </div>
    );
}