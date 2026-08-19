import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/ApiResponse";
import { RegisterUserInput, UserResponse } from "@/types/User";

export const authService = {
    register: (data: RegisterUserInput): Promise<ApiResponse<UserResponse>> => 
        apiClient<UserResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
    }),
    login: ({email, password}: { email: string, password: string }): Promise<ApiResponse<null>> =>
        apiClient<null>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({email, password})
        }),
    logout: (): Promise<ApiResponse<null>> =>
        apiClient<null>('/auth/logout'),
    getMe: (): Promise<ApiResponse<UserResponse>> =>
        apiClient<UserResponse>('/users/me')
}