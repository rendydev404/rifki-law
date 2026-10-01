export interface SiteSettings {
  id: string;
  org_name: string;
  slogan: string;
  welcome_title: string;
  welcome_subtitle: string;
  logo_url: string;
  hero_badge: string;
  hero_image_url: string;
  sejarah: string;
  visi: string;
  misi: string[];
  instagram: string;
  whatsapp: string;
  email: string;
  alamat: string;
  maps_url: string;
  jam_operasional: string;
  updated_at?: string;
}

export interface Pengurus {
  id: string;
  nama: string;
  gelar: string;
  jabatan: string;
  divisi: string;
  foto_url: string;
  urutan: number;
  bio: string;
  kontak_email: string;
  is_active: boolean;
  created_at?: string;
}

export interface Kegiatan {
  id: string;
  judul: string;
  kategori: 'Advokasi' | 'Sosialisasi' | 'Konsultasi' | 'Edukasi' | 'Pelatihan' | string;
  tipe: 'kegiatan' | 'agenda';
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi: string;
  foto_url: string;
  is_featured: boolean;
  link_pendaftaran?: string;
  created_at?: string;
}

export interface Galeri {
  id: string;
  judul: string;
  deskripsi: string;
  foto_url: string;
  tanggal: string;
  urutan: number;
  created_at?: string;
}

export interface PesanKontak {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  subjek: string;
  kategori_hukum: string;
  pesan: string;
  status: 'belum_dibaca' | 'diproses' | 'selesai';
  created_at: string;
}

export interface OrganizationData {
  settings: SiteSettings;
  pengurus: Pengurus[];
  kegiatan: Kegiatan[];
  galeri: Galeri[];
  pesan: PesanKontak[];
  isSupabaseConnected?: boolean;
}
