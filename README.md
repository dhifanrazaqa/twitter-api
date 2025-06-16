# 🐦 Twitter API Microservices

> Backend Twitter Clone berbasis arsitektur **microservices** menggunakan Node.js, Express, dan Docker.

Setiap fitur utama Twitter seperti autentikasi, tweet, notifikasi, dan lainnya dibangun sebagai service terpisah untuk memudahkan pengelolaan, pengembangan, dan scaling.

---

## 📦 Daftar Service & Port

| Service         | Port | Keterangan                             |
|-----------------|------|----------------------------------------|
| API Gateway     | 5000 | Pintu utama semua request              |
| Auth            | 5002 | Autentikasi, termasuk Google OAuth     |
| Users           | 5001 | Manajemen user                         |
| Tweets          | 5003 | Tweet & timeline                       |
| Follows         | 5004 | Follow/unfollow                        |
| Notifications   | 5005 | Notifikasi berbasis event              |
| RabbitMQ        | 5672 | Message broker (komunikasi internal)  |
| Redis           | 6379 | Penyimpanan sementara token refresh    |

> 📌 **Catatan:**
> - Google OAuth callback harus diarahkan ke **port 5002 (Auth Service)**.
> - Semua request dari client sebaiknya melalui **API Gateway (port 5000)**.

---

## 🚀 Cara Menjalankan dengan Docker

### 1. Clone Repository
```bash
git clone https://github.com/dhifanrazaqa/twitter-api.git
cd twitter-api
```

### 2. Salin & Edit Environment Variable
Salin file `.env.example` di tiap service menjadi `.env` dan sesuaikan konfigurasi seperti database, Redis, dan Google OAuth.

### 3. Build Semua Service
```bash
docker compose build
```

### 4. Jalankan Semua Service
```bash
docker compose up
```
Atau dalam background mode:
```bash
docker compose up -d
```

### 5. Akses Service
- API Gateway: [http://localhost:5000](http://localhost:5000)
- Users: [http://localhost:5001](http://localhost:5001)
- Auth Service (OAuth): [http://localhost:5002](http://localhost:5002)
- Tweets: [http://localhost:5003](http://localhost:5003)
- Follows: [http://localhost:5004](http://localhost:5004)
- Notifications: [http://localhost:5005](http://localhost:5005)

👉 Dokumentasi Swagger tersedia di endpoint `/api-docs` pada masing-masing service.

---

## 🛠️ Arsitektur

- **API Gateway**  
  Meneruskan request ke service terkait, bisa menambahkan fitur seperti rate limiting, logging, dsb.

- **Auth Service**  
  Login, register, refresh token, Google OAuth, verifikasi JWT.

- **Users Service**  
  CRUD user, pengelolaan profil.

- **Tweets Service**  
  CRUD tweet, timeline, balasan tweet.

- **Follows Service**  
  Follow/unfollow, daftar followers dan following.

- **Notifications Service**  
  Mengirim notifikasi berbasis event melalui RabbitMQ.

- **RabbitMQ**  
  Komunikasi event-driven antar service.

- **Redis**  
  Penyimpanan sementara untuk refresh token.

---

## 🔑 Google OAuth

Pastikan variabel berikut disetel di file `.env` pada **Auth Service**:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5002/auth/google/callback
```

---

## 🧪 Pengembangan & Testing

- Jalankan service secara individual:
```bash
cd services/auth  # atau users, tweets, dll
npm install
npm run dev
```

- Gunakan database lokal dan atur environment sesuai kebutuhan.

---

## 📄 Lisensi

Proyek ini menggunakan lisensi **MIT License**.

---

## ⚠️ Catatan Tambahan

- Pastikan tidak ada port konflik di komputer Anda.
- Untuk **produksi**, disarankan menggunakan reverse proxy (seperti Nginx) dan memastikan semua environment variable telah dikonfigurasi dengan aman.
