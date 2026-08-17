import express, { type Request, type Response } from 'express';
import { testConnection } from './src/config/db';
import authRoute from './src/routes/authRoute';
import userRoute from './src/routes/userRoute';
import fileRoute from './src/routes/fileRoute';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();
const port = 3000;

const frontend_url = process.env.FRONTEND_URL;
if(!frontend_url) throw new Error('FRONTEND_URL environment variable is required!');

const allowedOrigin = process.env.FRONTEND_URL;

// Strongly typed CORS configurations
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (origin === allowedOrigin) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser())

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

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/files", fileRoute)

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