import { db } from "../config/db";
import {type User } from "../types/User";

export class UserRepository {

    async createUser(user: User): Promise<User> {
        const query = 
            `INSERT INTO users (name, email, username, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, created_at`
        const result = await db.query(query, [user.name, user.email, user.username, user.password_hash])
        return result.rows[0]
    }

    async findByEmail(email: string): Promise<User| undefined> {
        const query = 'SELECT id, name, email, username, created_at FROM users WHERE email = $1'
        const result = await db.query(query, [email]);
        return result.rows[0]
    }

    async findByEmailForLogin(email: string): Promise<User| undefined> {
        const query = 'SELECT id, name, email, username, password_hash, created_at FROM users WHERE email = $1'
        const result = await db.query(query, [email]);
        return result.rows[0]
    }

    async findByUsername(userNama: string): Promise<User | undefined> {
        const query = 'SELECT id, name, email, username, created_at FROM users WHERE username = $1'
        const result = await db.query(query, [userNama]);
        return result.rows[0]
    }
}