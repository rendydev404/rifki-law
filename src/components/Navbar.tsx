'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { Menu, X, Scale, Phone, ShieldCheck, Lock } from 'lucide-react';

interface NavbarProps {
  settings: SiteSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Tentang Kami', href: '#tentang' },
    { label: 'Kepengurusan', href: '#pengurus' },
    { label: 'Kegiatan', href: '#kegiatan' },
    { label: 'Agenda', href: '#agenda' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'Kontak', href: '#kontak' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const cleanWaNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';
  const waUrl = cleanWaNumber 
    ? `https://wa.me/${cleanWaNumber}?text=Halo%20${encodeURIComponent(settings.org_name)},%20saya%20ingin%20berkonsultasi%20hukum.` 
    : '#kontak';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-rose-100 py-2.5'
            : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Org Name */}
            <Link href="#beranda" className="flex items-center gap-3 group">
              {settings.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logo_url}
                  alt={settings.org_name}
                  className="w-10 h-10 object-contain rounded-lg border border-rose-100 p-0.5"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-950 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform">
                  <Scale className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 leading-tight text-sm sm:text-base line-clamp-1 group-hover:text-maroon-800 transition-colors">
                  {settings.org_name}
                </span>
                <span className="text-[11px] text-maroon-700 font-medium tracking-wide flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 inline text-maroon-600" /> Organisasi Bantuan Hukum
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-700 hover:text-maroon-800 transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-maroon-800 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Desktop Right CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Konsultasi WA</span>
              </a>
              <Link
                href="/admin"
                className="p-2 text-slate-400 hover:text-maroon-800 hover:bg-rose-50 rounded-lg transition-colors"
                title="Portal Admin"
              >
                <Lock className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Hamburger Button (min-size 44x44px for thumb touch) */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-target px-3 py-1.5 bg-maroon-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>Konsultasi</span>
              </a>

              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                aria-label="Toggle menu navigasi"
                className="touch-target w-11 h-11 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-maroon-800"
              >
                {isOpen ? <X className="w-6 h-6 text-maroon-800" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isOpen && (
          <div className="lg:hidden bg-white/98 border-b border-rose-100 shadow-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="touch-target justify-start px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-rose-50 hover:text-maroon-800 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="touch-target w-full bg-maroon-800 text-white rounded-xl text-center font-semibold text-sm shadow flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-amber-300" />
                  Hubungi WhatsApp Sekretariat
                </a>
                <Link
                  href="/admin"
                  onClick={handleLinkClick}
                  className="touch-target w-full border border-slate-200 text-slate-700 rounded-xl text-center font-medium text-sm hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  Masuk Portal Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
