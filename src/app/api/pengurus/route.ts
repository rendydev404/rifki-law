import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { savePengurus } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.nama || !body.jabatan) {
      return NextResponse.json({ error: 'Nama dan jabatan wajib diisi' }, { status: 400 });
    }
    const pengurus = await savePengurus({
      ...body,
      id: body.id || 'p-' + Date.now(),
    });
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}
    return NextResponse.json({ success: true, pengurus });
  } catch (error) {
    console.error('API /api/pengurus error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan data pengurus' }, { status: 500 });
  }
}
