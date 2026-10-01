import { NextResponse } from 'next/server';
import { submitPesanKontak } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.nama || !body.telepon || !body.pesan) {
      return NextResponse.json({ error: 'Nama, nomor telepon/WhatsApp, dan pesan wajib diisi' }, { status: 400 });
    }

    const saved = await submitPesanKontak({
      nama: body.nama,
      email: body.email || '-',
      telepon: body.telepon,
      subjek: body.subjek || 'Konsultasi Hukum',
      kategori_hukum: body.kategori_hukum || 'Umum',
      pesan: body.pesan,
    });

    return NextResponse.json({ success: true, pesan: saved });
  } catch (error) {
    console.error('API /api/contact error:', error);
    return NextResponse.json({ error: 'Gagal mengirim pesan' }, { status: 500 });
  }
}
