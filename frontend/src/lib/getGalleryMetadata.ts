import { userService } from "@/services/user";
import { authService } from "@/services/auth";

type MetadataResult = {
    title: string;
    description: string;
};

export async function getGalleryMetadata(userId?: string): Promise<MetadataResult> {
    try {
        let user;

        if (userId) {
            // Tampilkan galeri user lain berdasarkan userId
            const response = await userService.getById(userId);
            user = response.data;
        } else {
            // Tampilkan galeri user yang sedang login
            const response = await authService.getMe();
            user = response.data;
        }

        if (user?.name) {
            return {
                title: `${user.name} - Galeri Foto`,
                description: `Lihat koleksi foto dan video dari ${user.name}`,
            };
        }
    } catch (error) {
        console.error("Error generating gallery metadata:", error);
    }

    // Fallback jika error
    return {
        title: "Galeri Foto",
        description: "Galeri foto",
    };
}
