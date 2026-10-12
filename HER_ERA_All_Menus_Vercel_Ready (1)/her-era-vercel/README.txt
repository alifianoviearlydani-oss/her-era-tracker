HER ERA. — COMPLETE TRACKER / VERCEL-READY
==========================================

SEMUA MENU DALAM SATU WEBSITE
- Overview dashboard
- Music & mood harian
- Kalender dan tanggal penting
- Health challenge 30 hari
- Ibadah tracker
- English Lab: 5 vocabulary harian, grammar challenge, 3 latihan TOEFL harian
- Reading log: sampul, target, durasi baca, review, rating
- Daily journal: catatan dan sampai 3 foto per entri
- Academic Era: nilai tugas/kuis, UTS/UAS, SKS, bobot nilai, estimasi IP semester dan IPK
- Export/import backup JSON
- Responsive laptop dan HP
- Offline cache setelah pertama kali dibuka

CARA DEPLOY KE VERCEL (GRATIS UNTUK WEBSITE STATIS)
1. Ekstrak ZIP ini.
2. Buat repository baru di GitHub, misalnya her-era-tracker.
3. Upload SEMUA ISI folder ini ke root repository (index.html harus langsung terlihat di root, jangan di dalam folder bertingkat lain).
4. Buka https://vercel.com lalu masuk dengan akun GitHub.
5. Pilih Add New → Project, lalu Import repository her-era-tracker.
6. Framework Preset: Other.
7. Build Command: kosongkan / None.
8. Output Directory: . (titik) atau kosong sesuai pilihan dashboard Vercel.
9. Klik Deploy. Setelah selesai, Vercel memberi URL website.
10. Buka URL itu dari HP/laptop. Untuk menginstal seperti aplikasi, pilih Add to Home Screen / Install App jika tersedia.

CATATAN DATA DAN SINKRONISASI
- Vercel membuat website bisa diakses online; Vercel TIDAK otomatis menyinkronkan data antarperangkat.
- Saat ini data tracker disimpan di localStorage browser/perangkat masing-masing. Data laptop dan HP terpisah.
- Sebelum pindah versi atau membersihkan browser, gunakan Export backup.
- Kalau ingin data yang sama muncul di laptop dan HP, perlu menambahkan backend seperti Supabase dan login pengguna. Jangan memasukkan secret key ke app.js atau file frontend.
- Jangan kirim URL publik jika tidak ingin orang lain melihat tampilan website; data lokal tidak ikut terbuka hanya karena situsnya publik, tetapi siapa pun bisa membuka situs dan membuat data lokal mereka sendiri.

OFFLINE
- Service worker memakai cache versi v3 untuk memperbarui cache aplikasi.
- Buka website sekali saat online agar cache awal terpasang, lalu coba offline.
- Perubahan file yang baru di-deploy mungkin perlu satu reload setelah browser mengambil service worker baru.

ACADEMIC TRACKER
- Bobot default: tugas 15%, kuis 15%, UTS 30%, UAS 40%; ubah sesuai RPS dan total harus 100%.
- IP/IPK berupa estimasi. Sesuaikan konversi nilai ke bobot mutu dengan pedoman resmi kampus.
- Soal TOEFL adalah latihan buatan, bukan soal resmi TOEFL.
