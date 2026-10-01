'use client';

import React, { useState } from 'react';
import { Galeri, SiteSettings } from '@/lib/types';
import { Camera, X, Calendar, ZoomIn } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface GallerySectionProps {
  galeri: Galeri[];
  settings?: SiteSettings;
}

export default function GallerySection({ galeri, settings }: GallerySectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Galeri | null>(null);

  return (
    <section id="galeri" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" /> {settings?.galeri_badge || 'Dokumentasi Kegiatan'}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            {settings?.galeri_title || 'Galeri Foto Dokumentasi'}
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 mb-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base">
            {settings?.galeri_subtitle || 'Potret komitmen dan dokumentasi kegiatan mahasiswa di kampus maupun masyarakat.'}
          </p>
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {galeri.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              animation="up"
              delay={idx * 50}
              className="flex"
            >
              <button
                onClick={() => setSelectedPhoto(item)}
                type="button"
                className="w-full group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-200 shadow-2xs hover:shadow-md transition-all text-left focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.foto_url}
                  alt={item.judul}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay on hover / mobile touch */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 sm:p-4 text-white">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-amber-300 font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.tanggal}
                    </span>
                    <ZoomIn className="w-3.5 h-3.5 hidden sm:block" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm leading-snug line-clamp-2">
                    {item.judul}
                  </h4>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (Thumb target >= 44px) */}
            <button
              onClick={() => setSelectedPhoto(null)}
              type="button"
              aria-label="Tutup foto"
              className="touch-target absolute top-3 right-3 z-10 w-11 h-11 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Photo */}
            <div className="max-h-[65vh] w-full bg-black flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.foto_url}
                alt={selectedPhoto.judul}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            {/* Caption & details */}
            <div className="p-4 sm:p-6 bg-slate-900">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedPhoto.tanggal}</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-white mb-2 leading-snug">
                {selectedPhoto.judul}
              </h3>
              {selectedPhoto.deskripsi && (
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {selectedPhoto.deskripsi}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
