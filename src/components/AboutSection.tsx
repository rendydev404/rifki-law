'use client';

import React, { useState } from 'react';
import { SiteSettings, Pengurus } from '@/lib/types';
import { BookOpen, Target, CheckCircle2, Users, Mail, UserCheck } from 'lucide-react';

interface AboutSectionProps {
  settings: SiteSettings;
  pengurus: Pengurus[];
}

export default function AboutSection({ settings, pengurus }: AboutSectionProps) {
  const [selectedDivisi, setSelectedDivisi] = useState<string>('Semua');

  // Extract unique divisions
  const divisiList = ['Semua', ...Array.from(new Set(pengurus.map(p => p.divisi)))];

  const filteredPengurus = selectedDivisi === 'Semua' 
    ? pengurus 
    : pengurus.filter(p => p.divisi === selectedDivisi);

  return (
    <section id="tentang" className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Tentang Organisasi
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mengenal Lembaga Kami
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 mb-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base">
            Sejarah perjalanan, landasan visi misi, serta struktur kepengurusan yang mengabdi untuk keadilan publik.
          </p>
        </div>

        {/* 1. Sejarah Organisasi */}
        <div className="bg-slate-50/80 rounded-2xl p-6 sm:p-10 border border-slate-200/80 mb-12 sm:mb-16 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-4">
              <span className="text-xs uppercase font-bold tracking-wider text-maroon-800 block mb-1">
                Rekam Jejak
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                Sejarah Pendirian & Dedikasi Hukum
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-2">
                Berdiri tegak mendampingi hak konstitusional rakyat sejak dekade lalu.
              </p>
            </div>
            <div className="lg:col-span-8 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-8">
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {settings.sejarah}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Visi & Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-20">
          
          {/* Visi Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-950 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4">
                <Target className="w-3.5 h-3.5" /> Visi Organisasi
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-rose-50 mb-4 leading-snug font-serif">
                Arah Pandang Jangka Panjang
              </h3>
              <p className="text-rose-100 text-sm sm:text-base leading-relaxed italic">
                &ldquo;{settings.visi}&rdquo;
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-rose-200">
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>Komitmen independen tanpa afiliasi politik praktis</span>
            </div>
          </div>

          {/* Misi Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-maroon-800 text-xs font-semibold mb-4 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-maroon-700" /> Misi & Rencana Aksi
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
              Langkah Nyata Pembelaan Hukum
            </h3>
            
            <ul className="space-y-3.5">
              {Array.isArray(settings.misi) && settings.misi.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-maroon-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 3. Struktur Kepengurusan */}
        <div id="pengurus" className="pt-4">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-amber-700" /> Sumber Daya Manusia
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">
              Struktur Kepengurusan Organisasi
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Dipimpin oleh praktisi hukum berpengalaman, akademisi, dan paralegal yang berkomitmen tinggi.
            </p>
          </div>

          {/* Divisi Filter Pills (Mobile Scrollable) */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {divisiList.map((divisi) => (
              <button
                key={divisi}
                onClick={() => setSelectedDivisi(divisi)}
                className={`touch-target px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedDivisi === divisi
                    ? 'bg-maroon-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {divisi}
              </button>
            ))}
          </div>

          {/* Pengurus Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPengurus.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Member Photo */}
                <div className="h-64 sm:h-72 w-full overflow-hidden bg-slate-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={member.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Divisi Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-maroon-900 border border-rose-200 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {member.divisi}
                  </span>
                </div>

                {/* Member Info */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-maroon-700 block mb-1">
                      {member.jabatan}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {member.nama}
                      {member.gelar && (
                        <span className="text-slate-500 font-normal text-sm ml-1">
                          {member.gelar}
                        </span>
                      )}
                    </h4>
                    {member.bio && (
                      <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  {member.kontak_email && (
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-maroon-700 shrink-0" />
                        <span className="truncate">{member.kontak_email}</span>
                      </span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
