'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { Menu, X, Scale, Phone, ShieldCheck, Lock, ChevronRight } from 'lucide-react';

interface NavbarProps {
  settings: SiteSettings;
}

export default function Navbar({ settings: initialSettings }: NavbarProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Sync when prop updates
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  // Reset error when logo_url changes
  useEffect(() => {
    setLogoError(false);
  }, [settings.logo_url]);

  // Reactive listener: live cross-tab storage, custom event, & focus sync
  useEffect(() => {
    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Partial<SiteSettings>>;
      if (customEvent.detail) {
        setSettings(prev => ({ ...prev, ...customEvent.detail }));
        setLogoError(false);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'law_site_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings(prev => ({ ...prev, ...parsed }));
          setLogoError(false);
        } catch {}
      }
    };

    const handleFocus = () => {
      try {
        const stored = localStorage.getItem('law_site_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch {}
    };

    window.addEventListener('law_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);

    // Initial check
    handleFocus();

    return () => {
      window.removeEventListener('law_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Tentang', href: '#tentang' },
    { label: 'Pengurus', href: '#pengurus' },
    { label: 'Kegiatan', href: '#kegiatan' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'Aspirasi & Kontak', href: '#kontak' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const cleanWaNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';
  const waUrl = cleanWaNumber 
    ? `https://wa.me/${cleanWaNumber}?text=Halo%20Pengurus%20${encodeURIComponent(settings.org_name)},%20saya%20ingin%20menyampaikan%20aspirasi/pertanyaan.` 
    : '#kontak';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg border-b border-slate-200/80 shadow-xs py-2 sm:py-3'
          : 'bg-white/85 backdrop-blur-md border-b border-slate-200/50 py-2.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <Link href="#beranda" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 flex-1 sm:flex-initial">
            {settings.logo_url && !logoError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logo_url}
                alt={settings.org_name}
                onError={() => setLogoError(true)}
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-xl border border-slate-200/90 bg-white p-1 shadow-2xs group-hover:scale-105 transition-transform shrink-0"
              />
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-950 flex items-center justify-center text-amber-300 shadow-sm border border-amber-400/20 group-hover:scale-105 transition-transform shrink-0">
                <Scale className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
            )}
            <div className="flex flex-col min-w-0 pr-1">
              <span className="font-bold text-slate-900 tracking-tight text-xs sm:text-base leading-tight group-hover:text-maroon-800 transition-colors line-clamp-1 sm:line-clamp-none max-w-[210px] xs:max-w-[260px] sm:max-w-none">
                {settings.org_name}
              </span>
              <span className="text-[10px] sm:text-[11px] text-maroon-800/80 font-medium tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-600 shrink-0 inline" /> 
                <span className="truncate">Organisasi Mahasiswa Fakultas Hukum</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs font-semibold text-slate-600 hover:text-maroon-900 px-3.5 py-1.5 rounded-full hover:bg-white transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right Action */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-full text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 group"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Aspirasi WA</span>
            </a>
            <Link
              href="/admin"
              className="p-2 text-slate-400 hover:text-maroon-800 hover:bg-rose-50/60 rounded-full transition-colors"
              title="Portal Admin"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Right Action: Hamburger Only on Small Screens */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Aspirasi WhatsApp"
              className="touch-target hidden sm:inline-flex px-3.5 py-1.5 bg-maroon-800 text-white rounded-full text-xs font-bold items-center gap-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>Aspirasi</span>
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              aria-label="Buka menu navigasi"
              className="touch-target w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              {isOpen ? <X className="w-5 h-5 text-maroon-800" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className="touch-target justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-rose-50/70 hover:text-maroon-900 transition-colors flex items-center"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="touch-target w-full bg-maroon-800 text-white rounded-xl text-center font-bold text-xs shadow flex items-center justify-center gap-2 py-3"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                WhatsApp Aspirasi & Sekretariat
              </a>
              <Link
                href="/admin"
                onClick={handleLinkClick}
                className="touch-target w-full border border-slate-200 text-slate-700 rounded-xl text-center font-semibold text-xs hover:bg-slate-50 flex items-center justify-center gap-2 py-2.5"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Portal Admin CMS
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
