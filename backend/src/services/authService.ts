import { UserRepository } from "../repositories/userRepository";
import type { RegisterInput } from "../schema/authSchema";
import type { RegisterUserInput, User } from "../types/User";
import jwt from 'jsonwebtoken';

export class AuthService {
    private userRepo = new UserRepository();

    async registerUser(user: RegisterInput): Promise<User | undefined> {

        const existingEmail = await this.userRepo.findByEmail(user.email);
        if (existingEmail) {
            throw new Error("Email sudah terdaftar");
        }

        const existingUsername = await this.userRepo.findByUsername(user.username);
        if (existingUsername) {
            throw new Error("Username sudah terpakai");
        }

        const password_hash = await Bun.password.hash(user.password, {
            algorithm: "bcrypt",
            cost: 10,
        });

        const createdUser = await this.userRepo.createUser({
            name: user.name,
            email: user.email,
            username: user.username,
            password_hash: password_hash,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return createdUser;
    }

    async loginUser(email: string, password: string): Promise<string> {
        const user = await this.userRepo.findByEmailForLogin(email);
        if (!user || typeof user.password_hash !== "string") throw new Error("Email atau password salah!")

        const passwordValid = await Bun.password.verify(password, user.password_hash)
        if (!passwordValid) throw new Error("Email atau password salah!")

        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) throw new Error("JWT_SECRET environment variable is required")

        const token = jwt.sign(
            { id: user.id },
            jwtSecret,
            { expiresIn: "1h" }
        )

        return token
    }
}