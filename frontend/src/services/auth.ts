import { apiClient } from "@/lib/apiClient";
import { RegisterUserInput, UserResponse } from "@/types/User";

export const authService = {
    register: (data: RegisterUserInput): Promise<UserResponse> => 
        apiClient<UserResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
    }),
    login: (data: { email: string; password: string }): Promise<{ status: string; message: string }> =>
        apiClient<{ status: string; message: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    logout: (): Promise<{ status: string; message: string }> =>
        apiClient<{ status: string; message: string }>('/auth/logout'),
    getMe: (): Promise<UserResponse> =>
        apiClient<UserResponse>('/users/me')
}