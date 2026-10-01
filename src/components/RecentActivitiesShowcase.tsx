'use client';

import React from 'react';
import { Kegiatan } from '@/lib/types';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface RecentActivitiesShowcaseProps {
  activities: Kegiatan[];
}

export default function RecentActivitiesShowcase({ activities }: RecentActivitiesShowcaseProps) {
  if (!activities || activities.length === 0) return null;

  // Take recent 3 activities
  const recent = activities.slice(0, 3);

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-maroon-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Dokumentasi Terbaru</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Aksi Pendampingan & Kegiatan Terkini
            </h2>
          </div>

          <a
            href="#kegiatan"
            className="text-xs sm:text-sm font-bold text-maroon-800 hover:text-maroon-900 inline-flex items-center gap-1.5 group self-start sm:self-auto"
          >
            <span>Lihat Semua Kegiatan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 3-Column Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recent.map((act, idx) => (
            <ScrollReveal
              key={act.id}
              animation="up"
              delay={idx * 80}
              className="flex"
            >
              <a
                href="#kegiatan"
                className="group flex flex-col w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-maroon-300 hover:shadow-lg transition-all duration-300"
              >
                {/* Photo frame */}
                <div className="h-48 sm:h-52 w-full overflow-hidden bg-slate-200 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={act.foto_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'}
                    alt={act.judul}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-maroon-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs border border-rose-100">
                    {act.kategori}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-maroon-700" />
                      <span>{act.tanggal}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-maroon-700" />
                      <span className="truncate max-w-[120px]">{act.lokasi}</span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-maroon-800 transition-colors leading-snug line-clamp-2 mb-2">
                      {act.judul}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {act.deskripsi}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-maroon-800">
                    <span>Baca Rincian Kasus</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
