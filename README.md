# 🚀 VEIYL AUTH — Sistem Login & Register PHP Native (JSON Storage)

Sistem autentikasi pengguna sederhana berbasis **PHP Native** menggunakan penyimpanan data **JSON** dan antarmuka bertema **Cyberpunk Dark Gaming HUD**. Proyek ini dibuat untuk memenuhi kriteria **Tugas Rutin 7 - Pemrograman Web** (FMIPA Universitas Negeri Medan).

---

## 📌 Fitur Utama

- **Registrasi Akun**: Pendaftaran user baru dengan sanitasi dan validasi input lengkap.
- **Validasi Email & Duplikasi**: Menolak format email yang tidak sesuai serta mencegah pendaftaran email ganda.
- **Keamanan Password**: Menggunakan enkripsi `password_hash()` (PASSWORD_DEFAULT) sebelum disimpan ke JSON.
- **Sistem Login & Session**: Autentikasi user menggunakan `password_verify()` dan manajemen state berbasis `$_SESSION`.
- **Proteksi Halaman**: Dashboard terproteksi yang melakukan *redirect* otomatis ke halaman login jika session belum ada.
- **Logout & Destroy Session**: Penghapusan session dan cookie saat user keluar.
- **Cyberpunk Gaming HUD UI**: Antarmuka futuristik dengan animasi transisi yang responsif, indikator kekuatan password, serta *alert feedback*.

---

## 🛠️ Teknologi & Tools

- **Language**: PHP (Native) & JavaScript (ES6)
- **Storage**: JSON File (`users.json`)
- **Frontend**: HTML5 & CSS3 (Custom Cyberpunk HUD Theme)
- **Icons**: Lucide SVG Icons
- **Server Environment**: Laragon / XAMPP (Apache)

---

## 📂 Struktur Project

```text
TugasWeb-Pertemuan7-LoginRegister/
├── index.html        # Antarmuka Utama (Login & Register Form UI)
├── style.css         # Styling Cyberpunk Dark Gaming HUD
├── script.js         # Handler Frontend, Animasi & AJAX Request
├── api.php           # Backend Endpoint (Validasi, Hashing, & JSON Handling)
├── dashboard.php     # Halaman Terproteksi Session (User Profile Dashboard)
├── logout.php        # Script Logout & Destruksi Session
├── users.json        # File Penyimpanan Data User
└── README.md         # Dokumentasi Project
