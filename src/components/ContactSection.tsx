'use client';

import React, { useState } from 'react';
import { SiteSettings } from '@/lib/types';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, MessageSquare, ShieldAlert, ArrowUpRight } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    subjek: '',
    kategori_hukum: 'Umum',
    pesan: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const cleanWaNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';
  const waUrl = cleanWaNumber 
    ? `https://wa.me/${cleanWaNumber}?text=Halo%20Sekretariat%20${encodeURIComponent(settings.org_name)},%20saya%20ingin%20berkonsultasi.` 
    : '#';

  const cleanIgHandle = settings.instagram ? settings.instagram.replace('@', '').trim() : '';
  const igUrl = cleanIgHandle ? `https://instagram.com/${cleanIgHandle}` : '#';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Terjadi kesalahan saat mengirim pesan.');
      }

      setSuccess(true);
      setFormData({
        nama: '',
        email: '',
        telepon: '',
        subjek: '',
        kategori_hukum: 'Umum',
        pesan: '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal mengirim formulir. Silakan hubungi langsung via WhatsApp.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontak" className="py-14 sm:py-24 bg-[#faf9f8] relative border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-rose-50 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 border border-rose-200/80">
            <Phone className="w-3.5 h-3.5" /> Ruang Aspirasi & Sekretariat
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Sampaikan Aspirasi & Hubungi Kami
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 sm:mt-4 mb-3 sm:mb-4 rounded-full" />
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            Sampaikan aspirasi, aduan kesejahteraan mahasiswa, permohonan kajian isu hukum, atau kerjasama kegiatan bersama pengurus organisasi.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Column: Official Contact Channels */}
          {/* Left Column: Official Contact Channels */}
          <ScrollReveal animation="left" delay={100} className="lg:col-span-5 space-y-3.5">
            
            {/* WhatsApp Hotline Card */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target group flex items-start sm:items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-emerald-50/80 via-white to-white rounded-2xl sm:rounded-3xl border border-emerald-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 hover:from-emerald-50 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5 sm:mt-0 relative">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block">
                      Hotline WhatsApp 24 Jam
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium hidden xs:inline">
                      Respon Cepat
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold font-mono text-slate-900 group-hover:text-emerald-700 transition-colors break-words leading-snug">
                    {settings.whatsapp || '+62 812-3456-7890'}
                  </p>
                  <span className="text-[11px] text-slate-500 block leading-snug mt-0.5">
                    Layanan aduan &amp; advokasi langsung via chat WA
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shrink-0 ml-3 self-center shadow-2xs">
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target group flex items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-pink-300 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-sm shadow-pink-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5 sm:mt-0">
                  <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full inline-block border border-pink-200/60">
                      Instagram Resmi
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium hidden xs:inline">
                      Kabar &amp; Rilis
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors break-words leading-snug">
                    @{cleanIgHandle || 'bemfh.official'}
                  </p>
                  <span className="text-[11px] text-slate-500 block leading-snug mt-0.5">
                    Kabar kegiatan, rilis pers &amp; visual infografis hukum
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 group-hover:bg-pink-50 group-hover:text-pink-600 group-hover:border-pink-200 transition-all shrink-0 ml-3 self-center shadow-2xs">
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${settings.email}`}
              className="touch-target group flex items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-600/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5 sm:mt-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block border border-blue-200/60">
                      Email Sekretariat
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium hidden xs:inline">
                      Persuratan Resmi
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors break-all leading-snug">
                    {settings.email || 'aspirasi@bemfh-organisasi.id'}
                  </p>
                  <span className="text-[11px] text-slate-500 block leading-snug mt-0.5">
                    Korespondensi resmi, proposal kerjasama &amp; audiensi
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shrink-0 ml-3 self-center shadow-2xs">
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>

            {/* Secretariat Address Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-2xs">
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-maroon-800 to-maroon-950 text-amber-300 shadow-sm shadow-maroon-900/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-maroon-800 bg-rose-50 border border-rose-200/70 px-2.5 py-0.5 rounded-full inline-block">
                      Kantor Sekretariat
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium hidden xs:inline">
                      Rumah Aspirasi Mahasiswa
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
                    {settings.alamat || 'Gedung Student Center Lt. 2, Fakultas Hukum, Kampus Universitas'}
                  </h4>

                  {settings.jam_operasional && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-2.5 pt-2.5 border-t border-slate-100">
                      <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-maroon-800 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] sm:text-xs text-slate-600 leading-tight">
                        {settings.jam_operasional}
                      </span>
                    </div>
                  )}

                  {settings.maps_url && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100/80">
                      <a
                        href={settings.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="touch-target inline-flex items-center gap-1.5 text-xs font-bold text-maroon-800 hover:text-maroon-950 transition-colors group cursor-pointer"
                      >
                        <span>Buka Petunjuk Arah di Google Maps</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </ScrollReveal>

          {/* Right Column: Clean Online Consultation Form */}
          <ScrollReveal animation="right" delay={140} className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-5 sm:p-10 border border-slate-200/80 shadow-md">
              <div className="flex items-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 text-maroon-800 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900">
                  Formulir Aspirasi &amp; Aduan Mahasiswa
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8">
                Sampaikan aspirasi, aduan kesejahteraan/UKT, atau ide program kerja Anda. Pengurus BEM FH akan menelaah dan segera merespon.
              </p>

              {success && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Aspirasi Berhasil Terkirim</h4>
                    <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                      Terima kasih. Pesan dan aspirasi Anda telah tercatat dan akan segera ditindaklanjuti oleh pengurus BEM FH.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nama Lengkap <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Nama lengkap mahasiswa"
                      className="touch-target w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      No. WhatsApp / Telepon <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      placeholder="08123456789"
                      className="touch-target w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Alamat Email (Opsional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@email.com"
                      className="touch-target w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Kategori Aspirasi / Keperluan
                    </label>
                    <select
                      value={formData.kategori_hukum}
                      onChange={(e) => setFormData({ ...formData, kategori_hukum: e.target.value })}
                      className="touch-target w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all"
                    >
                      <option value="Aspirasi & Kebijakan Kampus">Aspirasi & Kebijakan Kampus</option>
                      <option value="Advokasi UKT & Kesejahteraan">Advokasi UKT & Kesejahteraan Mahasiswa</option>
                      <option value="Kajian Isu Hukum & Diskusi">Kajian Isu Hukum & Diskusi Publik</option>
                      <option value="Peradilan Semu & Lomba">Peradilan Semu (Moot Court) & Debat</option>
                      <option value="Kerjasama & Sponsorship">Kerjasama & Sponsorship</option>
                      <option value="Umum">Lainnya / Umum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pokok Aspirasi / Subjek <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subjek}
                    onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                    placeholder="Contoh: Advokasi Permohonan Banding UKT Semester Ganjil"
                    className="touch-target w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Uraian Aspirasi / Aduan Mahasiswa <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.pesan}
                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                    placeholder="Jelaskan aspirasi, kendala akademik/fasilitas, atau usulan kegiatan Anda secara rinci..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="touch-target w-full py-4 px-6 bg-gradient-to-r from-maroon-900 to-maroon-800 hover:from-maroon-800 hover:to-maroon-700 text-white rounded-full font-bold text-sm sm:text-base shadow-lg shadow-maroon-950/15 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sedang Mengirim...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>Kirim Aspirasi / Aduan Sekarang</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-3">
                    Identitas dan kerahasiaan aduan mahasiswa terjamin aman dan terlindungi oleh organisasi.
                  </p>
                </div>
              </form>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}
