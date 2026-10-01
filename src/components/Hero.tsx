'use client';

import React from 'react';
import { SiteSettings, Kegiatan } from '@/lib/types';
import { Scale, ChevronRight, Award, Users, FileCheck, ShieldCheck } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface HeroProps {
  settings: SiteSettings;
  recentActivities: Kegiatan[];
}

export default function Hero({ settings }: HeroProps) {
  const cleanWaNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';
  const waUrl = cleanWaNumber 
    ? `https://wa.me/${cleanWaNumber}?text=Halo%20${encodeURIComponent(settings.org_name)},%20saya%20membutuhkan%20informasi%20bantuan%20hukum.` 
    : '#kontak';

  return (
    <section id="beranda" className="pt-24 pb-14 sm:pt-36 sm:pb-24 bg-white relative overflow-hidden border-b border-slate-100">
      
      {/* Subtle soft background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-50/80 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Slogan, Welcome Title, Subtitle, CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left w-full">
            
            {/* 1. Welcoming Badge & Slogan Tag */}
            <ScrollReveal animation="fade" delay={50} className="w-full max-w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2 sm:gap-2.5 mb-4 sm:mb-5 w-full max-w-full">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-maroon-800 text-xs font-bold shadow-2xs shrink-0 w-fit">
                  <span>👋</span>
                  <span>Selamat Datang</span>
                </div>
                {settings.slogan && (
                  <div className="inline-flex items-start sm:items-center gap-2 px-3.5 py-1.5 sm:py-1 rounded-xl sm:rounded-full bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs font-medium shadow-2xs leading-snug sm:leading-relaxed max-w-full">
                    <Scale className="w-3.5 h-3.5 text-maroon-700 shrink-0 mt-0.5 sm:mt-0" />
                    <span className="break-words min-w-0 flex-1">
                      &ldquo;{settings.slogan}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* 2. Ucapan Selamat Datang (Judul Utama) */}
            <ScrollReveal animation="up" delay={100}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.14] mb-4 sm:mb-6">
                {settings.welcome_title || 'Selamat Datang di Portal Resmi Organisasi Mahasiswa Hukum'}
              </h1>
            </ScrollReveal>

            {/* 3. Subtitle / Sambutan Singkat */}
            <ScrollReveal animation="up" delay={150}>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl font-normal">
                {settings.welcome_subtitle}
              </p>
            </ScrollReveal>

            {/* 4. Action CTA Buttons */}
            <ScrollReveal animation="up" delay={200} className="w-full sm:w-auto mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <a
                  href={settings.cta_primary_url || waUrl}
                  target={settings.cta_primary_url?.startsWith('#') ? undefined : "_blank"}
                  rel={settings.cta_primary_url?.startsWith('#') ? undefined : "noopener noreferrer"}
                  className="touch-target px-6 py-3.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl font-bold text-sm sm:text-base text-center shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{settings.cta_primary_label || 'Sampaikan Aspirasi'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                
                <a
                  href={settings.cta_secondary_url || '#kegiatan'}
                  className="touch-target px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl font-semibold text-sm sm:text-base text-center transition-all flex items-center justify-center gap-2 shadow-2xs"
                >
                  <span>{settings.cta_secondary_label || 'Lihat Kegiatan'}</span>
                </a>
              </div>
            </ScrollReveal>

            {/* 5. Clean Metrics Strip */}
            <ScrollReveal animation="up" delay={250} className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                <div className="p-2 sm:border-r border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-maroon-900 font-extrabold text-lg sm:text-xl">
                    <FileCheck className="w-4 h-4 text-maroon-700 shrink-0" />
                    <span>1.200+</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Aspirasi Mahasiswa</div>
                </div>

                <div className="p-2 sm:border-r border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-maroon-900 font-extrabold text-lg sm:text-xl">
                    <Users className="w-4 h-4 text-maroon-700 shrink-0" />
                    <span>45+</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Pengurus &amp; Kader</div>
                </div>

                <div className="p-2 sm:border-r border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-maroon-900 font-extrabold text-lg sm:text-xl">
                    <Award className="w-4 h-4 text-maroon-700 shrink-0" />
                    <span>12+</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Program Kerja/Thn</div>
                </div>

                <div className="p-2">
                  <div className="flex items-center gap-1.5 text-maroon-900 font-extrabold text-lg sm:text-xl">
                    <ShieldCheck className="w-4 h-4 text-maroon-700 shrink-0" />
                    <span>100%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Independen &amp; Aktif</div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Clean Hero Image */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal animation="right" delay={150}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 aspect-4/3 sm:aspect-16/11 lg:aspect-4/3 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.hero_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'}
                  alt={settings.org_name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                
                {/* Clean dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />
                
                {/* Floating Top Badge */}
                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-maroon-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-rose-100">
                  <span>👋</span>
                  <span>Selamat Datang</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-1">
                    {settings.org_name}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-white leading-snug">
                    Wadah Intelektual, Advokasi &amp; Keadilan
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Kajian hukum, peradilan semu (moot court) &amp; pengabdian sosial mahasiswa
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
