import { NextResponse } from 'next/server';
import { getOrganizationData } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getOrganizationData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/content error:', error);
    return NextResponse.json({ error: 'Gagal memuat data organisasi' }, { status: 500 });
  }
}
