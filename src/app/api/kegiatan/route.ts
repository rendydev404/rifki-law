import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { saveKegiatan } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.judul || !body.tanggal) {
      return NextResponse.json({ error: 'Judul dan tanggal kegiatan wajib diisi' }, { status: 400 });
    }
    const kegiatan = await saveKegiatan({
      ...body,
      id: body.id || 'k-' + Date.now(),
    });
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}
    return NextResponse.json({ success: true, kegiatan });
  } catch (error) {
    console.error('API /api/kegiatan error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan kegiatan' }, { status: 500 });
  }
}
