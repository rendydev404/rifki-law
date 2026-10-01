# Portal & Landing Page Organisasi Hukum

Landing page modern, clean, dan mobile-first untuk Organisasi / Lembaga Bantuan Hukum (LBH) dengan panel CMS admin terintegrasi ke Supabase Cloud.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Bahasa**: TypeScript 7
- **Styling**: Tailwind CSS v4 dengan Palet Warna **Merah Ati (Crimson/Burgundy Maroon)** & Aksen Emas Kehormatan Hukum
- **Database & Storage**: Supabase (PostgreSQL + Supabase Auth + Supabase Storage `media` bucket)
- **Icon**: Lucide React + Custom SVG Brand Icons
- **Desain**: Mobile-First, Touch-Friendly (Thumb-zone targets $\ge$ 44–48px), Super Ringan, dan SEO Optimized

---

## 📋 Fitur & Konsep Konten (Dapat Dikelola Penuh oleh Admin)

### 1. Beranda
- **Logo & Nama Organisasi**: Dapat diganti via upload foto langsung atau URL.
- **Slogan Organisasi**: Tampil dalam callout box merah marun berwibawa dengan tipografi elegan.
- **Ucapan Selamat Datang**: Sambutan resmi (Headline & Subtitle) untuk pengunjung web.
- **Foto Kegiatan Terbaru**: Cuplikan visual aksi lapangan & pendampingan terbaru.
- **Statistik Dampak**: Jumlah perkara pro bono, jumlah advokat/paralegal, dan tahun pengabdian.

### 2. Tentang Kami
- **Sejarah Organisasi**: Narasi rekam jejak perjuangan hukum lembaga.
- **Visi Organisasi**: Cita-cita keadilan jangka panjang.
- **Misi Organisasi**: Butir-butir aksi nyata yang bisa ditambah, diubah, atau dihapus secara dinamis oleh admin.
- **Struktur Kepengurusan**: Direktori pengurus (Dewan Pembina, Direktur/Ketua Umum, Sekjen, Bendahara, Kepala Divisi Litigasi, Riset, dll.) lengkap dengan foto, nama, gelar, jabatan, divisi, dan kontak email.

### 3. Kegiatan & Agenda
- **Daftar Kegiatan**: Riwayat advokasi dan pendampingan lapangan yang telah terlaksana (dengan filter kategori: Advokasi, Sosialisasi, Konsultasi, Pelatihan).
- **Dokumentasi Foto**: Galeri foto persidangan dan mediasi warga dilengkapi **lightbox modal** interaktif.
- **Agenda Mendatang**: Jadwal seminar, posko hukum keliling, dan pelatihan paralegal lengkap dengan tanggal, waktu, lokasi, dan tombol pendaftaran via link/WhatsApp.

### 4. Kontak & Sekretariat
- **WhatsApp Hotline**: Tombol langsung membuka percakapan WhatsApp dengan pesan otomatis.
- **Instagram Resmi**: Tautan profil media sosial organisasi.
- **Email Resmi**: Saluran korespondensi resmi organisasi.
- **Alamat Sekretariat**: Lokasi kantor fisik lengkap dengan jam operasional dan tautan Google Maps.
- **Formulir Konsultasi Online**: Masyarakat dapat mengirim permohonan bantuan hukum yang langsung masuk ke panel admin.

---

## 🔐 Portal Admin CMS (`/admin`)

Untuk mengelola seluruh konten di atas, kunjungi rute:
👉 **`http://localhost:3000/admin`**

### Kredensial Default:
- **Email**: `admin@organisasihukum.id`
- **Password**: `AdminHukum2026!`

### Fitur Panel Admin:
1. **🏛️ Beranda & Slogan**: Ubah Nama Organisasi, Slogan, Logo, Banner Hero, dan Ucapan Selamat Datang.
2. **📜 Sejarah & Visi Misi**: Edit narasi sejarah, visi, dan butir misi secara dinamis.
3. **👥 Struktur Pengurus**: Tambah, edit, dan hapus pengurus serta upload foto pengurus.
4. **📅 Kegiatan & Agenda**: Kelola kegiatan terlaksana dan agenda mendatang.
5. **📸 Galeri Foto**: Tambah dokumentasi foto dengan caption dan tanggal.
6. **📞 Kontak & Alamat**: Perbarui nomor WhatsApp, email, Instagram, alamat, dan Google Maps.
7. **📩 Pesan Masuk**: Lihat aduan masyarakat dari formulir konsultasi, ubah status (Baru, Diproses, Selesai), dan hubungi pemohon via WhatsApp langsung dengan satu klik.
8. **⚡ Supabase Database & SQL**: Indikator koneksi cloud dan tombol salin skema SQL 1x klik.

---

## 🗄️ Menjalankan Skema SQL di Supabase (Opsional tapi Direkomendasikan)

Aplikasi telah dilengkapi sistem **dual-mode resilient**:
- Saat ini website sudah **100% berjalan normal** dan menyimpan perubahan ke local persistent store.
- Bucket Supabase Storage `media` sudah aktif dan terhubung.
- Untuk mengaktifkan tabel PostgreSQL langsung di Supabase cloud Anda:
  1. Buka [Supabase SQL Editor](https://supabase.com/dashboard/project/aachoudpemjvgjqlvcqp/sql/new).
  2. Buka file [`supabase/schema.sql`](supabase/schema.sql) atau klik tombol **"Salin Script SQL"** di tab Database pada panel admin.
  3. Tempel (Paste) di editor Supabase dan klik tombol **Run**.

---

## 💻 Menjalankan di Komputer Lokal

```bash
# Pasang dependensi (jika baru di-clone)
npm install

# Jalankan server pengembangan
npm run dev

# Atau jalankan versi produksi yang optimal
npm run build
npm run start
```

Buka peramban di `http://localhost:3000`.
