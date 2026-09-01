import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/ApiResponse";
import { PublicUserProfileResponse, UpdateUserInput, UserResponse } from "@/types/User";

export const userService = {
    getById: (userId: string):Promise<ApiResponse<PublicUserProfileResponse>> =>
        apiClient<PublicUserProfileResponse>(`/users/${userId}`),
    searchUsers: (keyword: string): Promise<ApiResponse<UserResponse[]>> =>
        apiClient<UserResponse[]>(`/users?search${keyword}`),
    updateUser: (data: UpdateUserInput, userId: string):Promise<ApiResponse<UserResponse>> =>
        apiClient<UserResponse>(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
    deleteUser: (userId: string):Promise<ApiResponse<UserResponse>> =>
        apiClient<UserResponse>(`/users/${userId}`, {
            method: 'DELETE'
        }),
}