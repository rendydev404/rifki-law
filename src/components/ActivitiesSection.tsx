'use client';

import React, { useState } from 'react';
import { Kegiatan, SiteSettings } from '@/lib/types';
import { Calendar, MapPin, Tag, ArrowRight, ExternalLink } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface ActivitiesSectionProps {
  kegiatan: Kegiatan[];
  whatsappNumber: string;
  settings?: SiteSettings;
}

const FALLBACK_ACTIVITY_IMAGE = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80';

export default function ActivitiesSection({ kegiatan, whatsappNumber, settings }: ActivitiesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Dynamic unique categories from data
  const rawCategories = Array.from(new Set(kegiatan.map(k => k.kategori).filter(Boolean)));
  const categories = ['Semua', ...rawCategories];

  const filteredActivities = selectedCategory === 'Semua'
    ? kegiatan
    : kegiatan.filter(k => k.kategori.toLowerCase() === selectedCategory.toLowerCase());

  const cleanWaNumber = whatsappNumber ? whatsappNumber.replace(/\D/g, '') : '';

  return (
    <section id="kegiatan" className="py-14 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-rose-50 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 border border-rose-200/80">
            <Calendar className="w-3.5 h-3.5" /> {settings?.kegiatan_badge || 'Daftar Kegiatan'}
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {settings?.kegiatan_title || 'Foto & Jadwal Kegiatan Mahasiswa'}
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 sm:mt-4 mb-3 sm:mb-4 rounded-full" />
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            {settings?.kegiatan_subtitle || 'Dokumentasi kegiatan advokasi hukum, seminar akademik, pelatihan peradilan semu, dan pengabdian masyarakat.'}
          </p>
        </ScrollReveal>

        {/* Category Filter Pills */}
        <ScrollReveal animation="up" className="flex items-center justify-start sm:justify-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-4 mb-8 sm:mb-12 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`touch-target px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </ScrollReveal>

        {/* Unified Foto Kegiatan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredActivities.map((act, idx) => {
            const ctaUrl = act.link_pendaftaran
              ? act.link_pendaftaran
              : `https://wa.me/${cleanWaNumber}?text=Halo%20Pengurus%20${encodeURIComponent(settings?.org_name || 'BEM FH')},%20saya%20ingin%20info%20kegiatan:%20${encodeURIComponent(act.judul)}`;

            return (
              <ScrollReveal
                key={act.id}
                animation="up"
                delay={idx * 60}
                className="flex"
              >
                <div className="w-full bg-[#faf9f8] rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  {/* Real Activity Photo Frame */}
                  <div className="h-52 sm:h-56 w-full overflow-hidden bg-slate-200 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={act.foto_url || FALLBACK_ACTIVITY_IMAGE}
                      alt={act.judul}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />

                    {/* Category & Status Badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 flex-wrap">
                      <span className="bg-white/95 backdrop-blur-md text-maroon-900 border border-rose-100 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                        {act.kategori}
                      </span>
                      {act.tipe === 'agenda' ? (
                        <span className="bg-amber-400 text-maroon-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                          Agenda Mendatang
                        </span>
                      ) : (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                          Terlaksana
                        </span>
                      )}
                    </div>

                    {act.is_featured && (
                      <span className="absolute top-3.5 right-3.5 bg-maroon-800 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        Sorotan
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      {/* Date & Location Metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5 flex-wrap">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-maroon-700 shrink-0" />
                          <span>{act.tanggal}</span>
                        </div>
                        {act.lokasi && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1 truncate max-w-[150px]">
                              <MapPin className="w-3.5 h-3.5 text-maroon-700 shrink-0" />
                              <span className="truncate">{act.lokasi}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-maroon-800 transition-colors leading-snug mb-2.5 line-clamp-2">
                        {act.judul}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                        {act.deskripsi}
                      </p>
                    </div>

                    {/* Card Footer CTA */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <a
                        href={ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-maroon-800 hover:text-maroon-900 inline-flex items-center gap-1.5 group/btn transition-colors"
                      >
                        <span>{act.tipe === 'agenda' ? 'Daftar / Info Keikutsertaan' : 'Info Selengkapnya'}</span>
                        {act.link_pendaftaran ? (
                          <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        )}
                      </a>

                      {act.waktu && (
                        <span className="text-[11px] text-slate-400 font-mono shrink-0">
                          {act.waktu}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Empty state when filter has no items */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
            <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">
              Belum ada kegiatan dengan kategori &ldquo;{selectedCategory}&rdquo;.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
