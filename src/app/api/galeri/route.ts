import { NextResponse } from 'next/server';
import { saveGaleri } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.judul || !body.foto_url) {
      return NextResponse.json({ error: 'Judul dan URL foto wajib diisi' }, { status: 400 });
    }
    const galeri = await saveGaleri({
      ...body,
      id: body.id || 'g-' + Date.now(),
    });
    return NextResponse.json({ success: true, galeri });
  } catch (error) {
    console.error('API /api/galeri error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan foto galeri' }, { status: 500 });
  }
}
