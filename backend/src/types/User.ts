export interface User {
    id?: string;
    name: string;
    username: string;
    email: string;
    password_hash?: string;
    created_at?: Date;
    updated_at?: Date;
}