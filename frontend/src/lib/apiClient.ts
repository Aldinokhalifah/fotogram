import { ApiResponse } from "@/types/ApiResponse";
import { buildHeaders } from "./buildHeaders";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    if (!BASE_URL) {
        throw new Error('Environment variable NEXT_PUBLIC_API_URL is not defined');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: buildHeaders(options.headers, options.body),
        credentials: 'include'
    });

    const contentType = response.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
        const message = data?.message ?? response.statusText ?? 'Terjadi kesalahan';
        throw new Error(message);
    }

    if (data && typeof data === 'object' && 'data' in data) {
        return data as ApiResponse<T>;
    }

    return data as ApiResponse<T>;
}