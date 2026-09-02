"use client"
import { useHandleUploadFile } from "@/lib/handleUploadFile";
import { CreateUploadUrlInput } from "@/types/File";
import { getFileBadge } from "@/utils/getFileBadge";
import { useState, useRef } from "react"
import toast from "react-hot-toast";

type Props = {
    isOpen: boolean
    onClose: () => void
}

export default function UploadForm({ isOpen, onClose }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [caption, setCaption] = useState('')
    const { handleUploadFile, isUploading } = useHandleUploadFile()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if ('files' in e.target) {
            const file = e.target.files ? e.target.files[0] : null;
            setSelectedFile(file);
        } else {
            setCaption(e.target.value)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) setSelectedFile(file)
    }

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        try {
            if (!selectedFile) {
                toast.error("Pilih file terlebih dahulu");
                return;
            }
            const metadataFile: CreateUploadUrlInput = {
                filename: selectedFile.name,
                fileSize: selectedFile.size,
                fileType: selectedFile.type,
                caption: caption, 
            };
            await handleUploadFile(metadataFile as CreateUploadUrlInput, selectedFile as File)
            setSelectedFile(null)
            setCaption('')
            onClose()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            toast.error(message)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Upload files</h2>
                            <p className="text-sm text-gray-500">Select and upload the files of your choice</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Drop zone */}
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors"
                    >
                        <div className="flex justify-center mb-3">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <p className="font-medium text-gray-800">Choose a file or drag & drop it here.</p>
                        <p className="text-sm text-gray-400 mt-1">JPEG, PNG, and MP4 formats, up to 50 MB.</p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                            Browse File
                        </button>
                        <input
                            ref={fileInputRef}
                            id="file"
                            name="file"
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Caption */}
                    <input
                        type="text"
                        placeholder="Input Caption"
                        value={caption}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />

                    {/* Preview */}
                    {selectedFile && (
                        <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${getFileBadge(selectedFile).color}`}>
                                <span className="text-xs font-bold">{getFileBadge(selectedFile).label}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                    <span>{(selectedFile.size / 1024).toFixed(0)} KB</span>
                                    {isUploading && (
                                        <span className="text-blue-500 flex items-center gap-1">
                                            <span className="animate-spin">⟳</span> Uploading...
                                        </span>
                                    )}
                                </div>
                                {isUploading && (
                                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full w-1/2 animate-pulse" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isUploading || !selectedFile}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-blue-700"
                    >
                        {isUploading ? 'Mengupload...' : 'Upload'}
                    </button>
                </form>
            </div>
        </div>
    )
}