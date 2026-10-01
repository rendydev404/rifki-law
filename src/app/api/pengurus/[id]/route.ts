import { NextResponse } from 'next/server';
import { deletePengurus } from '@/lib/data-service';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pengurus = await deletePengurus(id);
    return NextResponse.json({ success: true, pengurus });
  } catch (error) {
    console.error('API /api/pengurus/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus pengurus' }, { status: 500 });
  }
}
