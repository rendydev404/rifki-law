'use client';

import React from 'react';
import { Phone, Calendar, MessageSquare } from 'lucide-react';

interface MobileQuickBarProps {
  whatsappNumber: string;
  orgName: string;
}

export default function MobileQuickBar({ whatsappNumber, orgName }: MobileQuickBarProps) {
  const cleanWaNumber = whatsappNumber ? whatsappNumber.replace(/\D/g, '') : '';
  const waUrl = cleanWaNumber
    ? `https://wa.me/${cleanWaNumber}?text=Halo%20${encodeURIComponent(orgName)},%20saya%20ingin%20menyampaikan%20aspirasi%20/%20pertanyaan%20seputar%20mahasiswa.`
    : '#kontak';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="touch-target flex-1 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl py-2 px-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-100 shrink-0" />
          <span className="truncate">WA Aspirasi</span>
        </a>

        <a
          href="#kontak"
          className="touch-target flex-1 bg-maroon-800 active:bg-maroon-900 text-white rounded-xl py-2 px-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="truncate">Kotak Aspirasi</span>
        </a>

        <a
          href="#agenda"
          className="touch-target w-10 h-10 bg-slate-100 active:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shrink-0"
          title="Agenda Mendatang"
          aria-label="Lihat Agenda Mendatang"
        >
          <Calendar className="w-4 h-4 text-maroon-800" />
        </a>
      </div>
    </div>
  );
}
