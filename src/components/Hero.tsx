'use client';

import React from 'react';
import { SiteSettings, Kegiatan } from '@/lib/types';
import { Scale, ChevronRight, Award, Users, FileCheck, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
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
    <section id="beranda" className="pt-28 pb-16 sm:pt-36 sm:pb-24 bg-gradient-to-b from-[#faf3f4] via-white to-[#faf9f8] relative overflow-hidden bg-legal-dots">
      
      {/* Ambient background glows */}
      <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Verified Badge */}
            <ScrollReveal animation="fade" delay={50}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50/90 border border-rose-200/80 text-maroon-900 text-xs font-semibold mb-4 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="tracking-wide">{settings.hero_badge || 'Lembaga Advokasi & Bantuan Hukum Resmi'}</span>
              </div>
            </ScrollReveal>

            {/* Slogan as an elegant editorial highlight */}
            <ScrollReveal animation="left" delay={100} className="w-full mb-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-800 text-white shadow-xs border border-maroon-900">
                <Scale className="w-4 h-4 text-amber-300 shrink-0" />
                <p className="font-serif italic text-xs sm:text-sm text-rose-100 font-medium tracking-wide">
                  &ldquo;{settings.slogan}&rdquo;
                </p>
              </div>
            </ScrollReveal>

            {/* Main Headline */}
            <ScrollReveal animation="up" delay={150}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-5">
                Mendampingi Masyarakat,{' '}
                <span className="font-serif italic font-bold bg-gradient-to-r from-maroon-900 via-maroon-800 to-rose-700 bg-clip-text text-transparent block sm:inline">
                  Menegakkan Keadilan
                </span>{' '}
                Substantif.
              </h1>
            </ScrollReveal>

            {/* Welcome Subtitle */}
            <ScrollReveal animation="up" delay={200}>
              <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
                {settings.welcome_subtitle}
              </p>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal animation="up" delay={250} className="w-full sm:w-auto mb-10">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target px-7 py-3.5 bg-gradient-to-r from-maroon-900 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white rounded-full font-bold text-sm sm:text-base text-center shadow-lg shadow-maroon-950/15 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Ajukan Permohonan Bantuan</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a
                  href="#kegiatan"
                  className="touch-target px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 rounded-full font-semibold text-sm sm:text-base text-center transition-all flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs"
                >
                  <span>Lihat Kegiatan Terbaru</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Clean Metrics Ribbon */}
            <ScrollReveal animation="up" delay={300} className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-xs">
                <div className="p-2 border-r border-slate-100 last:border-0">
                  <div className="flex items-center gap-1.5 text-maroon-900 font-extrabold text-xl sm:text-2xl font-serif">
                    <FileCheck className="w-4 h-4 text-maroon-700 shrink-0" />
                    <span>900+</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Perkara Pro Bono</div>
                </div>

                <div className="p-2 sm:border-r border-slate-100">
                  <div className="flex items-center gap-1.5 text-maroon-900 font-extrabold text-xl sm:text-2xl font-serif">
                    <Users className="w-4 h-4 text-maroon-700 shrink-0" />
                    <span>45+</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Advokat & Paralegal</div>
                </div>

                <div className="p-2 border-r border-slate-100 last:border-0">
                  <div className="flex items-center gap-1.5 text-maroon-900 font-extrabold text-xl sm:text-2xl font-serif">
                    <Award className="w-4 h-4 text-maroon-700 shrink-0" />
                    <span>10+ Thn</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Pengabdian Publik</div>
                </div>

                <div className="p-2">
                  <div className="flex items-center gap-1.5 text-maroon-900 font-extrabold text-xl sm:text-2xl font-serif">
                    <ShieldCheck className="w-4 h-4 text-maroon-700 shrink-0" />
                    <span>100%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">Cuma-Cuma Bebas Biaya</div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Hero Column: Majestic Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal animation="right" delay={150}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-slate-900 aspect-4/3 sm:aspect-16/11 lg:aspect-4/3 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.hero_image_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'}
                  alt={settings.org_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                
                {/* Ambient dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/90 via-black/30 to-transparent" />
                
                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-maroon-950 font-bold text-[11px] px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-rose-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Advokasi Independen</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block mb-1">
                    Komitmen Konstitusional
                  </span>
                  <h3 className="font-serif italic font-bold text-lg sm:text-xl text-rose-50 leading-snug">
                    Perlindungan Hak Asasi & Keadilan Warga Negara
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-xs text-rose-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Pendampingan perkara litigasi dan non-litigasi</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
