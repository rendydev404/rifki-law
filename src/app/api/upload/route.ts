import { NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fileName = `${Date.now()}_${cleanBase}${ext}`;

    // 1. Try uploading to Supabase Storage
    try {
      const { error: uploadError } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            storage: 'supabase',
          });
        }
      } else {
        console.warn('Supabase storage upload returned error, using local fallback:', uploadError);
      }
    } catch (storageErr) {
      console.warn('Supabase storage exception, using local fallback:', storageErr);
    }

    // 2. Local fallback storage in public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const localFilePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(localFilePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${fileName}`,
      storage: 'local',
    });
  } catch (error) {
    console.error('API /api/upload error:', error);
    return NextResponse.json({ error: 'Gagal mengunggah file' }, { status: 500 });
  }
}
