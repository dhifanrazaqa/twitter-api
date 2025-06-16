# Tahap 1: Gunakan base image Node.js versi LTS yang ringan (Alpine)
# Alpine Linux jauh lebih kecil ukurannya daripada distro Linux lain.
FROM node:18-alpine AS base

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin HANYA file package.json dan package-lock.json (atau yarn.lock)
# Ini adalah trik untuk caching layer Docker. Jika file-file ini tidak berubah,
# Docker tidak akan menjalankan ulang `npm install` pada build berikutnya.
COPY package*.json ./

# Install dependensi aplikasi
# Menggunakan 'npm ci' lebih direkomendasikan untuk build yang konsisten karena menginstall dari package-lock.json
RUN npm ci

# Salin sisa file aplikasi ke dalam direktori kerja
# Ini dilakukan setelah npm install agar perubahan kode tidak membatalkan cache layer dependensi.
COPY . .

# Expose port yang akan digunakan oleh aplikasi di dalam container
# Ganti <PORT_SERVICE> dengan port spesifik untuk setiap layanan
EXPOSE 5005

# Perintah default untuk menjalankan aplikasi saat container dimulai
# Menggunakan script "start" dari package.json
CMD [ "npm", "start" ]