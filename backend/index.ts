import express, { type Request, type Response, type NextFunction } from 'express';
import { testConnection } from './src/config/db';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Halo! Express ini berjalan di atas runtime Bun 🚀');
})

app.get('/test-connection', async (req: Request, res: Response) => {
    const ok = await testConnection();

    if (ok) {
        res.status(200).json({
            message: "Koneksi database berhasil",
        });
    } else {
        res.status(500).json({
            message: "Koneksi database gagal",
        });
    }
})

async function startServer() {
    const ok = await testConnection();

    if(ok) {
        app.listen(port, () => {
            console.log(`Server Express aktif di http://localhost:${port}`);
        })
    } else {
        console.error("Koneksi database gagal. Server tidak dapat dijalankan.");
        process.exit(1); 
    }
}

startServer().catch((err) => {
    console.error("Terjadi kesalahan saat memulai server:", err);
});