'use client';

import React from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { Scale, ShieldCheck, Lock, Heart, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings: initialSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = React.useState<SiteSettings>(initialSettings);
  const [logoError, setLogoError] = React.useState(false);

  React.useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  React.useEffect(() => {
    setLogoError(false);
  }, [settings.logo_url]);

  React.useEffect(() => {
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
    handleFocus();

    return () => {
      window.removeEventListener('law_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-24 sm:pb-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-900">
          
          {/* Col 1: Identity & Slogan */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              {settings.logo_url && !logoError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logo_url}
                  alt={settings.org_name}
                  onError={() => setLogoError(true)}
                  className="w-10 h-10 object-contain rounded-xl bg-white p-1 border border-slate-700/60 shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-950 flex items-center justify-center text-amber-300 shadow-md">
                  <Scale className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="font-bold text-white text-base block leading-snug">
                  {settings.org_name}
                </span>
                <span className="text-[11px] text-rose-300 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Organisasi Mahasiswa Fakultas Hukum
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-4 italic font-serif text-rose-50/90">
              &ldquo;{settings.slogan}&rdquo;
            </p>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Wadah aspirasi intelektual, riset hukum progresif, pengembangan peradilan semu (moot court), serta pengabdian masyarakat demi kejayaan almamater dan keadilan bagi rakyat.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">
              Tautan Navigasi
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#beranda" className="hover:text-amber-300 transition-colors">
                  Beranda & Sambutan
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-amber-300 transition-colors">
                  Sejarah, Visi & Misi
                </a>
              </li>
              <li>
                <a href="#pengurus" className="hover:text-amber-300 transition-colors">
                  Struktur Kepengurusan
                </a>
              </li>
              <li>
                <a href="#kegiatan" className="hover:text-amber-300 transition-colors">
                  Daftar Kegiatan Lapangan
                </a>
              </li>
              <li>
                <a href="#agenda" className="hover:text-amber-300 transition-colors">
                  Agenda Mendatang
                </a>
              </li>
              <li>
                <a href="#galeri" className="hover:text-amber-300 transition-colors">
                  Dokumentasi Foto
                </a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-amber-300 transition-colors">
                  Kontak & Konsultasi
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="lg:col-span-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-4">
              Sekretariat & Hotline
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{settings.alamat}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-900 flex items-center gap-3">
              <Link
                href="/admin"
                className="touch-target inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Panel Pengurus / Admin</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 text-center sm:text-left">
          <p>
            &copy; {currentYear} {settings.org_name}. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Dibangun dengan dedikasi untuk keadilan hukum</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
