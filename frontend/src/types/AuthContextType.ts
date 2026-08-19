import { UserResponse } from "./User";

export interface AuthContextType {
    user: UserResponse | null;
    refreshUser: () => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}
