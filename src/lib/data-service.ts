import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from './supabase';
import { defaultOrganizationData } from './default-content';
import { OrganizationData, SiteSettings, Pengurus, Kegiatan, Galeri, PesanKontak } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'content-store.json');

function ensureDataFile(): OrganizationData {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultOrganizationData, null, 2), 'utf-8');
    return defaultOrganizationData;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local data store, falling back to default:', err);
    return defaultOrganizationData;
  }
}

function writeDataFile(data: OrganizationData) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local data store:', err);
  }
}

export async function getOrganizationData(): Promise<OrganizationData> {
  const localData = ensureDataFile();

  try {
    // Try fetching from Supabase
    const { data: settingsRow, error: settingsError } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('id', 'general')
      .maybeSingle();

    if (settingsError || !settingsRow) {
      // Table doesn't exist yet in Supabase or empty
      return {
        ...localData,
        isSupabaseConnected: false,
      };
    }

    // Tables exist in Supabase! Fetch other tables
    const [pengurusRes, kegiatanRes, galeriRes, pesanRes] = await Promise.all([
      supabaseAdmin.from('pengurus').select('*').order('urutan', { ascending: true }),
      supabaseAdmin.from('kegiatan').select('*').order('tanggal', { ascending: false }),
      supabaseAdmin.from('galeri').select('*').order('urutan', { ascending: true }),
      supabaseAdmin.from('pesan_kontak').select('*').order('created_at', { ascending: false }),
    ]);

    const settings: SiteSettings = {
      ...localData.settings,
      ...settingsRow,
      misi: Array.isArray(settingsRow.misi) ? settingsRow.misi : localData.settings.misi,
    };

    return {
      settings,
      pengurus: (pengurusRes.data && pengurusRes.data.length > 0) ? (pengurusRes.data as Pengurus[]) : localData.pengurus,
      kegiatan: (kegiatanRes.data && kegiatanRes.data.length > 0) ? (kegiatanRes.data as Kegiatan[]) : localData.kegiatan,
      galeri: (galeriRes.data && galeriRes.data.length > 0) ? (galeriRes.data as Galeri[]) : localData.galeri,
      pesan: (pesanRes.data && pesanRes.data.length > 0) ? (pesanRes.data as PesanKontak[]) : localData.pesan,
      isSupabaseConnected: true,
    };
  } catch (err) {
    console.warn('Supabase fetch failed, using local store:', err);
    return {
      ...localData,
      isSupabaseConnected: false,
    };
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const localData = ensureDataFile();
  const updatedSettings: SiteSettings = {
    ...localData.settings,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  localData.settings = updatedSettings;
  writeDataFile(localData);

  // Sync to Supabase if available
  try {
    await supabaseAdmin
      .from('site_settings')
      .upsert({
        ...updatedSettings,
        id: 'general',
      });
  } catch (err) {
    console.warn('Supabase settings upsert error (table may not exist yet):', err);
  }

  return updatedSettings;
}

export async function savePengurus(member: Pengurus): Promise<Pengurus[]> {
  const localData = ensureDataFile();
  const index = localData.pengurus.findIndex(p => p.id === member.id);

  if (index >= 0) {
    localData.pengurus[index] = member;
  } else {
    localData.pengurus.push(member);
  }
  localData.pengurus.sort((a, b) => a.urutan - b.urutan);
  writeDataFile(localData);

  try {
    await supabaseAdmin.from('pengurus').upsert(member);
  } catch (err) {
    console.warn('Supabase pengurus upsert error:', err);
  }

  return localData.pengurus;
}

export async function deletePengurus(id: string): Promise<Pengurus[]> {
  const localData = ensureDataFile();
  localData.pengurus = localData.pengurus.filter(p => p.id !== id);
  writeDataFile(localData);

  try {
    await supabaseAdmin.from('pengurus').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase pengurus delete error:', err);
  }

  return localData.pengurus;
}

export async function saveKegiatan(item: Kegiatan): Promise<Kegiatan[]> {
  const localData = ensureDataFile();
  const index = localData.kegiatan.findIndex(k => k.id === item.id);

  if (index >= 0) {
    localData.kegiatan[index] = item;
  } else {
    localData.kegiatan.unshift(item);
  }
  writeDataFile(localData);

  try {
    await supabaseAdmin.from('kegiatan').upsert(item);
  } catch (err) {
    console.warn('Supabase kegiatan upsert error:', err);
  }

  return localData.kegiatan;
}

export async function deleteKegiatan(id: string): Promise<Kegiatan[]> {
  const localData = ensureDataFile();
  localData.kegiatan = localData.kegiatan.filter(k => k.id !== id);
  writeDataFile(localData);

  try {
    await supabaseAdmin.from('kegiatan').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase kegiatan delete error:', err);
  }

  return localData.kegiatan;
}

export async function saveGaleri(item: Galeri): Promise<Galeri[]> {
  const localData = ensureDataFile();
  const index = localData.galeri.findIndex(g => g.id === item.id);

  if (index >= 0) {
    localData.galeri[index] = item;
  } else {
    localData.galeri.push(item);
  }
  localData.galeri.sort((a, b) => a.urutan - b.urutan);
  writeDataFile(localData);

  try {
    await supabaseAdmin.from('galeri').upsert(item);
  } catch (err) {
    console.warn('Supabase galeri upsert error:', err);
  }

  return localData.galeri;
}

export async function deleteGaleri(id: string): Promise<Galeri[]> {
  const localData = ensureDataFile();
  localData.galeri = localData.galeri.filter(g => g.id !== id);
  writeDataFile(localData);

  try {
    await supabaseAdmin.from('galeri').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase galeri delete error:', err);
  }

  return localData.galeri;
}

export async function submitPesanKontak(pesan: Omit<PesanKontak, 'id' | 'created_at' | 'status'>): Promise<PesanKontak> {
  const localData = ensureDataFile();
  const newPesan: PesanKontak = {
    ...pesan,
    id: 'm-' + Date.now(),
    status: 'belum_dibaca',
    created_at: new Date().toISOString(),
  };

  localData.pesan.unshift(newPesan);
  writeDataFile(localData);

  try {
    await supabaseAdmin.from('pesan_kontak').insert(newPesan);
  } catch (err) {
    console.warn('Supabase pesan insert error:', err);
  }

  return newPesan;
}

export async function updatePesanStatus(id: string, status: 'belum_dibaca' | 'diproses' | 'selesai'): Promise<PesanKontak[]> {
  const localData = ensureDataFile();
  const item = localData.pesan.find(p => p.id === id);
  if (item) {
    item.status = status;
    writeDataFile(localData);
  }

  try {
    await supabaseAdmin.from('pesan_kontak').update({ status }).eq('id', id);
  } catch (err) {
    console.warn('Supabase pesan status update error:', err);
  }

  return localData.pesan;
}
