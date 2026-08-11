import { UserRepository } from "../repositories/userRepository";
import { type User } from "../types/User";

export class UserService {
    private userRepo = new UserRepository();

    async findByUsername(username: string): Promise<User[] | undefined> {
        return await this.userRepo.findByUsername(username);
    }
}