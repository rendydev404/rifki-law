'use client';

import React from 'react';
import { SiteSettings } from '@/lib/types';
import { Phone, Mail, ArrowUpRight, MessageCircle } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

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

  const contactChannels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Hotline',
      badge: 'Respon Cepat',
      value: settings.whatsapp || '+62 812-3456-7890',
      description: 'Layanan informasi, koordinasi mahasiswa, dan chat langsung pengurus organisasi.',
      url: waUrl,
      buttonLabel: 'Hubungi via WhatsApp',
      icon: MessageCircle,
      accentBg: 'bg-emerald-50',
      iconBg: 'bg-emerald-600',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      borderColor: 'border-emerald-200/90 hover:border-emerald-400',
    },
    {
      id: 'instagram',
      name: 'Instagram Resmi',
      badge: 'Rilis & Kabar',
      value: `@${cleanIgHandle || 'bemfh.official'}`,
      description: 'Publikasi kegiatan kampus, dokumentasi aksi, infografis isu hukum, dan rilis resmi.',
      url: igUrl,
      buttonLabel: 'Kunjungi Instagram',
      icon: InstagramIcon,
      accentBg: 'bg-rose-50/60',
      iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600',
      badgeColor: 'bg-rose-100 text-rose-800',
      buttonBg: 'bg-slate-900 hover:bg-slate-800 text-white',
      borderColor: 'border-rose-200/80 hover:border-rose-300',
    },
    {
      id: 'email',
      name: 'Email Sekretariat',
      badge: 'Persuratan Resmi',
      value: settings.email || 'aspirasi@bemfh-organisasi.id',
      description: 'Korespondensi formal, proposal kerjasama institusi, audiensi, dan kemitraan akademik.',
      url: `mailto:${settings.email}`,
      buttonLabel: 'Kirim Email Resmi',
      icon: Mail,
      accentBg: 'bg-blue-50/60',
      iconBg: 'bg-blue-600',
      badgeColor: 'bg-blue-100 text-blue-800',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      borderColor: 'border-blue-200/80 hover:border-blue-300',
    },
  ];

  return (
    <section id="kontak" className="py-16 sm:py-24 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-3 border border-rose-200/80">
            <Phone className="w-3.5 h-3.5" /> 4. Kontak Resmi
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Hubungi Pengurus Organisasi
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 mb-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Terhubung langsung dengan fungsionaris organisasi mahasiswa hukum melalui kanal komunikasi resmi di bawah ini:
          </p>
        </ScrollReveal>

        {/* 3 Core Contact Cards Grid: WhatsApp, Instagram, Email */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {contactChannels.map((c, idx) => {
            const Icon = c.icon;
            return (
              <ScrollReveal
                key={c.id}
                animation="up"
                delay={idx * 100}
                className="flex"
              >
                <div className={`w-full ${c.accentBg} rounded-3xl border ${c.borderColor} p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group`}>
                  <div>
                    {/* Card Top: Icon & Badge */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className={`w-12 h-12 rounded-2xl ${c.iconBg} text-white shadow-md flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${c.badgeColor}`}>
                        {c.badge}
                      </span>
                    </div>

                    {/* Card Title & Value */}
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">
                      {c.name}
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-maroon-800 transition-colors break-words mb-3">
                      {c.value}
                    </p>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {c.description}
                    </p>
                  </div>

                  {/* Action Link Button */}
                  <a
                    href={c.url}
                    target={c.url.startsWith('mailto:') ? undefined : "_blank"}
                    rel={c.url.startsWith('mailto:') ? undefined : "noopener noreferrer"}
                    className={`touch-target w-full py-3 px-4 rounded-xl ${c.buttonBg} font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs group-hover:shadow`}
                  >
                    <span>{c.buttonLabel}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
