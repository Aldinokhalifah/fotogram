import { UserResponse } from "./User";

export interface AuthContextType {
    user: UserResponse | null;
    refreshUser: () => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}
