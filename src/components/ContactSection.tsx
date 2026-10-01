'use client';

import React, { useState } from 'react';
import { SiteSettings } from '@/lib/types';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
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
    <section id="kontak" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-rose-50/40 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="up" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-maroon-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Phone className="w-3.5 h-3.5" /> Kontak & Sekretariat
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Tim Bantuan Hukum
          </h2>
          <div className="w-16 h-1 bg-maroon-800 mx-auto mt-3 mb-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base">
            Kami siap mendengar, mengkaji, dan mendampingi permasalahan hukum Anda dengan prinsip kerahasiaan dan integritas.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Official Contact Channels */}
          <ScrollReveal animation="left" delay={100} className="lg:col-span-5 space-y-4">
            
            {/* WhatsApp Card */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target group block bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-maroon-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 block">
                    WhatsApp Layanan Publik
                  </span>
                  <p className="text-base font-bold text-slate-900 truncate">
                    {settings.whatsapp || '+62 812-3456-7890'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Respon cepat untuk aduan & darurat hukum
                  </p>
                </div>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target group block bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-maroon-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs uppercase font-bold tracking-wider text-pink-600 block">
                    Instagram Resmi
                  </span>
                  <p className="text-base font-bold text-slate-900 truncate">
                    @{cleanIgHandle || 'organisasihukum'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Informasi publikasi edukasi & rilis pers
                  </p>
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${settings.email}`}
              className="touch-target group block bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-maroon-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs uppercase font-bold tracking-wider text-blue-600 block">
                    Surat Elektronik (Email)
                  </span>
                  <p className="text-base font-bold text-slate-900 truncate">
                    {settings.email || 'kontak@organisasihukum.org'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Korespondensi resmi, permohonan kerjasama & perkara
                  </p>
                </div>
              </div>
            </a>

            {/* Secretariat Address Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-maroon-50 text-maroon-800 border border-rose-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-maroon-800 block mb-1">
                    Alamat Sekretariat
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {settings.alamat}
                  </p>

                  {settings.jam_operasional && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-maroon-700 shrink-0" />
                      <span>{settings.jam_operasional}</span>
                    </div>
                  )}

                  {settings.maps_url && (
                    <a
                      href={settings.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="touch-target inline-flex items-center gap-1.5 text-xs font-bold text-maroon-800 hover:underline mt-2"
                    >
                      Buka di Google Maps &rarr;
                    </a>
                  )}
                </div>
              </div>
            </div>

          </ScrollReveal>

          {/* Right Column: Online Consultation & Message Form */}
          <ScrollReveal animation="right" delay={140} className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-maroon-800" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Formulir Konsultasi & Pengaduan Kasus
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Sampaikan pokok persoalan hukum Anda. Tim advokat kami akan memverifikasi dan menghubungi Anda kembali.
            </p>

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Pesan Berhasil Dikirim</h4>
                  <p className="text-xs mt-0.5">
                    Terima kasih. Permohonan Anda telah tercatat di sistem kami dan akan segera ditindaklanjuti oleh advokat piket.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
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
                    placeholder="Nama sesuai KTP"
                    className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition-all"
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
                    placeholder="Contoh: 08123456789"
                    className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition-all"
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
                    className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kategori Bidang Hukum
                  </label>
                  <select
                    value={formData.kategori_hukum}
                    onChange={(e) => setFormData({ ...formData, kategori_hukum: e.target.value })}
                    className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition-all bg-white"
                  >
                    <option value="Umum">Umum / Lainnya</option>
                    <option value="Perkara Pidana">Perkara Pidana</option>
                    <option value="Perkara Perdata">Perkara Perdata & Waris</option>
                    <option value="Sengketa Agraria / Tanah">Sengketa Agraria / Tanah</option>
                    <option value="Ketenagakerjaan / Buruh">Ketenagakerjaan & PHK</option>
                    <option value="Perlindungan Perempuan & Anak">Perlindungan Perempuan & Anak</option>
                    <option value="Konsumen & Pinjol">Konsumen & Pinjol Ilegal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subjek Perkara / Permohonan <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subjek}
                  onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                  placeholder="Contoh: Konsultasi Sengketa Batas Tanah Warisan"
                  className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kronologi Singkat & Uraian Masalah <span className="text-rose-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  placeholder="Ceritakan gambaran singkat kronologi kejadian, pihak yang terlibat, dan bantuan yang diharapkan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="touch-target w-full py-3.5 px-6 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Sedang Mengirim...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>Kirim Permohonan Konsultasi</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2.5">
                  Data yang Anda sampaikan dijamin kerahasiaannya sesuai kode etik bantuan hukum.
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
