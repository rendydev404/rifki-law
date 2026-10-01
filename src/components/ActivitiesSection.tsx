'use client';

import React, { useState } from 'react';
import { Kegiatan } from '@/lib/types';
import { Calendar, MapPin, Clock, Tag, ExternalLink, ArrowRight, Bookmark } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface ActivitiesSectionProps {
  kegiatan: Kegiatan[];
  whatsappNumber: string;
}

export default function ActivitiesSection({ kegiatan, whatsappNumber }: ActivitiesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Advokasi', 'Sosialisasi', 'Konsultasi', 'Edukasi', 'Pelatihan'];

  const upcomingAgendas = kegiatan.filter(k => k.tipe === 'agenda');
  const pastActivities = kegiatan.filter(k => k.tipe === 'kegiatan');

  const filteredActivities = selectedCategory === 'Semua'
    ? pastActivities
    : pastActivities.filter(k => k.kategori.toLowerCase() === selectedCategory.toLowerCase());

  const cleanWaNumber = whatsappNumber ? whatsappNumber.replace(/\D/g, '') : '';

  return (
    <section id="kegiatan" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5" /> Aktivitas & Agenda
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kegiatan Lembaga & Jadwal Mendatang
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 mb-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base">
            Informasi lengkap pendampingan kasus hukum, sosialisasi ke masyarakat, dan agenda pelatihan terbuka.
          </p>
        </ScrollReveal>

        {/* 1. SECTION: AGENDA MENDATANG (UPCOMING EVENTS) */}
        {upcomingAgendas.length > 0 && (
          <div id="agenda" className="mb-16 sm:mb-20">
            <ScrollReveal animation="up" className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-maroon-700" /> Agenda Mendatang (Terbuka untuk Publik)
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {upcomingAgendas.length} Agenda
              </span>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAgendas.map((agenda, idx) => {
                const regUrl = agenda.link_pendaftaran 
                  ? agenda.link_pendaftaran 
                  : `https://wa.me/${cleanWaNumber}?text=Halo%20Admin,%20saya%20ingin%20mendaftar%20atau%20info%20kegiatan:%20${encodeURIComponent(agenda.judul)}`;

                return (
                  <ScrollReveal
                    key={agenda.id}
                    animation="up"
                    delay={idx * 100}
                    className="flex"
                  >
                    <div className="w-full bg-white rounded-2xl border-2 border-rose-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-maroon-800 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                        Segera Datang
                      </div>

                      <div>
                        {/* Meta badge & category */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-rose-50 text-maroon-800 border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {agenda.kategori}
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-3">
                          {agenda.judul}
                        </h4>

                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                          {agenda.deskripsi}
                        </p>

                        {/* Detail metadata list */}
                        <div className="space-y-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-5">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-maroon-700 shrink-0" />
                            <span className="font-semibold text-slate-800">{agenda.tanggal}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-maroon-700 shrink-0" />
                            <span>{agenda.waktu || 'Waktu dikonfirmasi'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-maroon-700 shrink-0" />
                            <span className="line-clamp-1">{agenda.lokasi}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action button */}
                      <a
                        href={regUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="touch-target w-full bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl font-bold text-xs sm:text-sm text-center py-2.5 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Daftar / Info Keikutsertaan</span>
                        <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                      </a>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. SECTION: DAFTAR KEGIATAN TERLAKSANA */}
        <div>
          <ScrollReveal animation="up" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Daftar Kegiatan yang Telah Terlaksana
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Dokumentasi langkah konkret advokasi hukum di tengah masyarakat.
              </p>
            </div>

            {/* Category Filter Pills (Mobile Scrollable) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`touch-target px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-maroon-800 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Activities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act, idx) => (
              <ScrollReveal
                key={act.id}
                animation="up"
                delay={idx * 60}
                className="flex"
              >
                <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group">
                  {/* Image */}
                  <div className="h-48 sm:h-52 w-full overflow-hidden bg-slate-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={act.foto_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'}
                      alt={act.judul}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-maroon-900 border border-rose-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {act.kategori}
                    </div>
                    {act.is_featured && (
                      <div className="absolute top-3 right-3 bg-amber-400 text-maroon-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                        Sorotan
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-maroon-700" />
                        <span>{act.tanggal}</span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-maroon-700" />
                        <span className="truncate">{act.lokasi}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 group-hover:text-maroon-800 transition-colors leading-snug mb-2">
                        {act.judul}
                      </h4>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {act.deskripsi}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-maroon-700 group-hover:underline flex items-center gap-1">
                        Dokumentasi Lengkap <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">
                Belum ada kegiatan dengan kategori &ldquo;{selectedCategory}&rdquo;.
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
