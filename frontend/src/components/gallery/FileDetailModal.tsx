"use client";

import { FileResponse } from "@/types/File";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCallback } from "react";

type Props = {
    file: FileResponse;
    onClose?: () => void;
    onDelete?: (fileId: string) => void;
};

export default function FileDetailModal({ file, onClose, onDelete,}: Props) {
    const { user } = useAuth();

    const isOwner = user?.id === file.user_id;

    const handleBackdropClick = useCallback( (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                onClose?.();
            }
        },
        [onClose]
    );

    const handleDelete = useCallback(() => {
        if (file.id) {
            onDelete?.(file.id);
            onClose?.();
        }
    }, [file.id, onDelete, onClose]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Unknown date";

        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderMedia = () => {
        if (file.type.includes("video")) {
            return (
                <video
                    src={file.url}
                    controls
                    className="w-full h-auto max-h-105 object-contain rounded-lg"
                >
                    Your browser does not support the video tag.
                </video>
            );
        }

        return (
            <Image
                src={file.url as string}
                alt={file.name_file}
                width={800}
                height={800}
                className="w-full h-auto max-h-105 object-contain rounded-lg"
                unoptimized
                priority
            />
        );
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="relative bg-white rounded-[14px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="
                        absolute top-4 right-4 z-10
                        w-9.5 h-9.5
                        rounded-full
                        bg-white/90
                        text-gray-700
                        flex items-center justify-center
                        shadow-[0_2px_8px_rgba(0,0,0,0.12)]
                        hover:bg-white
                        hover:scale-105
                        transition-all
                    "
                    aria-label="Close modal"
                >
                    <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Media */}
                <div className="bg-gray-100 flex items-center justify-center p-4.5">
                    {renderMedia()}
                </div>

                {/* Content */}
                <div className="px-6 pt-5.5 pb-5">

                    {/* Caption */}
                    {file.caption && (
                        <p className="text-base leading-[1.6] text-gray-800 mb-2">
                            {file.caption}
                        </p>
                    )}

                    {/* Upload Date */}
                    <p className="text-[13px] text-gray-400 flex items-center gap-1.5">
                        <svg
                            className="w-3.75 h-3.75"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>

                        {formatDate(file.uploaded_at)}
                    </p>

                    {/* Delete Action */}
                    {isOwner && file.id && (
                        <div className="flex justify-end items-center mt-5 pt-4 border-t border-gray-100">

                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center justify-center gap-2 px-3.5
                                    py-2.25
                                    rounded-lg
                                    border
                                    border-red-200
                                    bg-red-50
                                    text-red-600
                                    text-sm
                                    font-semibold
                                    hover:bg-red-100
                                    hover:border-red-300
                                    hover:text-red-700
                                    hover:-translate-y-px
                                    active:translate-y-0
                                    transition-all
                                "
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-7 0h10"
                                    />
                                </svg>

                                Hapus File
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
