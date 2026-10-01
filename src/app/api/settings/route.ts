import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updateSiteSettings } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await updateSiteSettings(body);
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('API /api/settings error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui pengaturan' }, { status: 500 });
  }
}
