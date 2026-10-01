'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export default function ImageUpload({ label, value, onChange, helperText }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengunggah gambar');
      }

      onChange(data.url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal mengunggah gambar');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-maroon-700 hover:underline"
        >
          {showUrlInput ? 'Gunakan Upload File' : 'Input URL Langsung'}
        </button>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          {error}
        </p>
      )}

      {/* URL Input Mode */}
      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="touch-target flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
          />
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="touch-target px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Selesai
          </button>
        </div>
      ) : (
        /* File Upload Mode */
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {value ? (
            /* Preview existing image */
            <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center gap-4 p-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Gambar Terpilih
                </span>
                <p className="text-xs text-slate-500 truncate mt-0.5" title={value}>
                  {value}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-maroon-800 hover:underline font-semibold mt-1 inline-block"
                >
                  Ganti File...
                </button>
              </div>

              <button
                type="button"
                onClick={() => onChange('')}
                className="touch-target w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
                title="Hapus gambar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Upload dropzone / button */
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="touch-target w-full border-2 border-dashed border-slate-300 hover:border-maroon-800 bg-slate-50/50 hover:bg-rose-50/30 rounded-xl p-4 text-center transition-colors flex flex-col items-center justify-center gap-2"
            >
              {uploading ? (
                <div className="flex items-center gap-2 text-sm text-maroon-800 font-semibold">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengunggah ke Supabase Storage...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-maroon-800 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Klik untuk Unggah Gambar (Maks. 5MB)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Tersimpan aman di Supabase Storage &quot;media&quot;
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
