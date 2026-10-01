'use client';

import React from 'react';
import { SiteSettings } from '@/lib/types';
import { Phone, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { WhatsAppLogo, GmailLogo, InstagramLogo } from '@/components/BrandIcons';

interface ContactSectionProps {
  settings: SiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const cleanWaNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';
  const waUrl = cleanWaNumber 
    ? `https://wa.me/${cleanWaNumber}?text=Halo%20Pengurus%20${encodeURIComponent(settings.org_name)},%20saya%20ingin%20berkomunikasi.` 
    : '#';

  const cleanIgHandle = settings.instagram ? settings.instagram.replace('@', '').trim() : '';
  const igUrl = cleanIgHandle ? `https://instagram.com/${cleanIgHandle}` : '#';

  // Gmail direct web compose URL fallback
  const gmailComposeUrl = settings.email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(settings.email)}`
    : `mailto:${settings.email || ''}`;

  return (
    <section id="kontak" className="py-16 sm:py-24 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-rose-200/80">
            <Phone className="w-3.5 h-3.5" /> {settings.kontak_badge || 'Kontak Resmi'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {settings.kontak_title || 'Hubungi Pengurus Organisasi'}
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 mb-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {settings.kontak_subtitle || 'Terhubung langsung dengan fungsionaris organisasi mahasiswa hukum melalui kanal komunikasi resmi di bawah ini:'}
          </p>
        </ScrollReveal>

        {/* 3 Core Contact Cards Grid: WhatsApp, Instagram, Gmail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          
          {/* 1. WHATSAPP CARD */}
          <ScrollReveal animation="up" delay={0} className="flex">
            <div className="w-full bg-emerald-50/50 rounded-3xl border border-emerald-200/90 hover:border-emerald-400 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div>
                {/* Card Top: Official WhatsApp Emblem & Badge */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-white shadow-xs border border-emerald-200/70 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0">
                    <WhatsAppLogo className="w-9 h-9" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                    Respon Cepat
                  </span>
                </div>

                {/* Card Title & Value */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  WhatsApp Hotline Resmi
                </h3>
                <p className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors break-words mb-3 font-mono">
                  {settings.whatsapp || '+62 812-3456-7890'}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Layanan informasi langsung, koordinasi kemahasiswaan, dan chat konsultasi advokasi dengan pengurus.
                </p>
              </div>

              {/* Action Link Button */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm flex items-center justify-between gap-2 transition-all shadow-xs group-hover:shadow-md shadow-emerald-500/20"
              >
                <div className="flex items-center gap-2">
                  <WhatsAppLogo className="w-4 h-4 shrink-0" />
                  <span>Hubungi via WhatsApp</span>
                </div>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </ScrollReveal>

          {/* 2. INSTAGRAM CARD */}
          <ScrollReveal animation="up" delay={80} className="flex">
            <div className="w-full bg-rose-50/40 rounded-3xl border border-rose-200/80 hover:border-rose-300 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div>
                {/* Card Top: Official Instagram Emblem & Badge */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-white shadow-xs border border-rose-200/70 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0">
                    <InstagramLogo className="w-9 h-9" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200/60">
                    Rilis & Kabar
                  </span>
                </div>

                {/* Card Title & Value */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Instagram Resmi
                </h3>
                <p className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-rose-700 transition-colors break-words mb-3">
                  @{cleanIgHandle || 'bemfh.official'}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Publikasi dokumentasi kegiatan, rilis pers aspirasi hukum, infografis advokasi, dan kabar terkini.
                </p>
              </div>

              {/* Action Link Button */}
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-between gap-2 transition-all shadow-xs group-hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <InstagramLogo className="w-4 h-4 shrink-0 rounded-xs" />
                  <span>Kunjungi Instagram</span>
                </div>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </ScrollReveal>

          {/* 3. GMAIL / EMAIL CARD */}
          <ScrollReveal animation="up" delay={160} className="flex">
            <div className="w-full bg-slate-50/70 rounded-3xl border border-slate-200/90 hover:border-red-300 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group">
              <div>
                {/* Card Top: Official Gmail Emblem & Badge */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform shrink-0">
                    <GmailLogo className="w-8 h-8" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200/60">
                    Persuratan Resmi
                  </span>
                </div>

                {/* Card Title & Value */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email / Gmail Sekretariat
                </h3>
                <p className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors break-words mb-3">
                  {settings.email || 'aspirasi@bemfh-organisasi.id'}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Korespondensi formal, pengajuan proposal kemitraan, audiensi kelembagaan, serta pengaduan hukum resmi.
                </p>
              </div>

              {/* Action Link Button */}
              <div className="flex flex-col gap-2">
                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target w-full py-3 px-4 rounded-xl bg-[#EA4335] hover:bg-[#d93025] text-white font-bold text-xs sm:text-sm flex items-center justify-between gap-2 transition-all shadow-xs group-hover:shadow-md shadow-red-500/20"
                >
                  <div className="flex items-center gap-2">
                    <GmailLogo className="w-4 h-4 shrink-0 bg-white/90 rounded-xs p-0.5" />
                    <span>Kirim via Gmail</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}
