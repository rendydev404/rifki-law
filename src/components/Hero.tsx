'use client';

import React from 'react';
import { SiteSettings, Kegiatan } from '@/lib/types';
import { Scale, ShieldCheck, ChevronRight, Award, Users, FileCheck, Calendar } from 'lucide-react';

interface HeroProps {
  settings: SiteSettings;
  recentActivities: Kegiatan[];
}

export default function Hero({ settings, recentActivities }: HeroProps) {
  const cleanWaNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';
  const waUrl = cleanWaNumber 
    ? `https://wa.me/${cleanWaNumber}?text=Halo%20${encodeURIComponent(settings.org_name)},%20saya%20membutuhkan%20informasi%20bantuan%20hukum.` 
    : '#kontak';

  return (
    <section id="beranda" className="pt-24 pb-12 sm:pt-28 sm:pb-20 bg-gradient-to-b from-rose-50/50 via-white to-slate-50 relative overflow-hidden">
      {/* Decorative Law Accent Background */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200/80 text-maroon-800 text-xs sm:text-sm font-semibold mb-4 sm:mb-5 shadow-xs">
              <Scale className="w-4 h-4 text-maroon-700" />
              <span>{settings.hero_badge || 'Lembaga Advokasi & Bantuan Hukum Resmi'}</span>
            </div>

            {/* Slogan Highlight */}
            <div className="w-full bg-gradient-to-r from-maroon-900 to-maroon-800 text-white rounded-xl p-3.5 sm:p-4 mb-5 shadow-sm border border-maroon-950">
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold block mb-0.5">
                Slogan Organisasi
              </span>
              <p className="font-serif italic text-base sm:text-lg text-rose-50 leading-snug">
                &ldquo;{settings.slogan}&rdquo;
              </p>
            </div>

            {/* Ucapan Selamat Datang & Welcome Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {settings.welcome_title}
            </h1>

            {/* Welcome Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl">
              {settings.welcome_subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8 sm:mb-10">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target px-6 py-3.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl font-bold text-sm sm:text-base text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Ajukan Permohonan Bantuan</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#kegiatan"
                className="touch-target px-6 py-3.5 bg-white hover:bg-rose-50 border border-slate-300 text-slate-800 rounded-xl font-semibold text-sm sm:text-base text-center transition-all flex items-center justify-center gap-2"
              >
                <span>Lihat Kegiatan Terbaru</span>
              </a>
            </div>

            {/* Impact Metric Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-4 border-t border-slate-200/80">
              <div className="bg-white p-3 rounded-lg border border-slate-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-maroon-800 font-extrabold text-lg sm:text-xl">
                  <FileCheck className="w-4 h-4 text-maroon-700" />
                  <span>900+</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Perkara Pro Bono</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-maroon-800 font-extrabold text-lg sm:text-xl">
                  <Users className="w-4 h-4 text-maroon-700" />
                  <span>45+</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Advokat & Paralegal</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-maroon-800 font-extrabold text-lg sm:text-xl">
                  <Award className="w-4 h-4 text-maroon-700" />
                  <span>10+ Thn</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Pengabdian Publik</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200/70 shadow-2xs">
                <div className="flex items-center gap-1.5 text-maroon-800 font-extrabold text-lg sm:text-xl">
                  <ShieldCheck className="w-4 h-4 text-maroon-700" />
                  <span>100%</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Bantuan Cuma-Cuma</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual & Foto Kegiatan Terbaru Showcase */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Primary Visual Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.hero_image_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'}
                alt={settings.org_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/90 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <div className="inline-block bg-amber-400 text-maroon-950 font-bold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2">
                  Dokumentasi Aksi Lapangan
                </div>
                <p className="font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                  Penegakan Hak Konstitusional & Pendampingan Warga Tanpa Kompromi
                </p>
              </div>
            </div>

            {/* Foto Kegiatan Terbaru Cards (Carousel/Grid Preview) */}
            {recentActivities && recentActivities.length > 0 && (
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-maroon-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Foto Kegiatan Terbaru
                  </span>
                  <a href="#kegiatan" className="text-xs font-medium text-slate-500 hover:text-maroon-800">
                    Lihat Semua &rarr;
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {recentActivities.slice(0, 2).map((act) => (
                    <a
                      key={act.id}
                      href="#kegiatan"
                      className="group flex flex-col rounded-lg overflow-hidden border border-slate-100 hover:border-maroon-300 transition-colors"
                    >
                      <div className="h-24 w-full overflow-hidden bg-slate-100 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={act.foto_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'}
                          alt={act.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-maroon-900/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                          {act.kategori}
                        </span>
                      </div>
                      <div className="p-2 bg-slate-50/70">
                        <p className="text-[11px] font-semibold text-slate-800 line-clamp-1 group-hover:text-maroon-800">
                          {act.judul}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {act.tanggal}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
