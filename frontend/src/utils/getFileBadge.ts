export const getFileBadge = (file: File) => {
        if (file.type.startsWith('image/')) return { label: 'IMG', color: 'bg-blue-50 text-blue-600' }
        if (file.type.startsWith('video/')) return { label: 'VID', color: 'bg-purple-50 text-purple-600' }
        return { label: 'FILE', color: 'bg-gray-50 text-gray-600' }
    }