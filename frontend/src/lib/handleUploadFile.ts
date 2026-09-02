import { useConfirmUpload, useUploadFile } from "@/hooks/useFiles";
import { CreateUploadUrlInput } from "@/types/File";
import { uploadToMinIO } from "./uploadToMinio";
import toast from "react-hot-toast";

export function useHandleUploadFile() {
    const uploadMutation = useUploadFile();
    const confirmMutation = useConfirmUpload();

    const handleUploadFile = async (metadataFile: CreateUploadUrlInput, file: File): Promise<string> => {
        const response = await uploadMutation.mutateAsync(metadataFile);
        const { uploadUrl, fileId } = response.data;

        if (!uploadUrl || !fileId) {
            throw new Error("Gagal mendapatkan URL upload file!");
        }

        let success = false;
        try {
            success = await uploadToMinIO(uploadUrl, file);
        } catch {
            success = false;
        }

        await confirmMutation.mutateAsync({ fileId, status: success ? "completed" : "failed" });

        if (!success) {
            toast.error("File gagal diupload!");
        }

        toast.success("File berhasil diupload");
        return fileId;
    };

    return {
        handleUploadFile,
        isUploading: uploadMutation.isPending || confirmMutation.isPending,
    };
}