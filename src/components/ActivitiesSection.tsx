'use client';

import React, { useState } from 'react';
import { Kegiatan, SiteSettings } from '@/lib/types';
import { Calendar, MapPin, Clock, Tag, ExternalLink, ArrowRight, Bookmark, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface ActivitiesSectionProps {
  kegiatan: Kegiatan[];
  whatsappNumber: string;
  settings?: SiteSettings;
}

export default function ActivitiesSection({ kegiatan, whatsappNumber, settings }: ActivitiesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Advokasi', 'Sosialisasi', 'Konsultasi', 'Edukasi', 'Pelatihan'];

  const upcomingAgendas = kegiatan.filter(k => k.tipe === 'agenda');
  const pastActivities = kegiatan.filter(k => k.tipe === 'kegiatan');

  const filteredActivities = selectedCategory === 'Semua'
    ? pastActivities
    : pastActivities.filter(k => k.kategori.toLowerCase() === selectedCategory.toLowerCase());

  const cleanWaNumber = whatsappNumber ? whatsappNumber.replace(/\D/g, '') : '';

  return (
    <section id="kegiatan" className="py-14 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-rose-50 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 border border-rose-200/80">
            <Calendar className="w-3.5 h-3.5" /> {settings?.kegiatan_badge || 'Aktivitas & Agenda'}
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {settings?.kegiatan_title || 'Kegiatan & Jadwal Terbuka'}
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 sm:mt-4 mb-3 sm:mb-4 rounded-full" />
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            {settings?.kegiatan_subtitle || 'Ikuti agenda kegiatan kemahasiswaan, kajian hukum, serta program kerja terbaru.'}
          </p>
        </ScrollReveal>

        {/* 1. SECTION: AGENDA MENDATANG */}
        {upcomingAgendas.length > 0 && (
          <div id="agenda" className="mb-12 sm:mb-20">
            <ScrollReveal animation="up" className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-maroon-800" /> Agenda Mendatang
                </h3>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                Terbuka untuk Umum
              </span>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
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
                    <div className="w-full bg-[#faf9f8] rounded-3xl border border-rose-200/80 p-5 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group">
                      
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <span className="bg-rose-100 text-maroon-900 font-bold text-xs px-3 py-1 rounded-full">
                          {agenda.kategori}
                        </span>
                        <span className="bg-amber-400 text-maroon-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
                          Segera
                        </span>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-maroon-800 transition-colors">
                          {agenda.judul}
                        </h4>

                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                          {agenda.deskripsi}
                        </p>

                        {/* Metadata List */}
                        <div className="space-y-2.5 text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-200/70 mb-6">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-4 h-4 text-maroon-800 shrink-0" />
                            <span className="font-bold text-slate-800">{agenda.tanggal}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-maroon-800 shrink-0" />
                            <span>{agenda.waktu || 'Waktu dikonfirmasi'}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <MapPin className="w-4 h-4 text-maroon-800 shrink-0" />
                            <span className="line-clamp-1">{agenda.lokasi}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action CTA */}
                      <a
                        href={regUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="touch-target w-full bg-maroon-800 hover:bg-maroon-900 text-white rounded-full font-bold text-xs sm:text-sm text-center py-3.5 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                      >
                        <span>Daftar / Info Keikutsertaan</span>
                        <ExternalLink className="w-4 h-4 text-amber-300" />
                      </a>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. SECTION: KEGIATAN TERLAKSANA */}
        <div>
          <ScrollReveal animation="up" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Arsip Kegiatan Terlaksana
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Dokumentasi langkah nyata pembelaan dan penyuluhan hukum di masyarakat.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-2.5 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`touch-target px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-maroon-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {filteredActivities.map((act, idx) => (
              <ScrollReveal
                key={act.id}
                animation="up"
                delay={idx * 60}
                className="flex"
              >
                <div className="w-full bg-[#faf9f8] rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  {/* Photo Frame */}
                  <div className="h-48 sm:h-52 w-full overflow-hidden bg-slate-200 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={act.foto_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'}
                      alt={act.judul}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-maroon-900 border border-rose-100 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                      {act.kategori}
                    </span>
                    {act.is_featured && (
                      <span className="absolute top-3.5 right-3.5 bg-amber-400 text-maroon-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-2xs">
                        Sorotan
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-maroon-700" />
                        <span>{act.tanggal}</span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-maroon-700" />
                        <span className="truncate max-w-[120px]">{act.lokasi}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 group-hover:text-maroon-800 transition-colors leading-snug mb-2">
                        {act.judul}
                      </h4>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {act.deskripsi}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-maroon-800 group-hover:underline flex items-center gap-1">
                        Dokumentasi Perkara <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
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
