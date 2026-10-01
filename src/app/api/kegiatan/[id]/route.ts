import { NextResponse } from 'next/server';
import { deleteKegiatan } from '@/lib/data-service';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kegiatan = await deleteKegiatan(id);
    return NextResponse.json({ success: true, kegiatan });
  } catch (error) {
    console.error('API /api/kegiatan/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus kegiatan' }, { status: 500 });
  }
}
