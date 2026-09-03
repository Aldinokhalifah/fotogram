'use client'

import { useFiles, useDeleteFile, usePublicFiles } from "@/hooks/useFiles";
import { FileResponse } from "@/types/File";
import { useState } from "react";
import FileCard from "./FileCard";
import FileDetailModal from "./FileDetailModal";
import UploadForm from "./UploadForm";
import LoadingSpinner from "../LoadingSpinner";
import SearchBar from "./SearchBar";

type Props = {
    userId?: string
}

export default function FileGrid({userId}: Props) {
    const { data: response, isPending } = useFiles(20, 0, !userId);
    const {data: responsePublic, isLoading} = usePublicFiles(userId as string, 20, 0);
    const files = userId ? responsePublic?.data : response?.data;
    const isLoadingData = userId ? isLoading : isPending;
    const [selectedFile, setSelectedFile] = useState<FileResponse | null>(null);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const deleteFile = useDeleteFile();

    const handleFileClick = (file: FileResponse) => {
        setSelectedFile(file);
    };

    const handleCloseModal = () => {
        setSelectedFile(null);
    };

    const handleDeleteFile = (fileId: string) => {
        deleteFile.mutate(fileId);
    };

    const handleCloseUploadForm = () => {
        setShowUploadForm(false);
    };

    if (isLoadingData) {
        return <LoadingSpinner />;
    }

    return(
        <div className="w-full space-y-6">
            {/* Upload Button */}
            {!userId && (
                <button
                    onClick={() => setShowUploadForm(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload File
                </button>
            )}

            {/* Upload Form - dia sendiri udah handle modal wrapper-nya */}
            {!userId && ( <UploadForm isOpen={showUploadForm} onClose={handleCloseUploadForm} />)}

            {/* Search Bar */}
            <SearchBar />

            {/* File Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {files && files.length > 0 ? (
                    files.map((file) => (
                        <FileCard
                            key={file.id}
                            file={file}
                            onClick={() => handleFileClick(file)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        {userId ? (
                            <p>User belum memiliki file.</p>
                        ) : (
                            <p>Belum ada file. Mulai upload file Anda sekarang!</p>
                        )}
                    </div>
                )}
            </div>

            {/* File Detail Modal */}
            {selectedFile && (
                <FileDetailModal
                    file={selectedFile}
                    onClose={handleCloseModal}
                    onDelete={handleDeleteFile}
                />
            )}
        </div>
    )
}