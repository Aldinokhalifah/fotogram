export interface UserResponse {
    id?: string;
    name: string;
    username: string;
    email: string;
    created_at?: string; // ISO date string from backend
    updated_at?: string;
}

export interface PublicUserProfileResponse {
    id?: string;
    name: string;
    username: string;
    created_at?: string;
}

// Inputs sent from frontend to backend (forms / API requests)
export interface RegisterUserInput {
    name: string;
    email: string;
    username: string;
    password: string;
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    username?: string;
    password?: string;
}
