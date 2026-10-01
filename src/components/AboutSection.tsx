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
    <section id="tentang" className="py-20 sm:py-28 bg-[#faf9f8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Tentang Organisasi
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Perjalanan Advokasi & Visi Keadilan
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-4 mb-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Mengenal dedikasi, landasan nilai, serta susunan kepengurusan yang mengabdi bagi masyarakat pencari keadilan.
          </p>
        </ScrollReveal>

        {/* 1. Sejarah Organisasi: Editorial Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
          
          {/* Sejarah Quote Callout */}
          <ScrollReveal animation="left" delay={80} className="lg:col-span-5 flex">
            <div className="w-full bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden border border-maroon-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 mb-6 border border-white/15">
                  <Scale className="w-6 h-6" />
                </div>
                
                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 block mb-2">
                  Komitmen Perjuangan
                </span>
                
                <h3 className="text-xl sm:text-2xl font-serif italic text-rose-50 leading-snug mb-4">
                  &ldquo;Keadilan tidak boleh menjadi barang mewah yang hanya bisa dibeli oleh segelintir orang.&rdquo;
                </h3>
                
                <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
                  Lembaga ini berakar dari tekad kuat membuka akses peradilan yang setara, transparan, dan berpihak pada kebenaran faktual.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-300 shrink-0" />
                <span className="text-xs font-semibold text-rose-100">
                  Lembaga Bantuan Hukum Terakreditasi
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Sejarah Narrative Text */}
          <ScrollReveal animation="right" delay={120} className="lg:col-span-7 flex">
            <div className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-maroon-800 block mb-2">
                Rekam Jejak Pendirian
              </span>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-5 leading-snug">
                Satu Dekade Berdiri Bersama Masyarakat
              </h3>
              
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 font-normal">
                {settings.sejarah}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-maroon-800 flex items-center justify-center font-bold text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">Perkara Litigasi</h4>
                    <p className="text-[11px] text-slate-500">Pendampingan sidang peradilan</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">Non-Litigasi</h4>
                    <p className="text-[11px] text-slate-500">Mediasi damai & edukasi warga</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

        {/* 2. Visi & Misi: Clean Balanced Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 sm:mb-28">
          
          {/* Visi Card */}
          <ScrollReveal animation="left" delay={100} className="lg:col-span-5 flex">
            <div className="w-full bg-white rounded-3xl p-8 sm:p-10 border-t-4 border-t-maroon-800 border-x border-b border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-maroon-800 text-xs font-bold mb-5">
                  <Target className="w-3.5 h-3.5 text-maroon-700" />
                  <span>Visi Jangka Panjang</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-4 leading-snug">
                  Arah Pandang Lembaga
                </h3>
                
                <div className="relative pl-6 border-l-2 border-amber-400 py-1 my-4">
                  <p className="font-serif italic text-base sm:text-lg text-slate-800 leading-relaxed">
                    &ldquo;{settings.visi}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Prinsip integritas moral dan profesionalisme hukum</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Misi Card */}
          <ScrollReveal animation="right" delay={150} className="lg:col-span-7 flex">
            <div className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Misi & Langkah Aksi</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 leading-snug">
                  Manifesto Pembelaan Hukum
                </h3>

                <div className="space-y-4">
                  {Array.isArray(settings.misi) && settings.misi.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                      <span className="font-serif font-extrabold text-maroon-800 text-base sm:text-lg shrink-0 mt-0.5 w-6">
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
        <div id="pengurus" className="pt-4">
          <ScrollReveal animation="up" className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-maroon-700" /> Struktur Kepengurusan
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pimpinan & Advokat Pengabdi
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Praktisi hukum berintegritas tinggi dengan komitmen penuh membela hak-hak rakyat.
            </p>
          </ScrollReveal>

          {/* Divisi Filter Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {divisiList.map((divisi) => (
              <button
                key={divisi}
                onClick={() => setSelectedDivisi(divisi)}
                className={`touch-target px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPengurus.map((member, idx) => (
              <ScrollReveal
                key={member.id}
                animation="up"
                delay={idx * 60}
                className="flex"
              >
                <div className="w-full bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  {/* Member Photo Frame */}
                  <div className="h-64 sm:h-72 w-full overflow-hidden bg-slate-200 relative">
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
                      <h4 className="text-base font-bold leading-tight truncate">
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
                          Advokat pengabdi bantuan hukum dan pendampingan masyarakat.
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
              </ScrollReveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
