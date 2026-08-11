import { Pool, type QueryResult } from "pg";
// import "dotenv/config";

console.log("DATABASE_URL:", process.env.DATABASE_URL);
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,        // tutup koneksi idle setelah 30s
    connectionTimeoutMillis: 5000,   // jangan nunggu koneksi kosong tanpa batas
    keepAlive: true, 
});

pool.on("error", (err: Error) => {
    console.error('Unexpected DB error', err)
})

export async function testConnection(): Promise<boolean> {
    try {
        const res = await pool.query("SELECT 1 AS ok");
        return res.rows[0]?.ok === 1;
    } catch (err: any) {
        console.error("PostgreSQL connection test failed:", err.message);
        return false;
    }
}

export const db = {
    query: (text: string, params?: any[]): Promise<QueryResult> => pool.query(text, params),
    pool,
    testConnection
};