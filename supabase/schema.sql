-- ========================================================
-- SCHEMA DATABASE SUPABASE: PORTAL ORGANISASI HUKUM
-- ========================================================

-- 1. Tabel Pengaturan Situs & Konten Statis (Beranda, Tentang Kami, Kontak)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'general',
    org_name TEXT NOT NULL DEFAULT 'Lembaga Bantuan & Advokasi Hukum Cakra Keadilan',
    slogan TEXT NOT NULL DEFAULT 'Integritas Menegakkan Hukum, Ketulusan Membela Hak Rakyat',
    welcome_title TEXT NOT NULL DEFAULT 'Selamat Datang di Portal Resmi Organisasi Hukum',
    welcome_subtitle TEXT NOT NULL DEFAULT 'Wadah perjuangan penegakan keadilan substantif, advokasi masyarakat marjinal, dan edukasi kesadaran hukum nasional yang profesional serta independen.',
    logo_url TEXT DEFAULT '',
    hero_badge TEXT DEFAULT 'Layanan Bantuan Hukum & Advokasi Terpercaya',
    hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
    sejarah TEXT NOT NULL DEFAULT 'Didirikan sejak tahun 2014 oleh sekelompok praktisi hukum dan akademisi yang berdedikasi, organisasi ini lahir dari kepedulian mendalam terhadap ketimpangan akses keadilan bagi masyarakat kecil. Berawal dari pos advokasi sederhana, kini kami telah menangani lebih dari 850 perkara pro bono dan mendampingi komunitas di berbagai pelosok daerah.',
    visi TEXT NOT NULL DEFAULT 'Terwujudnya tatanan masyarakat yang berkeadilan, menjunjung tinggi supremasi hukum yang beradab, serta memberikan perlindungan hak asasi manusia bagi setiap warga negara tanpa diskriminasi.',
    misi JSONB NOT NULL DEFAULT '[
        "Memberikan bantuan hukum cuma-cuma (pro bono) secara profesional bagi masyarakat miskin dan rentan perlakuan tidak adil.",
        "Mendorong reformasi kebijakan publik dan transparansi sistem peradilan yang akuntabel.",
        "Menyelenggarakan penyuluhan dan literasi hukum berkelanjutan untuk meningkatkan kesadaran hak-hak konstitusional warga.",
        "Membina generasi advokat dan paralegal muda yang berintegritas tinggi serta berpihak pada kebenaran."
    ]'::jsonb,
    cta_primary_label TEXT DEFAULT 'Ajukan Permohonan Bantuan',
    cta_primary_url TEXT DEFAULT '',
    cta_secondary_label TEXT DEFAULT 'Lihat Kegiatan Terbaru',
    cta_secondary_url TEXT DEFAULT '#kegiatan',
    instagram TEXT DEFAULT 'cakrakeadilan.law',
    whatsapp TEXT DEFAULT '6281234567890',
    email TEXT DEFAULT 'kontak@cakrakeadilan.org',
    alamat TEXT DEFAULT 'Gedung Keadilan Lt. 3, Jl. Merak Jingga No. 45, Menteng, Jakarta Pusat 10350',
    maps_url TEXT DEFAULT 'https://maps.google.com/?q=Jakarta',
    jam_operasional TEXT DEFAULT 'Senin - Jumat: 08.30 - 17.00 WIB',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrasi jika tabel sudah ada sebelumnya
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_primary_label TEXT DEFAULT 'Ajukan Permohonan Bantuan';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_primary_url TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_secondary_label TEXT DEFAULT 'Lihat Kegiatan Terbaru';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_secondary_url TEXT DEFAULT '#kegiatan';

-- 2. Tabel Struktur Kepengurusan
CREATE TABLE IF NOT EXISTS public.pengurus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    gelar TEXT DEFAULT '',
    jabatan TEXT NOT NULL,
    divisi TEXT NOT NULL DEFAULT 'Pengurus Harian',
    foto_url TEXT DEFAULT '',
    urutan INT NOT NULL DEFAULT 0,
    bio TEXT DEFAULT '',
    kontak_email TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Kegiatan & Agenda Mendatang
CREATE TABLE IF NOT EXISTS public.kegiatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL DEFAULT 'Advokasi', -- Advokasi, Sosialisasi, Konsultasi, Edukasi, Pelatihan
    tipe TEXT NOT NULL DEFAULT 'kegiatan', -- 'kegiatan' (sudah berjalan) atau 'agenda' (mendatang)
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    waktu TEXT DEFAULT '09:00 WIB - Selesai',
    lokasi TEXT NOT NULL DEFAULT 'Ruang Sidang Utama Sekretariat',
    deskripsi TEXT NOT NULL,
    foto_url TEXT DEFAULT '',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    link_pendaftaran TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Dokumentasi Foto / Galeri
CREATE TABLE IF NOT EXISTS public.galeri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    deskripsi TEXT DEFAULT '',
    foto_url TEXT NOT NULL,
    tanggal DATE DEFAULT CURRENT_DATE,
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Pesan Masuk / Konsultasi Online
CREATE TABLE IF NOT EXISTS public.pesan_kontak (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    telepon TEXT NOT NULL,
    subjek TEXT NOT NULL,
    kategori_hukum TEXT DEFAULT 'Umum', -- Pidana, Perdata, Ketenagakerjaan, Sengketa Tanah, Keluarga, Umum
    pesan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'belum_dibaca', -- 'belum_dibaca', 'diproses', 'selesai'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesan_kontak ENABLE ROW LEVEL SECURITY;

-- Policy site_settings: siapapun bisa baca, update hanya auth/service
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin update site_settings" ON public.site_settings FOR ALL TO authenticated USING (true);

-- Policy pengurus: publik baca aktif, auth/service manage semua
CREATE POLICY "Public read pengurus" ON public.pengurus FOR SELECT USING (true);
CREATE POLICY "Admin manage pengurus" ON public.pengurus FOR ALL TO authenticated USING (true);

-- Policy kegiatan: publik baca, auth/service manage
CREATE POLICY "Public read kegiatan" ON public.kegiatan FOR SELECT USING (true);
CREATE POLICY "Admin manage kegiatan" ON public.kegiatan FOR ALL TO authenticated USING (true);

-- Policy galeri: publik baca, auth/service manage
CREATE POLICY "Public read galeri" ON public.galeri FOR SELECT USING (true);
CREATE POLICY "Admin manage galeri" ON public.galeri FOR ALL TO authenticated USING (true);

-- Policy pesan_kontak: siapapun bisa kirim pesan, hanya admin bisa baca dan kelola
CREATE POLICY "Public insert pesan_kontak" ON public.pesan_kontak FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage pesan_kontak" ON public.pesan_kontak FOR ALL TO authenticated USING (true);

-- ========================================================
-- SEED DATA AWAL (DEFAULT LEGAL ORG CONTENT)
-- ========================================================

INSERT INTO public.site_settings (id, org_name, slogan, welcome_title, welcome_subtitle, logo_url, hero_badge, hero_image_url, sejarah, visi, misi, instagram, whatsapp, email, alamat, maps_url, jam_operasional)
VALUES (
    'general',
    'Lembaga Bantuan & Advokasi Hukum Cakra Keadilan',
    'Integritas Menegakkan Hukum, Ketulusan Membela Hak Rakyat',
    'Selamat Datang di Portal Resmi Lembaga Bantuan Hukum',
    'Wadah perjuangan penegakan keadilan substantif, advokasi masyarakat marjinal, dan edukasi kesadaran hukum nasional yang profesional serta independen.',
    '',
    'Layanan Bantuan Hukum & Advokasi Terpercaya',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
    'Didirikan sejak tahun 2014 oleh sekelompok advokat senior, aktivis HAM, dan akademisi hukum di Jakarta, organisasi ini berakar dari tekad kuat menepis jurang keadilan yang kerap meminggirkan warga kurang mampu. Bermula dari pendampingan hukum di pos-pos kampung, saat ini kami telah aktif menangani ratusan perkara probono, mengadvokasi sengketa struktural, serta membina jaringan paralegal di berbagai pelosok daerah.',
    'Terwujudnya tatanan sosial yang berkeadilan hukum, beradab, berdaulat atas hak asasi manusia, serta bebas dari segala bentuk penyalahgunaan kekuasaan.',
    '[
        "Memberikan pendampingan litigasi dan non-litigasi cuma-cuma (pro bono) yang berkualitas bagi masyarakat prasejahtera.",
        "Mendorong transparansi peradilan dan advokasi kebijakan publik yang berpihak pada kepentingan umum.",
        "Menyelenggarakan klinik konsultasi dan pendidikan hukum kritis secara berkala ke komunitas warga.",
        "Menempa kader advokat serta paralegal muda berintegritas tinggi dengan komitmen etika profesi yang kukuh."
    ]'::jsonb,
    'cakrakeadilan.law',
    '6281234567890',
    'bantuan@cakrakeadilan.org',
    'Gedung Graha Keadilan Lt. 3, Jl. Kramat Raya No. 48, Senen, Jakarta Pusat 10450',
    'https://maps.google.com/?q=Jakarta',
    'Senin - Jumat: 08.30 - 17.00 WIB | Hotline Darurat: 24 Jam'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Pengurus
INSERT INTO public.pengurus (nama, gelar, jabatan, divisi, foto_url, urutan, bio, kontak_email) VALUES
('Prof. Dr. Hendra Suwandi', 'S.H., M.H.', 'Ketua Dewan Pembina', 'Dewan Pembina', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', 1, 'Pakar Hukum Tata Negara dan mantan Komisioner Komisi Yudisial.', 'pembina@cakrakeadilan.org'),
('Ahmad Fauzan Pratama', 'S.H., LL.M.', 'Direktur Eksekutif / Ketua Umum', 'Pengurus Harian', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 2, 'Advokat spesialis litigasi publik dengan pengalaman advokasi lebih dari 15 tahun.', 'direktur@cakrakeadilan.org'),
('Nathania Kusuma Wardani', 'S.H., M.Kn.', 'Sekretaris Jenderal', 'Pengurus Harian', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', 3, 'Ahli hukum perdata dan tata kelola organisasi nirlaba bereputasi nasional.', 'sekretariat@cakrakeadilan.org'),
('Bambang Irawan', 'S.E., Ak.', 'Bendahara Umum', 'Pengurus Harian', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', 4, 'Akuntan publik yang memastikan transparansi dan akuntabilitas keuangan lembaga.', 'keuangan@cakrakeadilan.org'),
('Farida Nur Anggraini', 'S.H.', 'Kepala Divisi Advokasi & Litigasi', 'Divisi Litigasi', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80', 5, 'Memimpin tim pendampingan sidang pidana dan perdata masyarakat marjinal.', 'litigasi@cakrakeadilan.org'),
('Rian Syahputra', 'S.H.', 'Kepala Divisi Edukasi & Riset Hukum', 'Divisi Riset', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', 6, 'Mengelola program sekolah paralegal dan kajian analisis kebijakan publik.', 'riset@cakrakeadilan.org')
ON CONFLICT DO NOTHING;

-- Seed Kegiatan & Agenda
INSERT INTO public.kegiatan (judul, kategori, tipe, tanggal, waktu, lokasi, deskripsi, foto_url, is_featured, link_pendaftaran) VALUES
('Pendampingan Hukum & Mediasi Sengketa Agraria Petani Subang', 'Advokasi', 'kegiatan', CURRENT_DATE - INTERVAL '14 days', '09:00 - 16:00 WIB', 'Balai Warga Desa Sukamulya, Subang', 'Tim advokat PBHAN sukses memfasilitasi dialog damai dan mediasi sengketa batas lahan garapan antara serikat tani warga lokal dengan pemegang hak guna usaha, memastikan hak kelola tanah petani tetap terlindungi secara berkepastian hukum.', 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80', true, ''),
('Penyuluhan Hukum Serentak: Memahami Hak Tenaga Kerja Outsourcing', 'Sosialisasi', 'kegiatan', CURRENT_DATE - INTERVAL '28 days', '13:30 - 17:00 WIB', 'Aula Kantor Kecamatan Senen, Jakarta', 'Sosialisasi tata cara perundingan bipartit dan pemahaman hak normatif buruh sesuai regulasi ketenagakerjaan terkini, dihadiri oleh 140 perwakilan pekerja dan serikat buruh independen.', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80', false, ''),
('Pos Bantuan Hukum & Konsultasi Cuma-cuma Car Free Day', 'Konsultasi', 'kegiatan', CURRENT_DATE - INTERVAL '7 days', '06:30 - 10:30 WIB', 'Bundaran HI, Jl. M.H. Thamrin, Jakarta', 'Layanan meja konsultasi hukum tatap muka cuma-cuma bagi masyarakat yang menghadapi persoalan sengketa waris, pinjaman online ilegal, dan perkara perdata harian.', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80', true, ''),
('Seminar Nasional & Peluncuran Catatan Tahunan Penegakan Hukum 2026', 'Edukasi', 'agenda', CURRENT_DATE + INTERVAL '12 days', '08:30 - 15:00 WIB', 'Auditorium Mochtar Kusumaatmadja, Jakarta', 'Membedah dinamika penegakan hukum dan independensi peradilan di era modern dengan menghadirkan narasumber hakim agung, praktisi hukum terkemuka, serta pegiat masyarakat sipil.', 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1000&q=80', true, 'https://forms.gle/seminar-hukum-2026'),
('Pelatihan Paralegal Komunitas Angkatan V: Penanganan Awal Perkara Pidana', 'Pelatihan', 'agenda', CURRENT_DATE + INTERVAL '25 days', '09:00 - 16:30 WIB', 'Pusat Pelatihan Hukum PBHAN, Jakarta', 'Membekali perwakilan warga dan relawan pemuda dengan keterampilan dasar pendampingan bantuan hukum awal di tingkat kepolisian dan mediasi lingkungan.', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80', false, 'https://forms.gle/paralegal-batch5')
ON CONFLICT DO NOTHING;

-- Seed Galeri Dokumentasi Foto
INSERT INTO public.galeri (judul, deskripsi, foto_url, tanggal, urutan) VALUES
('Pendampingan Warga di Ruang Pengadilan Negeri', 'Advokat kami memberikan pembelaan pro bono di hadapan majelis hakim.', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80', CURRENT_DATE - INTERVAL '10 days', 1),
('Klinik Hukum & Konsultasi Gratis Masyarakat', 'Mendengarkan langsung aduan hukum warga secara humanis dan rahasia.', 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80', CURRENT_DATE - INTERVAL '18 days', 2),
('Workshop Hak Asasi Manusia & Bantuan Hukum', 'Pelatihan kapasitas paralegal muda dari berbagai perwakilan komunitas.', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80', CURRENT_DATE - INTERVAL '25 days', 3),
('Audiensi Terbuka dengan Komisi Yudisial', 'Menyampaikan evaluasi dan pemantauan independen persidangan.', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80', CURRENT_DATE - INTERVAL '35 days', 4),
('Diskusi Publik Keadilan Restoratif bagi Korban', 'Kolaborasi bersama akademisi dan penegak hukum progresif.', 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=1000&q=80', CURRENT_DATE - INTERVAL '42 days', 5),
('Penandatanganan Kerjasama Bantuan Hukum Daerah', 'Memperluas jangkauan layanan pendampingan hukum di wilayah terpencil.', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80', CURRENT_DATE - INTERVAL '50 days', 6)
ON CONFLICT DO NOTHING;
