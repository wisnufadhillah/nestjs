# Internship Dotco API

Simple REST API menggunakan NestJS, TypeScript, PostgreSQL, TypeORM, dan JWT authentication.

## Fitur

- Register dan login user.
- JWT token untuk endpoint protected.
- CRUD `projects` milik user.
- CRUD `tasks` yang berelasi dengan `projects`.
- E2E test untuk memastikan endpoint protected membutuhkan token.

## Setup Project

Install dependency:

```bash
npm install
```

Buat database PostgreSQL di pgAdmin, contoh:

```sql
CREATE DATABASE internship_dotco;
```

Buat file `.env` di root project:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password_postgres_kamu
DB_DATABASE=internship_dotco
JWT_SECRET=rahasia-jwt-demo
```

Jalankan aplikasi:

```bash
npm run start:dev
```

Base URL:

```text
http://localhost:3000
```

## Testing

Unit test:

```bash
npm run test
```

E2E test:

```bash
npm run test:e2e
```

Build:

```bash
npm run build
```

## Dokumentasi API

Gunakan Postman, Thunder Client, atau REST client lain.

### Auth

Register:

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "Demo User",
  "email": "demo@gmail.com",
  "password": "password123"
}
```

Login:

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "demo@gmail.com",
  "password": "password123"
}
```

Response auth:

```json
{
  "accessToken": "jwt-token"
}
```

Untuk endpoint protected, tambahkan header:

```http
Authorization: Bearer jwt-token
```

### Projects

Create project:

```http
POST /projects
Authorization: Bearer jwt-token
Content-Type: application/json
```

```json
{
  "name": "Internship Project",
  "description": "Project demo"
}
```

List projects:

```http
GET /projects
Authorization: Bearer jwt-token
```

Detail project:

```http
GET /projects/:id
Authorization: Bearer jwt-token
```

Update project:

```http
PATCH /projects/:id
Authorization: Bearer jwt-token
Content-Type: application/json
```

```json
{
  "name": "Updated Project"
}
```

Delete project:

```http
DELETE /projects/:id
Authorization: Bearer jwt-token
```

### Tasks

Create task:

```http
POST /tasks
Authorization: Bearer jwt-token
Content-Type: application/json
```

```json
{
  "title": "Belajar NestJS",
  "description": "Membuat CRUD sederhana",
  "projectId": 1,
  "status": "todo"
}
```

Status task yang tersedia:

```text
todo, in_progress, done
```

List tasks:

```http
GET /tasks
Authorization: Bearer jwt-token
```

Detail task:

```http
GET /tasks/:id
Authorization: Bearer jwt-token
```

Update task:

```http
PATCH /tasks/:id
Authorization: Bearer jwt-token
Content-Type: application/json
```

```json
{
  "status": "done"
}
```

Delete task:

```http
DELETE /tasks/:id
Authorization: Bearer jwt-token
```

## Penjelasan Ketentuan Tes

### 1a. Minimal 2 Operasi CRUD yang Saling Berkaitan

Project ini memiliki dua CRUD utama:

- `projects`: user dapat membuat, melihat, mengubah, dan menghapus project.
- `tasks`: user dapat membuat, melihat, mengubah, dan menghapus task.

Relasinya adalah satu `Project` dapat memiliki banyak `Task`. Saat membuat task, request wajib mengirim `projectId`, sehingga task selalu terhubung ke project.

### 1b. Menyimpan Data Menggunakan Database SQL

Database yang digunakan adalah PostgreSQL. Integrasi database memakai TypeORM.

Entity yang dibuat:

- `User`
- `Project`
- `Task`

Konfigurasi database ada di `src/config/typeorm.config.ts` dan nilai koneksi dibaca dari file `.env`.

### 1c. Authentication API Menggunakan JWT Token

Authentication dibuat di `AuthModule`.

Endpoint auth:

- `POST /auth/register`
- `POST /auth/login`

Setelah register atau login berhasil, API mengembalikan `accessToken`. Token ini dipakai pada header:

```http
Authorization: Bearer accessToken
```

Endpoint `projects` dan `tasks` dilindungi oleh `JwtAuthGuard`, jadi tidak bisa diakses tanpa token.

### 1d. E2E Testing untuk Test Token API

E2E test ada di `test/app.e2e-spec.ts`.

Yang dites:

- `GET /projects` tanpa token harus menghasilkan `401 Unauthorized`.
- `POST /auth/register` harus menghasilkan JWT token.
- Token dari register bisa dipakai untuk membuat dan melihat project.

Jalankan test:

```bash
npm run test:e2e
```

Pastikan database dan `.env` sudah benar sebelum menjalankan e2e test.

### 1e. Pattern Project yang Digunakan

Pattern yang digunakan adalah modular architecture bawaan NestJS.

Struktur utama:

```text
src/auth
src/users
src/projects
src/tasks
src/config
```

Setiap fitur dipisah menjadi module, controller, service, DTO, dan entity.

### 1f. Alasan Menggunakan Pattern Tersebut

Modular architecture dipilih karena umum digunakan di project NestJS dan mudah dijelaskan untuk pemula.

Alasannya:

- Controller fokus menerima request dan mengembalikan response.
- Service fokus pada business logic.
- Entity fokus pada struktur tabel database.
- DTO fokus pada validasi request body.
- Module mengelompokkan fitur agar struktur project lebih rapi.

Dengan pola ini, fitur baru bisa ditambahkan tanpa mencampur semua logic di satu file.

### 1g. Dokumentasi API

Dokumentasi endpoint sudah ditulis di bagian **Dokumentasi API** pada README ini. Dokumentasi ini bisa langsung dipakai sebagai panduan membuat collection Postman.
