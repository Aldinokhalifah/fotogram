export async function uploadToMinIO(uploadUrl: string, file: File): Promise<boolean> {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
    });
    return response.ok;
}