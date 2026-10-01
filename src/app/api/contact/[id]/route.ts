import { NextResponse } from 'next/server';
import { updatePesanStatus } from '@/lib/data-service';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!body.status) {
      return NextResponse.json({ error: 'Status pesan wajib diisi' }, { status: 400 });
    }

    const updated = await updatePesanStatus(id, body.status);
    return NextResponse.json({ success: true, pesan: updated });
  } catch (error) {
    console.error('API /api/contact/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status pesan' }, { status: 500 });
  }
}
