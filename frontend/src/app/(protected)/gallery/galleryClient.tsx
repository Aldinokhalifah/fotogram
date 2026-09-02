'use client';

import { useEffect, useState } from 'react';
import FileGrid from '@/components/gallery/FileGrid';
import LoadingSpinner from '@/components/LoadingSpinner';

type GalleryPageClientProps = {
    searchParams: Promise<{ userId?: string }>;
};

export default function GalleryPageClient({ searchParams }: GalleryPageClientProps) {
    const [userId, setUserId] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getParams = async () => {
            const params = await searchParams;
            setUserId(params.userId);
            setIsLoading(false);
        };
        getParams();
    }, [searchParams]);

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    return (
        <div className="w-full">
            <FileGrid />
        </div>
    );
}