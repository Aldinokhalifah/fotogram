import { UserRepository } from "../repositories/userRepository";
import type { UpdateUserInput, User } from "../types/User";

export class UserService {
    private userRepo = new UserRepository();

    async getUserById(id: string): Promise<User | undefined> {
        return await this.userRepo.findById(id);
    }

    async findByUsername(username: string): Promise<User | undefined> {
        return await this.userRepo.findByUsername(username);
    }

    async searchUsers(keyword: string, limit: number): Promise<User[] | undefined> {
        if(keyword.length == 0) {
            throw new Error("Keyword tidak boleh kosong!")
        }
        return await this.userRepo.searchByUsername(keyword, limit);
    }

    async updateUser(id: string, data: UpdateUserInput): Promise<User | undefined> {
        const existingUser = await this.userRepo.findById(id);
        if (!existingUser) {
            throw new Error("User tidak ditemukan");
        }

        const updateData: Partial<User> = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.email !== undefined) {
            if (data.email !== existingUser.email) {
                const existingEmail = await this.userRepo.findByEmail(data.email);
                if (existingEmail && existingEmail.id !== id) {
                    throw new Error("Email sudah terdaftar");
                }
            }
            updateData.email = data.email;
        }

        if (data.username !== undefined) {
            if (data.username !== existingUser.username) {
                const existingUsername = await this.userRepo.findByUsername(data.username);
                if (existingUsername && existingUsername.id !== id) {
                    throw new Error("Username sudah terpakai");
                }
            }
            updateData.username = data.username;
        }

        if (data.password) {
            updateData.password_hash = await Bun.password.hash(data.password, {
                algorithm: "bcrypt",
                cost: 10,
            });
        }

        return await this.userRepo.updateUser(id, updateData);
    }

    async deleteUser(id: string): Promise<boolean> {
        const existingUser = await this.userRepo.findById(id);
        if (!existingUser) {
            throw new Error("User tidak ditemukan");
        }

        return await this.userRepo.deleteUser(id);
    }
}