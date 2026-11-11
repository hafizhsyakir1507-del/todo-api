# Todo List API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Testing](https://img.shields.io/badge/Testing-Jest%20%26%20Supertest-C21325?logo=jest&logoColor=white)

REST API untuk mengelola daftar tugas (*Todo List*) menggunakan Node.js, Express.js, dan MongoDB. Project ini menyediakan autentikasi JWT, operasi CRUD Todo, pencatatan aktivitas, endpoint statistik, serta dokumentasi API interaktif melalui Swagger UI.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi yang Dipakai](#teknologi-yang-dipakai)
- [Struktur Project](#struktur-project)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Environment Variables](#environment-variables)
- [Menjalankan Project](#menjalankan-project)
- [Menjalankan Test](#menjalankan-test)
- [Dokumentasi API](#dokumentasi-api)
- [Referensi Endpoint](#referensi-endpoint)
- [Contoh Penggunaan](#contoh-penggunaan)
- [Lisensi](#lisensi)

## Fitur

- Registrasi dan login pengguna.
- Autentikasi menggunakan JSON Web Token (JWT).
- Password pengguna di-hash menggunakan bcryptjs.
- CRUD Todo: membuat, melihat, memperbarui, dan menghapus tugas.
- Setiap pengguna dapat mengakses Todo miliknya; role `admin` memiliki akses daftar Todo lintas pengguna.
- Pagination, filtering berdasarkan status selesai, sorting, dan pencarian Todo.
- Pencatatan aktivitas ketika Todo dibuat, diperbarui, atau dihapus.
- Endpoint riwayat aktivitas pengguna.
- Endpoint ringkasan statistik yang dilindungi API Key.
- Validasi input menggunakan express-validator.
- Global error handling dan middleware pencatatan request.
- Dokumentasi API interaktif menggunakan Swagger UI.
- Automated testing menggunakan Jest, Supertest, dan mongodb-memory-server.

## Teknologi yang Dipakai

| Kategori | Teknologi |
| --- | --- |
| Runtime | Node.js |
| Framework | Express.js 5 |
| Database | MongoDB |
| ODM | Mongoose |
| Autentikasi | JSON Web Token (jsonwebtoken) |
| Password hashing | bcryptjs |
| Validasi | express-validator |
| Dokumentasi API | swagger-jsdoc, swagger-ui-express |
| Testing | Jest, Supertest, mongodb-memory-server |
| Development | Nodemon |
| Environment configuration | dotenv |

## Struktur Project

```text
todo-api/
├── src/
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
│   ├── validators/
│   │   └── todo.validator.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── auth.test.js
│   ├── setup.js
│   ├── stats.test.js
│   └── todo.test.js
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
```

## Persyaratan

Sebelum menjalankan project, pastikan perangkat sudah memiliki:

- Node.js versi 18 atau lebih baru.
- npm (terpasang bersama Node.js).
- MongoDB lokal atau akun MongoDB Atlas.
- Git (opsional, jika project akan di-clone dari repository).

Project dapat dikembangkan di Windows, Linux, maupun macOS selama Node.js dan MongoDB tersedia.

## Instalasi

### 1. Masuk ke folder project

Jika project sudah tersedia di komputer:

```bash
cd todo-api
```

Atau clone repository (ganti URL berikut dengan URL repository milikmu):

```bash
git clone https://github.com/hafizhsyakir1507-del/todo-api
cd todo-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file environment

Buat file bernama `.env` di direktori utama project, sejajar dengan `package.json`. Isi file tersebut mengikuti contoh pada bagian [Environment Variables](#environment-variables).

> File `.env` tidak disertakan dalam repository. Jangan mengunggah file ini karena berisi konfigurasi dan secret aplikasi.

## Environment Variables

Aplikasi membaca konfigurasi dari file `.env` melalui package `dotenv`.

Contoh isi `.env` untuk pengembangan lokal:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todo_api_db
NODE_ENV=development
JWT_SECRET=ganti_dengan_secret_acak_yang_panjang
JWT_EXPIRES_IN=1d
EXTERNAL_API_KEY=ganti_dengan_api_key_acak
```

| Variable | Wajib | Contoh Nilai | Keterangan |
| --- | --- | --- | --- |
| `PORT` | Tidak | `3000` | Port server. Default aplikasi adalah `3000`. |
| `MONGODB_URI` | Ya | `mongodb://127.0.0.1:27017/todo_api_db` | Connection string MongoDB. |
| `NODE_ENV` | Tidak | `development` | Menandai environment aplikasi. Saat bernilai `development`, stack trace error disertakan pada response. |
| `JWT_SECRET` | Ya | Secret acak yang panjang | Secret untuk menandatangani dan memverifikasi JWT. |
| `JWT_EXPIRES_IN` | Disarankan | `1d` | Masa berlaku token JWT, menggunakan format waktu yang didukung `jsonwebtoken`. |
| `EXTERNAL_API_KEY` | Ya untuk endpoint statistik | API key acak | Kunci yang diperiksa pada header `x-api-key` untuk endpoint statistik. |

Gunakan nilai secret yang berbeda untuk setiap environment. Jangan menggunakan contoh secret di atas sebagai secret sungguhan dan jangan membagikan nilai `.env`.

### Memahami NODE_ENV

`NODE_ENV` digunakan untuk menandai lingkungan tempat aplikasi berjalan.

| Nilai | Kegunaan |
| --- | --- |
| `development` | Pengembangan lokal. Middleware error menyertakan stack trace pada response untuk membantu proses debugging. |
| `test` | Penanda environment testing. Konfigurasi test project menggunakan `mongodb-memory-server` agar test berjalan dengan database sementara. |
| `production` | Environment aplikasi yang sudah dijalankan untuk pengguna. Stack trace tidak disertakan dalam response. |

Pada kode project saat ini, `NODE_ENV` juga ditampilkan pada log saat server mulai berjalan. Script `npm test` menjalankan Jest dan setup test membuat MongoDB sementara; jika ingin menetapkan `NODE_ENV=test` secara eksplisit, atur environment tersebut pada terminal atau konfigurasi test.

Untuk deployment, isi environment variables melalui dashboard platform hosting atau pengelola environment server. Gunakan database dan secret khusus production, serta jangan mengunggah file `.env` ke repository.

## Menjalankan Project

Pastikan MongoDB sudah aktif dan konfigurasi `.env` sudah benar.

### Mode development

```bash
npm run dev
```

Nodemon akan menjalankan ulang server ketika ada perubahan file yang dipantau.

### Mode normal

```bash
npm start
```

Jika server berhasil dijalankan, alamat default API adalah:

```text
http://localhost:3000
```

Endpoint pemeriksaan sederhana:

```http
GET http://localhost:3000/
```

Response:

```json
{
  "message": "Todo API is running!"
}
```

Jika menggunakan nilai `PORT` selain `3000`, sesuaikan alamat dengan port tersebut.

## Menjalankan Test

Jalankan seluruh automated test dengan perintah:

```bash
npm test
```

Project menggunakan:

- **Jest** sebagai test runner.
- **Supertest** untuk menguji HTTP request dan response.
- **mongodb-memory-server** untuk menyediakan MongoDB sementara selama pengujian.

Dengan database sementara tersebut, pengujian tidak perlu menggunakan database development utama. Pastikan perangkat dapat mengunduh binary MongoDB yang dibutuhkan `mongodb-memory-server` saat pertama kali dijalankan.

## Dokumentasi API

Dokumentasi interaktif Swagger UI tersedia setelah server berhasil berjalan:

```text
http://localhost:3000/api-docs
```

Swagger UI menyediakan informasi endpoint dan skema request yang didokumentasikan pada route project. Untuk endpoint yang memerlukan autentikasi, gunakan tombol **Authorize** dan masukkan token JWT dengan format Bearer sesuai petunjuk Swagger.

## Referensi Endpoint

Base URL lokal:

```text
http://localhost:3000
```

### Authentication

| Method | Endpoint | Autentikasi | Keterangan |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Tidak | Registrasi pengguna baru. |
| `POST` | `/api/auth/login` | Tidak | Login dan memperoleh JWT. |

Contoh body registrasi:

```json
{
  "name": "Budi",
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

### Todos

Semua endpoint Todo memerlukan JWT melalui header `Authorization: Bearer <token>`.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `POST` | `/api/todos` | Membuat Todo baru. |
| `GET` | `/api/todos` | Mengambil daftar Todo dengan pagination. |
| `GET` | `/api/todos/:id` | Mengambil detail Todo berdasarkan ID. |
| `PUT` | `/api/todos/:id` | Memperbarui Todo. |
| `DELETE` | `/api/todos/:id` | Menghapus Todo. |

Parameter query yang tersedia pada daftar Todo:

| Parameter | Contoh | Keterangan |
| --- | --- | --- |
| `page` | `1` | Nomor halaman. |
| `limit` | `10` | Jumlah item per halaman (maksimal 100). |
| `completed` | `true` atau `false` | Filter status Todo. |
| `sortBy` | `createdAt` | Field pengurutan: `createdAt`, `title`, atau `completed`. |
| `order` | `desc` | Urutan: `asc` atau `desc`. |
| `search` | `belajar` | Kata pencarian pada judul atau deskripsi. |

Contoh:

```http
GET /api/todos?page=1&limit=10&completed=false&sortBy=createdAt&order=desc
Authorization: Bearer <token>
```

Contoh body untuk membuat Todo:

```json
{
  "title": "Belajar Node.js",
  "description": "Mempelajari REST API menggunakan Express"
}
```

### Activity Logs

| Method | Endpoint | Autentikasi | Keterangan |
| --- | --- | --- | --- |
| `GET` | `/api/activity-logs` | JWT | Mengambil riwayat aktivitas pengguna yang sedang login. |

Endpoint ini menerima parameter pagination `page` dan `limit`.

Contoh:

```http
GET /api/activity-logs?page=1&limit=10
Authorization: Bearer <token>
```

### Statistics

| Method | Endpoint | Autentikasi | Keterangan |
| --- | --- | --- | --- |
| `GET` | `/api/stats/summary` | API Key | Mengambil ringkasan statistik Todo dan aktivitas. |

Kirim API Key melalui header `x-api-key`:

```http
GET /api/stats/summary
x-api-key: <EXTERNAL_API_KEY>
```

Endpoint statistik mengembalikan jumlah total Todo, Todo yang selesai, Todo yang belum selesai, dan total activity logs.

> Catatan: daftar endpoint di atas dirangkum dari route project. Dokumentasi Swagger di `/api-docs` menjadi referensi untuk detail skema request dan response yang tersedia.

## Contoh Penggunaan

Alur penggunaan API secara umum:

1. Daftarkan pengguna melalui `POST /api/auth/register`.
2. Login melalui `POST /api/auth/login` untuk memperoleh JWT.
3. Sertakan JWT pada header `Authorization: Bearer <token>` saat mengakses endpoint Todo dan Activity Logs.
4. Gunakan endpoint Todo untuk membuat dan mengelola daftar tugas.
5. Gunakan `GET /api/stats/summary` dengan API Key untuk memperoleh ringkasan statistik.

## Lisensi

Project ini menggunakan lisensi **ISC**, sesuai dengan deklarasi `license` pada `package.json`.

---

Dibuat untuk keperluan pembelajaran dan pengembangan backend Node.js.
