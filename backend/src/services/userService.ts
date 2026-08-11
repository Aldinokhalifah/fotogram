import { UserRepository } from "../repositories/userRepository";
import { type User } from "../types/User";

export class UserService {
    private userRepo = new UserRepository();

    async registerUser(user: User): Promise<User | undefined> {
        if(!user.name) {
            throw new Error('Nama user wajib diisi');
        } else if(!user.email) {
            throw new Error('Email user wajib diisi');
        } else if(!user.password) {
            throw new Error('Password user wajib diisi');
        }

        const existingEmail = await this.userRepo.findByEmail(user.email);
        if (existingEmail && existingEmail.length > 0) {
            throw new Error("Email sudah terdaftar");
        }

        const existingUsername = await this.userRepo.findByUsername(user.username);
        if (existingUsername && existingUsername.length > 0) {
            throw new Error("Username sudah terpakai");
        }

        const password_hash = await Bun.password.hash(user.password, {
                algorithm: "bcrypt",
                cost: 10,
            })

        const createdUser = await this.userRepo.createUser({
            name: user.name,
            email: user.email,
            username: user.username,
            password: password_hash,
            created_at: new Date(),
            updated_at: new Date()
        })
        
        return createdUser;
    }

    async findByUsername(username: string): Promise<User[] | undefined> {
        return await this.userRepo.findByUsername(username);
    }
}