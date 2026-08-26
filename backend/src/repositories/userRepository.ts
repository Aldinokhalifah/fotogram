import { db } from "../config/db";
import type { User } from "../types/User";

export class UserRepository {
    async createUser(user: User): Promise<User> {
        const query = `
            INSERT INTO users (name, email, username, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, username, created_at, updated_at
        `;

        const result = await db.query(query, [
            user.name,
            user.email,
            user.username,
            user.password_hash,
        ]);

        return result.rows[0] as User;
    }

    async findById(id: string): Promise<User | undefined> {
        const query = `
            SELECT id, name, email, username, created_at, updated_at
            FROM users
            WHERE id = $1
        `;

        const result = await db.query(query, [id]);
        return result.rows[0] as User | undefined;
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const query = 'SELECT id, name, email, username, created_at, updated_at FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0] as User | undefined;
    }

    async findByEmailForLogin(email: string): Promise<User | undefined> {
        const query = 'SELECT id, name, email, username, password_hash, created_at, updated_at FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0] as User | undefined;
    }

    async findByUsername(username: string): Promise<User | undefined> {
        const query = 'SELECT id, name, email, username, created_at, updated_at FROM users WHERE username = $1';
        const result = await db.query(query, [username]);
        return result.rows[0] as User | undefined;
    }

        async searchByUsername(keyword: string, limit: number): Promise<User[] | undefined> {
            const query = `
            SELECT id, name, username, created_at FROM users 
            WHERE username ILIKE $1 
            LIMIT $2`;
    
            const result = await db.query(query, [
                `%${keyword}%`, 
                limit
            ])
    
            return result.rows as User[];
        }

    async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
        const fields: string[] = [];
        const values: unknown[] = [];

        if (data.name !== undefined) {
            fields.push(`name = $${fields.length + 1}`);
            values.push(data.name);
        }

        if (data.email !== undefined) {
            fields.push(`email = $${fields.length + 1}`);
            values.push(data.email);
        }

        if (data.username !== undefined) {
            fields.push(`username = $${fields.length + 1}`);
            values.push(data.username);
        }

        if (data.password_hash !== undefined) {
            fields.push(`password_hash = $${fields.length + 1}`);
            values.push(data.password_hash);
        }

        fields.push(`updated_at = $${fields.length + 1}`);
        values.push(new Date());

        if (fields.length === 0) {
            return this.findById(id);
        }

        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${fields.length + 1}
            RETURNING id, name, email, username, created_at, updated_at
        `;

        values.push(id);

        const result = await db.query(query, values);
        return result.rows[0] as User | undefined;
    }

    async deleteUser(id: string): Promise<boolean> {
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await db.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}