'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  isLogo?: boolean;
}

export default function ImageUpload({ label, value, onChange, helperText, isLogo }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreviewError(false);
  }, [value]);

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
    setPreviewError(false);

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
          className="text-xs text-maroon-800 hover:text-maroon-900 font-semibold underline underline-offset-2"
        >
          {showUrlInput ? 'Unggah File' : 'Input URL'}
        </button>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
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
            placeholder="https://..."
            className="touch-target flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
          />
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="touch-target px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
          >
            Selesai
          </button>
        </div>
      ) : (
        /* File Upload Mode */
        <div>
          {value ? (
            /* Preview existing image */
            <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/80 flex items-center gap-3.5 p-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200 shadow-2xs relative flex items-center justify-center">
                {!previewError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={value}
                    alt="Preview"
                    onError={() => setPreviewError(true)}
                    className={`w-full h-full ${isLogo ? 'object-contain p-1.5' : 'object-cover'}`}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[10px] text-slate-400 p-1 text-center">
                    <ImageIcon className="w-5 h-5 text-slate-300 mb-0.5" />
                    <span>Gambar</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> File Terpilih & Terunggah
                </span>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-mono" title={value}>
                  {value}
                </p>
                <label className="text-xs text-maroon-800 hover:underline font-bold mt-1 inline-flex items-center gap-1 cursor-pointer">
                  <span>Ganti File...</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="sr-only"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => onChange('')}
                className="touch-target w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors shrink-0"
                title="Hapus gambar"
                aria-label="Hapus gambar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Upload Native Label (Foolproof for mobile touch) */
            <label className={`cursor-pointer touch-target w-full border-2 border-dashed border-slate-300 hover:border-maroon-800 active:border-maroon-800 bg-slate-50/70 hover:bg-rose-50/30 rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center gap-2 ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="sr-only"
              />

              {uploading ? (
                <div className="flex items-center gap-2 text-sm text-maroon-800 font-bold py-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengunggah file...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-maroon-800 flex items-center justify-center shadow-2xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                      Pilih / Unggah File Foto (Maks. 5MB)
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Mendukung PNG transparan, JPG, WEBP atau SVG
                    </span>
                  </div>
                </>
              )}
            </label>
          )}
        </div>
      )}
    </div>
  );
}
