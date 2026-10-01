'use client';

import React, { useState } from 'react';
import { SiteSettings, Pengurus } from '@/lib/types';
import { BookOpen, Target, CheckCircle2, Users, Mail, Scale, Award, Shield } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

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
    <section id="tentang" className="py-14 sm:py-24 bg-[#faf9f8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
            <BookOpen className="w-3.5 h-3.5" /> {settings.about_badge || 'Tentang Organisasi'}
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {settings.about_title || 'Perjalanan Advokasi & Visi Keadilan'}
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 sm:mt-4 mb-3 sm:mb-4 rounded-full" />
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            {settings.about_subtitle || 'Mengenal dedikasi, landasan nilai, serta susunan kepengurusan yang mengabdi bagi masyarakat dan mahasiswa.'}
          </p>
        </ScrollReveal>

        {/* 1. Sejarah Organisasi: Editorial Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch mb-12 sm:mb-20">
          
          {/* Sejarah Quote Callout */}
          <ScrollReveal animation="left" delay={80} className="lg:col-span-5 flex">
            <div className="w-full bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-900 text-white rounded-3xl p-5 sm:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden border border-maroon-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 mb-4 sm:mb-6 border border-white/15">
                  <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-300 block mb-1.5 sm:mb-2">
                  Komitmen Perjuangan
                </span>
                
                <h3 className="text-base sm:text-xl font-bold text-white leading-snug mb-3 sm:mb-4">
                  &ldquo;Keadilan tidak boleh menjadi barang mewah yang hanya bisa dibeli oleh segelintir orang.&rdquo;
                </h3>
                
                <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
                  Lembaga ini berakar dari tekad kuat membuka akses peradilan yang setara, transparan, dan berpihak pada kebenaran faktual.
                </p>
              </div>

              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 flex items-center gap-2.5 sm:gap-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
                <span className="text-xs font-semibold text-rose-100">
                  Organisasi Mahasiswa Fakultas Hukum
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Sejarah Narrative Text */}
          <ScrollReveal animation="right" delay={120} className="lg:col-span-7 flex">
            <div className="w-full bg-white rounded-3xl p-5 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-maroon-800 block mb-1.5 sm:mb-2">
                Rekam Jejak Pendirian
              </span>
              
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-4 sm:mb-5 leading-snug">
                Dedikasi Berkelanjutan Bersama Mahasiswa
              </h3>
              
              <p className="text-slate-700 text-xs sm:text-base leading-relaxed whitespace-pre-line mb-5 sm:mb-6 font-normal">
                {settings.sejarah}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 text-maroon-800 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">Advokasi Mahasiswa</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500">Pendampingan akademik & aspirasi</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">Kajian & Aksi</h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500">Kajian kritis & pengabdian sosial</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* 2. Visi & Misi: Clean Balanced Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 sm:mb-24">
          
          {/* Visi Card */}
          <ScrollReveal animation="left" delay={100} className="lg:col-span-5 flex">
            <div className="w-full bg-white rounded-3xl p-5 sm:p-10 border-t-4 border-t-maroon-800 border-x border-b border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-maroon-800 text-xs font-bold mb-4 sm:mb-5">
                  <Target className="w-3.5 h-3.5 text-maroon-700" />
                  <span>Visi Jangka Panjang</span>
                </div>
                
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 mb-3 sm:mb-4 leading-snug">
                  Arah Pandang Lembaga
                </h3>
                
                <div className="relative pl-4 sm:pl-6 border-l-2 border-amber-400 py-1 my-3 sm:my-4">
                  <p className="font-semibold text-sm sm:text-base text-slate-800 leading-relaxed">
                    &ldquo;{settings.visi}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-100 flex items-center gap-2 text-[11px] sm:text-xs text-slate-500">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Prinsip integritas moral dan profesionalisme hukum</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Misi Card */}
          <ScrollReveal animation="right" delay={150} className="lg:col-span-7 flex">
            <div className="w-full bg-white rounded-3xl p-5 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-4 sm:mb-5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Misi & Langkah Aksi</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 mb-4 sm:mb-6 leading-snug">
                  Manifesto Pembelaan Hukum
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {Array.isArray(settings.misi) && settings.misi.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                      <span className="font-bold font-mono text-maroon-800 text-sm sm:text-base shrink-0 mt-0.5 w-6">
                        0{idx + 1}
                      </span>
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* 3. Struktur Kepengurusan */}
        <div id="pengurus" className="pt-2 sm:pt-4">
          <ScrollReveal animation="up" className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-maroon-700" /> {settings.pengurus_badge || 'Struktur Kepengurusan'}
            </div>
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {settings.pengurus_title || 'Pengurus & Fungsionaris BEM FH'}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">
              {settings.pengurus_subtitle || 'Mahasiswa Fakultas Hukum yang berdedikasi mengabdi bagi almamater, sivitas akademika, dan masyarakat.'}
            </p>
          </ScrollReveal>

          {/* Divisi Filter Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-3 mb-6 sm:mb-10 no-scrollbar">
            {divisiList.map((divisi) => (
              <button
                key={divisi}
                onClick={() => setSelectedDivisi(divisi)}
                className={`touch-target px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDivisi === divisi
                    ? 'bg-maroon-800 text-white shadow-md shadow-maroon-900/10'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {divisi}
              </button>
            ))}
          </div>

          {/* Pengurus Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {filteredPengurus.map((member, idx) => (
              <ScrollReveal
                key={member.id}
                animation="up"
                delay={idx * 60}
                className="flex"
              >
                <div className="w-full bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  {/* Member Photo Frame */}
                  <div className="h-56 sm:h-72 w-full overflow-hidden bg-slate-200 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                      alt={member.nama}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Divisi Badge */}
                    <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-maroon-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {member.divisi}
                    </span>

                    {/* Member Name in overlay for mobile glance */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <span className="text-[11px] text-amber-300 font-semibold block uppercase tracking-wide">
                        {member.jabatan}
                      </span>
                      <h4 className="text-base font-bold leading-tight break-words">
                        {member.nama} {member.gelar}
                      </h4>
                    </div>
                  </div>

                  {/* Member Bio & Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      {member.bio ? (
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      ) : (
                        <p className="text-slate-400 text-xs italic">
                          Pengurus BEM Fakultas Hukum yang berdedikasi mengabdi dan melayani mahasiswa.
                        </p>
                      )}
                    </div>

                    {member.kontak_email && (
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 min-w-0">
                          <Mail className="w-3.5 h-3.5 text-maroon-700 shrink-0" />
                          <span className="break-all">{member.kontak_email}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
