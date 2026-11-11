# Todo List API

REST API untuk mengelola daftar tugas (todo) yang dibangun menggunakan **Node.js**, **Express.js**, dan **MongoDB**. API ini menyediakan autentikasi JWT, pengelolaan todo, pencatatan aktivitas pengguna (activity logs), endpoint statistik yang dilindungi API Key, serta dokumentasi interaktif menggunakan Swagger UI.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Struktur Folder](#struktur-folder)
- [Instalasi](#instalasi)
- [Environment Variables](#environment-variables)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Dokumentasi API](#dokumentasi-api)
- [Ringkasan Endpoint](#ringkasan-endpoint)
- [Parameter Todo](#parameter-todo)
- [Contoh Penggunaan](#contoh-penggunaan)
- [Format Response dan Kode Status](#format-response-dan-kode-status)
- [Keamanan](#keamanan)
- [Pengujian](#pengujian)
- [Pembuat](#pembuat)
- [Lisensi](#lisensi)

## Fitur

- **Autentikasi pengguna:** registrasi dan login menggunakan JSON Web Token (JWT).
- **Manajemen todo:** membuat, melihat, mengubah, dan menghapus todo.
- **Kepemilikan data:** pengguna dapat mengelola todo miliknya sendiri.
- **Role pengguna:** mendukung role `user` dan `admin`.
- **Pagination:** membagi daftar todo ke dalam beberapa halaman.
- **Filtering:** memfilter todo berdasarkan status selesai atau belum selesai.
- **Sorting:** mengurutkan todo berdasarkan waktu dibuat, judul, atau status.
- **Pencarian:** mencari todo berdasarkan judul dan deskripsi.
- **Activity logs:** mencatat aktivitas pembuatan, perubahan, dan penghapusan todo.
- **Statistik:** menyediakan ringkasan jumlah todo, todo selesai, todo belum selesai, dan total activity logs.
- **API Key:** melindungi endpoint statistik menggunakan header `x-api-key`.
- **Validasi input:** memvalidasi data request menggunakan Express Validator.
- **Dokumentasi API:** menyediakan dokumentasi interaktif melalui Swagger UI.
- **Automated testing:** pengujian otomatis menggunakan Jest dan Supertest.

## Teknologi

| Kebutuhan | Teknologi |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB |
| ODM | Mongoose |
| Autentikasi | JSON Web Token (`jsonwebtoken`) |
| Password hashing | bcryptjs |
| Validasi | express-validator |
| Dokumentasi API | swagger-jsdoc, swagger-ui-express |
| Pengujian | Jest, Supertest, mongodb-memory-server |
| Environment configuration | dotenv |
| Development | nodemon |

## Struktur Folder

```text
todo-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── activity-log.controller.js
│   │   ├── auth.controller.js
│   │   ├── stats.controller.js
│   │   └── todo.controller.js
│   ├── middlewares/
│   │   ├── apiKey.middleware.js
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── logger.middleware.js
│   │   ├── notFound.middleware.js
│   │   ├── restrictTo.middleware.js
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── activity-log.model.js
│   │   ├── todo.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── activity-log.routes.js
│   │   ├── auth.routes.js
│   │   ├── stats.routes.js
│   │   └── todo.routes.js
│   ├── services/
│   │   ├── activity-log.service.js
│   │   ├── auth.service.js
│   │   └── todo.service.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── catchAsync.js
│   └── validators/
│       └── todo.validator.js
├── tests/
│   ├── auth.test.js
│   ├── setup.js
│   ├── stats.test.js
│   └── todo.test.js
├── .gitignore
├── jest.config.js
├── package.json
├── package-lock.json
└── README.md
```

## Instalasi

### Prasyarat

Pastikan perangkat sudah memiliki:

- [Node.js](https://nodejs.org/) versi 20 atau lebih baru.
- [MongoDB](https://www.mongodb.com/) atau akun MongoDB Atlas.
- Git (opsional, jika mengambil project melalui repository).

### Langkah instalasi

1. Clone repository atau unduh project, kemudian masuk ke folder project.

   ```bash
   git clone https://github.com/hafizhsyakir1507-del/todo-api.git
   cd todo-api
   ```

   Jika project sudah diunduh dalam bentuk ZIP, ekstrak ZIP lalu buka folder `todo-api` melalui terminal.

2. Install seluruh dependency.

   ```bash
   npm install
   ```

3. Buat file `.env` di folder utama project dan isi variabel sesuai bagian [Environment Variables](#environment-variables).

## Environment Variables

Aplikasi membutuhkan file `.env` di direktori utama project. Buat file tersebut secara manual dan jangan mengunggahnya ke repository publik karena berisi konfigurasi dan secret aplikasi.

Contoh isi `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_api
JWT_SECRET=isi_dengan_secret_acak_yang_aman
JWT_EXPIRES_IN=1d
EXTERNAL_API_KEY=isi_dengan_api_key_acak
NODE_ENV=development
```

| Variabel | Wajib | Keterangan |
|---|---|---|
| `PORT` | Tidak | Port server. Default aplikasi adalah `3000`. |
| `MONGODB_URI` | Ya | URI koneksi MongoDB. |
| `JWT_SECRET` | Ya | Secret untuk menandatangani dan memverifikasi JWT. |
| `JWT_EXPIRES_IN` | Disarankan | Masa berlaku token JWT, misalnya `1d` atau `7d`. |
| `EXTERNAL_API_KEY` | Ya untuk endpoint statistik | API Key yang dikirim melalui header `x-api-key`. |
| `NODE_ENV` | Tidak | Penanda environment aplikasi, misalnya `development` atau `production`. |

**Catatan:**
- Ganti nilai contoh `JWT_SECRET` dan `EXTERNAL_API_KEY` dengan nilai acak milik masing-masing pengguna.
- Jangan menggunakan nilai contoh di atas sebagai secret produksi.
- Jika menggunakan MongoDB Atlas, gunakan connection string dari cluster milik sendiri.
- Jangan membagikan file `.env` atau memasukkannya ke Git.

## Menjalankan Aplikasi

Jalankan perintah berikut dari folder utama project.

### Mode development

```bash
npm run dev
```

Perintah ini menjalankan server menggunakan Nodemon sehingga server dapat dimulai ulang ketika ada perubahan file.

### Mode production

```bash
npm start
```

Jika koneksi database berhasil, server akan berjalan pada:

```text
http://localhost:3000
```

Port dapat berbeda jika variabel `PORT` di file `.env` diubah.

## Dokumentasi API

Dokumentasi interaktif tersedia melalui Swagger UI. Pastikan server sudah berjalan, lalu buka:

```text
http://localhost:3000/api-docs
```

Swagger UI dapat digunakan untuk melihat dokumentasi endpoint dan mencoba request API secara langsung.

Untuk endpoint yang membutuhkan autentikasi:
1. Lakukan registrasi melalui `POST /api/auth/register` atau login melalui `POST /api/auth/login`.
2. Salin JWT token dari response.
3. Masukkan token melalui fitur **Authorize** di Swagger UI dengan format Bearer Token.
4. Jalankan endpoint yang membutuhkan autentikasi.

Untuk endpoint statistik, masukkan API Key pada header `x-api-key`.

## Ringkasan Endpoint

Base URL lokal:

```text
http://localhost:3000
```

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| `GET` | `/` | Publik | Memeriksa status server |
| `POST` | `/api/auth/register` | Publik | Registrasi pengguna baru |
| `POST` | `/api/auth/login` | Publik | Login dan mendapatkan JWT |
| `GET` | `/api/todos` | JWT | Mengambil daftar todo |
| `POST` | `/api/todos` | JWT | Membuat todo baru |
| `GET` | `/api/todos/:id` | JWT | Mengambil detail todo berdasarkan ID |
| `PUT` | `/api/todos/:id` | JWT | Memperbarui todo berdasarkan ID |
| `DELETE` | `/api/todos/:id` | JWT | Menghapus todo berdasarkan ID |
| `GET` | `/api/activity-logs` | JWT | Mengambil riwayat aktivitas pengguna |
| `GET` | `/api/stats/summary` | API Key | Mengambil ringkasan statistik todo |

**Keterangan akses:**
- `Publik`: endpoint dapat diakses tanpa token.
- `JWT`: endpoint membutuhkan token pada header `Authorization`.
- `API Key`: endpoint membutuhkan API Key pada header `x-api-key`.

Token JWT dikirim dengan format:

```http
Authorization: Bearer <token>
```

## Parameter Todo

Endpoint `GET /api/todos` mendukung parameter query berikut.

| Parameter | Keterangan | Contoh |
|---|---|---|
| `page` | Nomor halaman, minimal `1` (default `1`) | `page=2` |
| `limit` | Jumlah data per halaman, antara `1` sampai `100` (default `10`) | `limit=5` |
| `completed` | Filter status todo (`true` atau `false`) | `completed=false` |
| `sortBy` | Field pengurutan: `createdAt`, `title`, atau `completed` | `sortBy=title` |
| `order` | Urutan pengurutan: `asc` atau `desc` | `order=asc` |
| `search` | Pencarian pada judul dan deskripsi | `search=belajar` |

Contoh penggunaan parameter secara bersamaan:

```http
GET /api/todos?completed=false&sortBy=createdAt&order=desc&page=1&limit=10
```

Endpoint `GET /api/activity-logs` juga mendukung pagination:

| Parameter | Keterangan | Default |
|---|---|---|
| `page` | Nomor halaman | `1` |
| `limit` | Jumlah data per halaman | `10` |

## Contoh Penggunaan

### 1. Registrasi pengguna

**Request**

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Budi",
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

### 2. Login

**Request**

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

Response login berisi JWT token yang digunakan untuk mengakses endpoint yang membutuhkan autentikasi.

### 3. Membuat todo

**Request**

```http
POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "title": "Belajar Node.js",
  "description": "Mempelajari pembuatan REST API"
}
```

### 4. Mengambil daftar todo

**Request**

```http
GET /api/todos?page=1&limit=10&completed=false
Authorization: Bearer <token>
```

### 5. Memperbarui todo

**Request**

```http
PUT /api/todos/<TODO_ID>
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "title": "Belajar Express.js",
  "description": "Mempelajari middleware dan routing",
  "completed": true
}
```

### 6. Menghapus todo

**Request**

```http
DELETE /api/todos/<TODO_ID>
Authorization: Bearer <token>
```

### 7. Mengambil activity logs

**Request**

```http
GET /api/activity-logs?page=1&limit=10
Authorization: Bearer <token>
```

Endpoint ini menampilkan riwayat aktivitas milik pengguna yang sedang login.

### 8. Mengambil statistik

**Request**

```http
GET /api/stats/summary
x-api-key: <EXTERNAL_API_KEY>
```

Response berisi ringkasan jumlah todo, todo yang selesai, todo yang belum selesai, dan total activity logs.

## Format Response dan Kode Status

Response sukses menggunakan properti `success: true`. Contoh bentuk response:

```json
{
  "success": true,
  "message": "Todo created successfully",
  "data": {
    "title": "Belajar Node.js",
    "description": "Mempelajari pembuatan REST API",
    "completed": false
  }
}
```

Response error menggunakan properti `success: false` dan pesan error.

| Kode Status | Arti | Keterangan |
|---|---|---|
| `200` | OK | Request berhasil diproses. |
| `201` | Created | Data berhasil dibuat. |
| `400` | Bad Request | Data request tidak valid. |
| `401` | Unauthorized | Token atau API Key tidak ada/tidak valid. |
| `403` | Forbidden | Pengguna tidak memiliki izin untuk mengakses data. |
| `404` | Not Found | Endpoint atau data tidak ditemukan. |
| `409` | Conflict | Terjadi konflik data, misalnya email sudah digunakan. |
| `500` | Internal Server Error | Terjadi kesalahan pada server. |

## Keamanan

- Password pengguna di-hash menggunakan bcryptjs sebelum disimpan ke database.
- Autentikasi menggunakan JWT.
- Endpoint todo dan activity logs dilindungi middleware autentikasi.
- Pengguna hanya dapat mengakses todo miliknya sendiri, sedangkan role admin memiliki akses pengelolaan yang lebih luas sesuai implementasi aplikasi.
- Endpoint statistik dilindungi API Key melalui header `x-api-key`.
- Validasi input dilakukan sebelum data diproses.
- Secret aplikasi disimpan melalui environment variables dan tidak ditulis langsung ke source code.

## Pengujian

Project ini menggunakan **Jest**, **Supertest**, dan **mongodb-memory-server** untuk menjalankan pengujian otomatis.

Jalankan seluruh test dengan perintah:

```bash
npm test
```

Pengujian menggunakan MongoDB in-memory sehingga test tidak perlu menggunakan database MongoDB utama yang dipakai aplikasi.

File pengujian tersedia di folder `tests/`:

| File | Cakupan |
|---|---|
| `auth.test.js` | Pengujian registrasi dan login |
| `todo.test.js` | Pengujian operasi dan fitur todo |
| `stats.test.js` | Pengujian endpoint statistik dan API Key |
| `setup.js` | Setup dan pembersihan database pengujian |

## Pembuat

Dikembangkan oleh **[Nama Kamu]**.

GitHub: [hafizhsyakir1507-del](https://github.com/hafizhsyakir1507-del/todo-api)

## Lisensi

Project ini menggunakan lisensi **ISC**, sesuai informasi pada `package.json`.
