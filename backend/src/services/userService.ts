import { UserRepository } from "../repositories/userRepository";
import type { User } from "../types/User";

export class UserService {
    private userRepo = new UserRepository();

    async getUserById(id: string): Promise<User | undefined> {
        return await this.userRepo.findById(id);
    }

    async findByUsername(username: string): Promise<User | undefined> {
        return await this.userRepo.findByUsername(username);
    }

    async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
        const existingUser = await this.userRepo.findById(id);
        if (!existingUser) {
            throw new Error("User tidak ditemukan");
        }

        if (data.email && data.email !== existingUser.email) {
            const existingEmail = await this.userRepo.findByEmail(data.email);
            if (existingEmail && existingEmail.id !== id) {
                throw new Error("Email sudah terdaftar");
            }
        }

        if (data.username && data.username !== existingUser.username) {
            const existingUsername = await this.userRepo.findByUsername(data.username);
            if (existingUsername && existingUsername.id !== id) {
                throw new Error("Username sudah terpakai");
            }
        }

        if (data.password_hash) {
            const passwordHash = await Bun.password.hash(data.password_hash, {
                algorithm: "bcrypt",
                cost: 10,
            });

            data.password_hash = passwordHash;
        }

        return await this.userRepo.updateUser(id, data);
    }

    async deleteUser(id: string): Promise<boolean> {
        const existingUser = await this.userRepo.findById(id);
        if (!existingUser) {
            throw new Error("User tidak ditemukan");
        }

        return await this.userRepo.deleteUser(id);
    }
}