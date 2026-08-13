export interface User {
    id?: string;
    name: string;
    username: string;
    email: string;
    password_hash?: string;
    created_at?: Date;
    updated_at?: Date;
}

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

export interface PublicUserProfile {
    id?: string;
    name: string;
    username: string;
    created_at?: Date;
}