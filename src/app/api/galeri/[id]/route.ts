import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteGaleri } from '@/lib/data-service';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galeri = await deleteGaleri(id);
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch {}
    return NextResponse.json({ success: true, galeri });
  } catch (error) {
    console.error('API /api/galeri/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus foto galeri' }, { status: 500 });
  }
}
