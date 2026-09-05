# 📸 fotogram

Aplikasi berbagi foto & video (mirip Instagram) yang dibangun dari nol sebagai proyek belajar **object storage**, **autentikasi berbasis cookie**, dan **arsitektur full-stack** modern. Fokus utama proyek ini adalah memahami cara kerja upload file besar secara efisien menggunakan **presigned URL**, bukan sekadar CRUD biasa.

---

## ✨ Fitur Utama

- **Autentikasi aman** — Register/login/logout dengan JWT disimpan di **httpOnly cookie** (bukan localStorage), sehingga token tidak bisa diakses JavaScript di sisi client dan lebih tahan terhadap serangan XSS.
- **Upload foto & video via Presigned URL** — File diunggah **langsung dari browser ke MinIO**, tanpa melewati server backend. Backend hanya bertugas membuatkan "izin upload sementara" dan mencatat metadata.
- **Manajemen profil** — Update profil, hapus akun, dengan pemisahan data publik vs privat (email tidak pernah bocor ke user lain).
- **Galeri pribadi & publik** — Lihat postingan sendiri, atau cari & lihat postingan user lain (dengan filter agar upload yang gagal/belum selesai tidak pernah terlihat orang lain).
- **Caption** pada setiap unggahan.
- **Search user** dengan debounce, tanpa membebani server di setiap ketikan.
- **Metadata dinamis** — Judul tab browser otomatis menyesuaikan galeri siapa yang sedang dilihat (server-side rendering dengan cookie forwarding).

---

## 🏗️ Tech Stack

### Backend
| Kategori | Teknologi |
|---|---|
| Runtime | [Bun](https://bun.sh) |
| Framework | Express.js + TypeScript |
| Database | PostgreSQL (raw SQL via `pg`, **tanpa ORM**) |
| Object Storage | MinIO (S3-compatible) |
| Autentikasi | JWT (custom, httpOnly cookie) |
| Validasi | Zod |
| Password Hashing | `Bun.password` (bcrypt) |

### Frontend
| Kategori | Teknologi |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Data Fetching & Caching | TanStack Query |
| Form Handling | React Hook Form + Zod resolver |
| Styling | Tailwind CSS |
| Notifikasi | react-hot-toast |

### Infrastruktur
| Kategori | Teknologi |
|---|---|
| Orkestrasi | Docker Compose |
| Services | PostgreSQL 15, MinIO |

---

## 🧠 Keputusan Arsitektur Penting

### 1. Kenapa Raw SQL, bukan ORM?
Dipilih secara sengaja untuk memahami **persis** apa yang terjadi di level query — mulai dari desain skema, index, constraint, sampai N+1 query awareness — tanpa abstraksi yang menyembunyikan detail tersebut.

### 2. Kenapa httpOnly Cookie, bukan localStorage/Bearer token?
Token yang disimpan di `localStorage` atau dikirim manual lewat header bisa dicuri lewat serangan XSS (JavaScript berbahaya bisa membacanya). Dengan httpOnly cookie, token **tidak bisa diakses sama sekali** oleh JavaScript — hanya browser yang otomatis mengirimkannya di setiap request ke domain yang sama.

### 3. Kenapa Presigned URL, bukan upload lewat backend?
Kalau file di-upload lewat backend (`multer` dsb), server harus menampung seluruh file di memory/stream sebelum meneruskannya ke storage — ini jadi bottleneck untuk file besar (terutama video). Dengan presigned URL, backend hanya menghasilkan "tiket" akses sementara ke MinIO, dan **file mengalir langsung dari browser ke storage**, membuat backend tetap ringan berapa pun ukuran/jumlah file yang diunggah.

### 4. Alur Upload (bagian paling kompleks di proyek ini)

```
┌──────────┐   1. Kirim metadata    ┌──────────┐   2. Generate      ┌───────┐
│  Client  │ ─────────────────────► │ Backend  │ ─────────────────► │ MinIO │
│(Browser) │                        │(Express) │   presigned URL    │       │
└────┬─────┘                        └────┬─────┘                    └───┬───┘
     │                                    │  Insert record status:      │
     │  ◄─────────────────────────────────┤  'pending' ke Postgres      │
     │      { uploadUrl, fileId }         │                              │
     │                                                                   │
     │  3. PUT file langsung ke uploadUrl (TIDAK lewat backend)          │
     ├──────────────────────────────────────────────────────────────────►
     │                                                                   │
     │  4. Konfirmasi status (completed/failed)                         │
     ├───────────────────────►┌──────────┐                              │
     │                        │ Backend  │  Update status di Postgres   │
     │  ◄─────────────────────┤(Express) │                              │
     └────────────────────────└──────────┘                              │
```

Setiap file disimpan di MinIO dengan struktur key `{userId}/{photos|videos}/{uuid}.{ext}` — menggunakan **user ID**, bukan username, sebagai prefix folder, karena username bisa berubah sedangkan ID bersifat permanen.

**Konsistensi data**: Karena Postgres (metadata) dan MinIO (file fisik) adalah dua sistem terpisah tanpa transaksi gabungan, urutan operasi penting — saat **delete**, file dihapus dari MinIO terlebih dahulu baru dari Postgres. Jika delete Postgres gagal setelah file MinIO terhapus, jejak datanya masih ada di database untuk diperbaiki manual. Jika urutan dibalik, file yang gagal terhapus dari MinIO akan menjadi "orphan" yang tidak pernah bisa dilacak lagi.

### 5. Kenapa Presigned GET URL, bukan file publik statis?
File di MinIO tidak pernah diset publik. Setiap kali galeri di-load, backend generate presigned **GET** URL (dengan masa berlaku terbatas) untuk tiap file — sehingga akses ke file tetap bisa dikontrol dan tidak bisa diakses sembarangan dengan menebak URL.

---

## 📂 Struktur Folder

```
fotogram/
├── docker-compose.yml       # Orkestrasi MinIO + PostgreSQL
├── backend/
│   ├── src/
│   │   ├── config/          # Koneksi DB, MinIO client
│   │   ├── controllers/     # HTTP layer (req/res)
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Raw SQL queries
│   │   ├── middleware/      # JWT auth middleware
│   │   ├── routes/
│   │   ├── schemas/         # Validasi Zod
│   │   └── types/
│   ├── migration/           # SQL migration files
│   └── index.ts
└── frontend/
    └── src/
        ├── app/              # Next.js App Router
        │   ├── (auth)/       # Route group: login, register
        │   └── (protected)/  # Route group: butuh login (galeri, dll)
        ├── components/
        ├── context/          # AuthContext (single source of truth auth state)
        ├── hooks/            # Custom hooks berbasis TanStack Query
        ├── lib/              # apiClient, upload orchestration, dsb
        ├── services/         # Fungsi pemanggil API per domain
        ├── schemas/          # Validasi Zod (frontend)
        └── types/
```

---

## 🗄️ Skema Database

**`users`**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | `gen_random_uuid()` |
| name | VARCHAR(100) | |
| email | VARCHAR(100) | UNIQUE |
| username | VARCHAR(100) | UNIQUE |
| password_hash | TEXT | |
| created_at / updated_at | TIMESTAMP | |

**`files`**

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK → users, `ON DELETE CASCADE`) | |
| path_file | TEXT | Object key di MinIO |
| name_file | TEXT | Nama file asli dari user |
| type | VARCHAR(200) | MIME type |
| size_byte | BIGINT | |
| status | VARCHAR(20) | `pending` \| `completed` \| `failed` |
| caption | VARCHAR(200) | Nullable |
| uploaded_at | TIMESTAMP | |

Index composite `(user_id, uploaded_at DESC)` untuk mempercepat query listing galeri per user.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/login` | Login, set httpOnly cookie |
| POST | `/api/auth/logout` | Hapus cookie |

### Users
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/users` | Search user (`?search=&limit=`) |
| GET | `/api/users/me` | Profil user yang sedang login |
| GET | `/api/users/:id` | Profil publik user (tanpa email) |
| GET | `/api/users/:id/files` | File publik milik user tertentu |
| PATCH | `/api/users/:id` | Update profil (hanya pemilik) |
| DELETE | `/api/users/:id` | Hapus akun (hanya pemilik) |

### Files
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/files/uploads` | Generate presigned upload URL |
| PATCH | `/api/files/:id/status` | Konfirmasi status upload |
| GET | `/api/files` | List file milik sendiri (pagination) |
| DELETE | `/api/files/:id` | Hapus file (MinIO + Postgres) |

---

## 🚀 Menjalankan Secara Lokal

### Prasyarat
- [Bun](https://bun.sh) terinstal
- [Docker](https://www.docker.com/) & Docker Compose

### 1. Clone & masuk ke folder project
```bash
git clone <repo-url>
cd fotogram
```

### 2. Jalankan infrastruktur (PostgreSQL + MinIO)
```bash
docker compose up -d
```

### 3. Setup Backend
```bash
cd backend
bun install
cp .env.example .env   # sesuaikan isinya, lihat tabel env di bawah
bun dev
```

Jalankan migration SQL di folder `migration/` ke database (lewat client Postgres pilihanmu).

### 4. Setup Frontend
```bash
cd frontend
bun install
cp .env.example .env.local
bun dev -- -p 3001
```

### 5. Buka aplikasi
Frontend: `http://localhost:3001`

---

## 🔐 Environment Variables

### Backend (`.env`)
```env
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5433/fotogram
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=fotogram
DB_PORT=5433

# MinIO
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=your_password
MINIO_PORT_API=9000
MINIO_PORT_CONSOLE=9001
ENDPOINT_MINIO=localhost
PORT_MINIO=9000
ACCESS_KEY_MINIO=admin
SECRET_KEY_MINIO=your_password
BUCKET_NAME=fotogram
EXPIRES_TIME=3600

# Auth
JWT_SECRET=your_secret_key

# CORS
FRONTEND_URL=http://localhost:3001
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> ⚠️ Pastikan port MinIO/Postgres di `.env` backend **konsisten** dengan yang di-mapping di `docker-compose.yml`, dan `FRONTEND_URL` sesuai port tempat Next.js dev server berjalan.

---

## 📚 Yang Dipelajari dari Proyek Ini

- **Object storage & presigned URL** — konsep bucket/object, flat namespace, perbedaan presigned GET vs PUT, dan kenapa direct upload lebih scalable dibanding proxy upload.
- **Keamanan autentikasi** — trade-off httpOnly cookie vs localStorage/Bearer token, kenapa payload JWT harus seminimal mungkin, dan pentingnya generic error message ("email atau password salah") untuk mencegah user enumeration.
- **Konsistensi data lintas sistem** — menangani dua sumber data (Postgres & MinIO) yang tidak punya transaksi gabungan, termasuk menentukan urutan operasi yang paling aman saat delete.
- **Type safety end-to-end** — memisahkan tipe untuk data *input* (divalidasi Zod) vs data *output/database* (`interface` TypeScript), agar tidak ada ambiguitas antara "password mentah" dan "password yang sudah di-hash".
- **React Hooks & data fetching** — closure pitfalls di custom hooks, race condition di `useEffect`, dan kapan sebuah query sebaiknya di-cache dengan TanStack Query vs cukup `useState` manual.
- **Server vs Client Component (Next.js App Router)** — kapan sebuah komponen butuh `"use client"`, dan tantangan meneruskan cookie dari request browser ke request server-to-server (`generateMetadata`).
- **Debugging sistematis** — menemukan bug nyata seperti CORS origin yang salah, kolom yang terlewat di query `SELECT`, truthy/falsy trap pada array kosong, dan mismatch urutan parameter SQL — dengan membaca gejala, bukan menebak.

---

## 🗺️ Roadmap / Kemungkinan Pengembangan

- [ ] Validasi Zod di seluruh endpoint (saat ini baru diterapkan di auth)
- [ ] Cursor-based pagination untuk galeri
- [ ] Background job untuk membersihkan file berstatus `pending` yang terbengkalai
- [ ] Privasi per-file (publik/privat), bukan cuma privasi per-status

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan belajar.
