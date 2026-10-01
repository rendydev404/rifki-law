'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { OrganizationData, SiteSettings, Pengurus, Kegiatan, Galeri, PesanKontak } from '@/lib/types';
import ImageUpload from '@/components/ImageUpload';
import ThemeApplicator from '@/components/ThemeApplicator';
import {
  COLOR_PRESETS,
  BODY_FONT_OPTIONS,
  HEADING_FONT_OPTIONS,
  generatePalette,
} from '@/lib/theme-utils';
import {
  Scale, Lock, LogOut, Save, Plus, Trash2, Edit3, ExternalLink,
  CheckCircle2, AlertCircle, Loader2, Home, BookOpen, Users,
  Calendar, Camera, Phone, Mail, MessageSquare, Database, Copy, Check,
  LayoutGrid, X, ChevronRight, Palette, Type, Sparkles, RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const [session, setSession] = useState<{ email: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Data state
  const [data, setData] = useState<OrganizationData | null>(null);
  const [activeTab, setActiveTab] = useState<'beranda' | 'tema' | 'tentang' | 'pengurus' | 'kegiatan' | 'galeri' | 'kontak' | 'pesan' | 'database'>('beranda');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Form states for modals/edits
  const [editingPengurus, setEditingPengurus] = useState<Pengurus | null>(null);
  const [editingKegiatan, setEditingKegiatan] = useState<Kegiatan | null>(null);
  const [editingGaleri, setEditingGaleri] = useState<Galeri | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [customBodyFontInput, setCustomBodyFontInput] = useState('');
  const [customHeadingFontInput, setCustomHeadingFontInput] = useState('');

  // Check auth session
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user?.email) {
          setSession({ email: currentSession.user.email });
        } else {
          // Check local stored session flag as fallback
          const localAuth = localStorage.getItem('law_admin_auth');
          if (localAuth) {
            setSession({ email: localAuth });
          }
        }
      } catch (err) {
        console.warn('Auth check error:', err);
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch full data
  const loadData = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Gagal memuat data:', err);
    }
  };

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      // 1. Try Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!authError && authData.session?.user?.email) {
        setSession({ email: authData.session.user.email });
        localStorage.setItem('law_admin_auth', authData.session.user.email);
        showToast('success', 'Berhasil masuk ke Portal Admin');
        return;
      }

      // 2. Default credentials check for fast fallback
      if (email === 'admin@organisasihukum.id' && password === 'AdminHukum2026!') {
        setSession({ email });
        localStorage.setItem('law_admin_auth', email);
        showToast('success', 'Berhasil masuk sebagai Administrator');
        return;
      }

      throw new Error(authError?.message || 'Email atau kata sandi tidak valid');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError('Gagal masuk');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('law_admin_auth');
    setSession(null);
  };

  // 1. Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);

    try {
      localStorage.setItem('law_site_settings', JSON.stringify(data.settings));
      window.dispatchEvent(new CustomEvent('law_settings_updated', { detail: data.settings }));
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.settings),
      });

      if (!res.ok) throw new Error('Gagal menyimpan perubahan');
      showToast('success', 'Pengaturan berhasil diperbarui!');
      await loadData();
    } catch (err) {
      showToast('error', 'Terjadi kesalahan saat menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateThemeSetting = (updates: Partial<SiteSettings>) => {
    if (!data) return;
    const updatedSettings: SiteSettings = { ...data.settings, ...updates };
    setData({ ...data, settings: updatedSettings });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('law_settings_updated', { detail: updatedSettings }));
    }
  };

  const handleResetTheme = () => {
    if (!confirm('Kembalikan warna primer ke Marun Hukum (#800020) dan font ke bawaan?')) return;
    handleUpdateThemeSetting({
      primary_color: '#800020',
      font_family: 'Plus Jakarta Sans',
      font_heading: 'Playfair Display',
    });
    showToast('success', 'Tema dikembalikan ke setelan awal!');
  };

  // 2. Pengurus actions
  const handleSavePengurus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPengurus) return;
    setSaving(true);

    try {
      const res = await fetch('/api/pengurus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPengurus),
      });

      if (!res.ok) throw new Error('Gagal menyimpan pengurus');
      showToast('success', 'Data pengurus berhasil disimpan!');
      setEditingPengurus(null);
      await loadData();
    } catch (err) {
      showToast('error', 'Gagal menyimpan pengurus');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePengurus = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pengurus ini?')) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/pengurus/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus pengurus');
      showToast('success', 'Pengurus berhasil dihapus');
      await loadData();
    } catch (err) {
      showToast('error', 'Gagal menghapus pengurus');
    } finally {
      setSaving(false);
    }
  };

  // 3. Kegiatan actions
  const handleSaveKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKegiatan) return;
    setSaving(true);

    try {
      const res = await fetch('/api/kegiatan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingKegiatan),
      });

      if (!res.ok) throw new Error('Gagal menyimpan kegiatan');
      showToast('success', 'Data kegiatan/agenda berhasil disimpan!');
      setEditingKegiatan(null);
      await loadData();
    } catch (err) {
      showToast('error', 'Gagal menyimpan kegiatan');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKegiatan = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kegiatan ini?')) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/kegiatan/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus kegiatan');
      showToast('success', 'Kegiatan berhasil dihapus');
      await loadData();
    } catch (err) {
      showToast('error', 'Gagal menghapus kegiatan');
    } finally {
      setSaving(false);
    }
  };

  // 4. Galeri actions
  const handleSaveGaleri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGaleri) return;
    setSaving(true);

    try {
      const res = await fetch('/api/galeri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGaleri),
      });

      if (!res.ok) throw new Error('Gagal menyimpan foto');
      showToast('success', 'Foto galeri berhasil disimpan!');
      setEditingGaleri(null);
      await loadData();
    } catch (err) {
      showToast('error', 'Gagal menyimpan foto galeri');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGaleri = async (id: string) => {
    if (!confirm('Yakin ingin menghapus foto ini?')) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/galeri/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus foto');
      showToast('success', 'Foto berhasil dihapus');
      await loadData();
    } catch (err) {
      showToast('error', 'Gagal menghapus foto');
    } finally {
      setSaving(false);
    }
  };

  // 5. Pesan actions
  const handleUpdatePesanStatus = async (id: string, status: 'belum_dibaca' | 'diproses' | 'selesai') => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        showToast('success', `Status pesan diubah menjadi: ${status}`);
        await loadData();
      }
    } catch (err) {
      showToast('error', 'Gagal mengubah status pesan');
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          <span>Memeriksa autentikasi admin...</span>
        </div>
      </div>
    );
  }

  // Not logged in: Show Login Page
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-maroon-950 to-slate-900 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-rose-100">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-maroon-800 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Scale className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Portal Administrator BEM FH
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Masuk untuk mengelola seluruh konten landing page
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Administrator
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@organisasi.id"
                className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="touch-target w-full py-3 bg-maroon-800 hover:bg-maroon-900 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Masuk ke Panel Admin</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <Link href="/" className="text-xs text-slate-500 hover:text-maroon-800 font-semibold inline-flex items-center gap-1">
              &larr; Kembali ke Beranda Landing Page
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Logged in: Main Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-100 pb-28 sm:pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-in slide-in-from-top-4 duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-800 text-white'
              : 'bg-rose-800 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-300" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-maroon-950 text-white border-b border-maroon-900 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-maroon-800 text-amber-300 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold leading-tight flex items-center gap-1.5 sm:gap-2">
                  <span className="truncate">CMS Organisasi Mahasiswa</span>
                  {data?.isSupabaseConnected ? (
                    <span className="text-[10px] bg-emerald-600/80 text-white px-2 py-0.5 rounded-full font-normal shrink-0">
                      <span className="hidden xs:inline">Supabase Cloud</span>
                      <span className="xs:hidden">Cloud</span>
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-500/80 text-amber-950 px-2 py-0.5 rounded-full font-bold shrink-0">
                      <span className="hidden xs:inline">Local Sync</span>
                      <span className="xs:hidden">Local</span>
                    </span>
                  )}
                </h1>
                <p className="text-[11px] text-rose-200/80 truncate max-w-[170px] xs:max-w-xs sm:max-w-md">
                  {session.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                target="_blank"
                className="touch-target px-3 py-1.5 rounded-lg bg-maroon-900 hover:bg-maroon-800 text-rose-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Lihat Landing Page Langsung"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pratinjau Web</span>
              </Link>

              <button
                onClick={handleLogout}
                type="button"
                className="touch-target px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Desktop only: md:flex) */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto pb-2.5 pt-1.5 no-scrollbar border-t border-maroon-900/60">
            <button
              onClick={() => setActiveTab('beranda')}
              className={`touch-target shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'beranda'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-rose-200/70 hover:text-white hover:bg-maroon-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" /> Beranda &amp; Slogan
            </button>

            <button
              onClick={() => setActiveTab('tema')}
              className={`touch-target shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'tema'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-rose-200/70 hover:text-white hover:bg-maroon-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-300" /> Warna &amp; Font (Tema)
            </button>

            <button
              onClick={() => setActiveTab('tentang')}
              className={`touch-target shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'tentang'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-rose-200/70 hover:text-white hover:bg-maroon-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Sejarah &amp; Visi Misi
            </button>

            <button
              onClick={() => setActiveTab('pengurus')}
              className={`touch-target shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'pengurus'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-rose-200/70 hover:text-white hover:bg-maroon-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Struktur Pengurus ({data?.pengurus?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('kegiatan')}
              className={`touch-target shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'kegiatan'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-rose-200/70 hover:text-white hover:bg-maroon-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Kegiatan & Agenda ({data?.kegiatan?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('galeri')}
              className={`touch-target shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'galeri'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-rose-200/70 hover:text-white hover:bg-maroon-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Galeri Foto ({data?.galeri?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('kontak')}
              className={`touch-target shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'kontak'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-rose-200/70 hover:text-white hover:bg-maroon-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> Kontak & Alamat
            </button>

            <button
              onClick={() => setActiveTab('pesan')}
              className={`touch-target shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'pesan'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-rose-200/70 hover:text-white hover:bg-maroon-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Pesan Masuk ({data?.pesan?.filter(p => p.status === 'belum_dibaca').length || 0})
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`touch-target shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'database'
                  ? 'bg-maroon-800 text-white shadow-xs'
                  : 'text-amber-300 hover:text-white hover:bg-maroon-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" /> Supabase SQL
            </button>
          </div>
        </div>

        {/* Mobile Current Active Tab Indicator Bar */}
        <div className="md:hidden bg-maroon-900/90 px-4 py-2 flex items-center justify-between text-xs text-rose-100 border-t border-maroon-900/80">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="font-medium text-rose-200/80">Menu:</span>
            <span className="font-bold text-white uppercase tracking-wider text-[11px] truncate">
              {activeTab === 'beranda' && 'Beranda & Slogan'}
              {activeTab === 'tema' && 'Tema: Warna & Font'}
              {activeTab === 'tentang' && 'Sejarah & Visi Misi'}
              {activeTab === 'pengurus' && 'Struktur Pengurus'}
              {activeTab === 'kegiatan' && 'Kegiatan & Agenda'}
              {activeTab === 'galeri' && 'Galeri Dokumentasi'}
              {activeTab === 'kontak' && 'Kontak & Alamat'}
              {activeTab === 'pesan' && 'Kotak Masuk Aduan'}
              {activeTab === 'database' && 'Supabase Database'}
            </span>
          </div>
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            type="button"
            className="touch-target text-[11px] bg-maroon-800/90 hover:bg-maroon-700 active:bg-maroon-700 px-3 py-1 rounded-lg font-bold text-amber-300 flex items-center gap-1 shrink-0 ml-2"
          >
            <span>Semua Menu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Admin Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {!data ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-maroon-800 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Memuat data organisasi...</p>
          </div>
        ) : (
          <div>
            {/* Live Theme Injected for Realtime Preview */}
            <ThemeApplicator settings={data.settings} />

            {/* ========================================================
                TAB 1: BERANDA & IDENTITAS
            ======================================================== */}
            {activeTab === 'beranda' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                      1. Beranda: Logo, Nama, Slogan & Sambutan
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kelola identitas utama organisasi mahasiswa yang tampil di header, footer, dan beranda.
                    </p>
                  </div>

                  {/* Dedicated Logo & Brand Visual Card */}
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-rose-50/70 to-slate-50 rounded-2xl border border-rose-200/80 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-maroon-800 bg-rose-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                          Identitas Visual Utama
                        </span>
                        <h3 className="text-base font-bold text-slate-900">
                          Logo Resmi Organisasi Mahasiswa
                        </h3>
                        <p className="text-xs text-slate-500">
                          Tampil di Navbar atas, Footer, dan profil resmi organisasi.
                        </p>
                      </div>

                      {/* Instant Save Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          setSaving(true);
                          try {
                            localStorage.setItem('law_site_settings', JSON.stringify(data.settings));
                            window.dispatchEvent(new CustomEvent('law_settings_updated', { detail: data.settings }));
                            const res = await fetch('/api/settings', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(data.settings),
                            });
                            if (!res.ok) throw new Error('Gagal');
                            showToast('success', 'Logo & Identitas berhasil disimpan ke website!');
                          } catch (err) {
                            showToast('error', 'Gagal menyimpan logo');
                          } finally {
                            setSaving(false);
                          }
                        }}
                        disabled={saving}
                        className="touch-target px-4 py-2 bg-maroon-800 hover:bg-maroon-900 active:bg-maroon-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Save className="w-3.5 h-3.5 text-amber-300" />
                        <span>{saving ? 'Menyimpan...' : 'Simpan Logo Sekarang'}</span>
                      </button>
                    </div>

                    {/* Live Navbar Mockup Preview */}
                    <div className="mb-4 p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Pratinjau Tampilan Header Navbar:
                      </span>
                      <div className="flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                        {data.settings.logo_url ? (
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={data.settings.logo_url}
                              alt="Pratinjau Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-950 flex items-center justify-center text-amber-300 shadow-sm shrink-0">
                            <Scale className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {data.settings.org_name || 'Badan Eksekutif Mahasiswa Fakultas Hukum'}
                          </p>
                          <p className="text-[11px] text-maroon-800 font-medium truncate">
                            Organisasi Mahasiswa Fakultas Hukum
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ImageUpload with isLogo and immediate auto-save */}
                    <ImageUpload
                      label="Unggah / Ganti Logo (PNG Transparan / SVG / JPG)"
                      value={data.settings.logo_url}
                      onChange={async (url) => {
                        const newSettings = { ...data.settings, logo_url: url };
                        setData({
                          ...data,
                          settings: newSettings
                        });
                        try {
                          localStorage.setItem('law_site_settings', JSON.stringify(newSettings));
                          window.dispatchEvent(new CustomEvent('law_settings_updated', { detail: newSettings }));
                          const res = await fetch('/api/settings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newSettings),
                          });
                          if (res.ok) {
                            showToast('success', 'Logo berhasil diperbarui dan diterapkan ke header website!');
                          }
                        } catch (e) {
                          console.warn('Auto-save logo error:', e);
                        }
                      }}
                      isLogo={true}
                      helperText="Pilih file logo dari galeri HP atau komputer. Format PNG atau SVG transparan direkomendasikan."
                    />

                    {/* 1-Click Reset to Default Scale Emblem */}
                    {data.settings.logo_url && (
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={async () => {
                            const newSettings = { ...data.settings, logo_url: '' };
                            setData({
                              ...data,
                              settings: newSettings
                            });
                            try {
                              localStorage.setItem('law_site_settings', JSON.stringify(newSettings));
                              window.dispatchEvent(new CustomEvent('law_settings_updated', { detail: newSettings }));
                              await fetch('/api/settings', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newSettings),
                              });
                              showToast('success', 'Logo dihapus, kembali ke ikon timbangan default.');
                            } catch (e) {}
                          }}
                          className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline underline-offset-2 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Logo (Gunakan Ikon Timbangan Default)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nama Organisasi Mahasiswa
                      </label>
                      <input
                        type="text"
                        required
                        value={data.settings.org_name}
                        onChange={(e) => setData({
                          ...data,
                          settings: { ...data.settings, org_name: e.target.value }
                        })}
                        className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Badge Hero / Label Kehormatan
                      </label>
                      <input
                        type="text"
                        value={data.settings.hero_badge}
                        onChange={(e) => setData({
                          ...data,
                          settings: { ...data.settings, hero_badge: e.target.value }
                        })}
                        className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Slogan Resmi Organisasi
                    </label>
                    <input
                      type="text"
                      required
                      value={data.settings.slogan}
                      onChange={(e) => setData({
                        ...data,
                        settings: { ...data.settings, slogan: e.target.value }
                      })}
                      className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 font-serif italic"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ucapan Selamat Datang (Judul Sambutan)
                    </label>
                    <input
                      type="text"
                      required
                      value={data.settings.welcome_title}
                      onChange={(e) => setData({
                        ...data,
                        settings: { ...data.settings, welcome_title: e.target.value }
                      })}
                      className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 font-bold"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Subjudul / Penjelasan Sambutan Singkat
                    </label>
                    <textarea
                      rows={3}
                      value={data.settings.welcome_subtitle}
                      onChange={(e) => setData({
                        ...data,
                        settings: { ...data.settings, welcome_subtitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    />
                  </div>

                  {/* CTA Buttons & Custom Links Management */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      Kustomisasi Tombol Aksi & Link Beranda (CTA)
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Ubah label teks dan URL tautan tombol utama beranda sesuai keinginan Anda.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-maroon-800 uppercase tracking-wider block mb-3">
                          Tombol Utama (Primary CTA)
                        </span>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Teks Tombol Utama
                            </label>
                            <input
                              type="text"
                              value={data.settings.cta_primary_label || ''}
                              onChange={(e) => setData({
                                ...data,
                                settings: { ...data.settings, cta_primary_label: e.target.value }
                              })}
                              placeholder="Ajukan Permohonan Bantuan"
                              className="touch-target w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-maroon-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Link URL Tombol Utama
                            </label>
                            <input
                              type="text"
                              value={data.settings.cta_primary_url || ''}
                              onChange={(e) => setData({
                                ...data,
                                settings: { ...data.settings, cta_primary_url: e.target.value }
                              })}
                              placeholder="Kosongkan untuk otomatis ke WhatsApp Hotline, atau isi URL lain"
                              className="touch-target w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono focus:ring-2 focus:ring-maroon-800"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                          Tombol Kedua (Secondary CTA)
                        </span>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Teks Tombol Kedua
                            </label>
                            <input
                              type="text"
                              value={data.settings.cta_secondary_label || ''}
                              onChange={(e) => setData({
                                ...data,
                                settings: { ...data.settings, cta_secondary_label: e.target.value }
                              })}
                              placeholder="Lihat Kegiatan Terbaru"
                              className="touch-target w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-maroon-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Link URL Tombol Kedua
                            </label>
                            <input
                              type="text"
                              value={data.settings.cta_secondary_url || ''}
                              onChange={(e) => setData({
                                ...data,
                                settings: { ...data.settings, cta_secondary_url: e.target.value }
                              })}
                              placeholder="#kegiatan"
                              className="touch-target w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono focus:ring-2 focus:ring-maroon-800"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Foto Hero Banner Beranda */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <ImageUpload
                      label="Foto Hero Banner Beranda (Latar Utama)"
                      value={data.settings.hero_image_url}
                      onChange={(url) => setData({
                        ...data,
                        settings: { ...data.settings, hero_image_url: url }
                      })}
                      helperText="Foto aksi mahasiswa, peradilan semu (moot court), atau kegiatan kampus resolusi tajam."
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="touch-target px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-sm font-bold shadow-sm flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Beranda'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ========================================================
                TAB: WARNA & TIPOGRAFI (TEMA)
            ======================================================== */}
            {activeTab === 'tema' && (
              <div className="space-y-8">
                {/* Header card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-1.5 rounded-lg bg-rose-100 text-maroon-800">
                          <Palette className="w-5 h-5" />
                        </span>
                        <h2 className="text-xl font-bold text-slate-900">
                          Kustomisasi Tema, Warna &amp; Font Bebas
                        </h2>
                      </div>
                      <p className="text-xs text-slate-500 max-w-2xl">
                        Atur warna primer organisasi mahasiswa dan pilih jenis font teks utama serta font judul. Perubahan langsung aktif di seluruh website tanpa merusak struktur layout.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleResetTheme}
                        className="touch-target px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Kembalikan ke warna dan font awal"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reset Default</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="touch-target px-5 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 text-amber-300" />
                        <span>{saving ? 'Menyimpan...' : 'Simpan Tema'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. SELEKTOR WARNA PRIMER */}
                  <div className="mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>1. Warna Primer Organisasi</span>
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                            {data.settings.primary_color || '#800020'}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Warna ini diterapkan pada navbar, tombol CTA, aksen border, gradien hero, dan kartu penting.
                        </p>
                      </div>

                      {/* Custom Color Picker Swatch */}
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="color"
                            value={data.settings.primary_color || '#800020'}
                            onChange={(e) => handleUpdateThemeSetting({ primary_color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                            aria-label="Pilih Warna Kustom"
                          />
                          <span className="text-xs font-medium text-slate-700">Pilih Warna Bebas:</span>
                        </label>
                        <input
                          type="text"
                          value={data.settings.primary_color || '#800020'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.startsWith('#') || val.length <= 7) {
                              handleUpdateThemeSetting({ primary_color: val });
                            }
                          }}
                          placeholder="#800020"
                          maxLength={7}
                          className="w-20 px-2 py-1 text-xs font-mono font-bold uppercase rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                      {COLOR_PRESETS.map((preset) => {
                        const isSelected = (data.settings.primary_color || '#800020').toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleUpdateThemeSetting({ primary_color: preset.hex })}
                            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                              isSelected
                                ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-sm bg-slate-50/80'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className="w-6 h-6 rounded-full border border-black/10 shadow-xs shrink-0"
                                style={{ backgroundColor: preset.hex }}
                              />
                              {isSelected && (
                                <span className="text-[10px] font-bold text-slate-900 bg-slate-200/80 px-1.5 py-0.5 rounded-full">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {preset.name}
                              </div>
                              <div className="text-[10px] font-mono text-slate-500 mb-1">
                                {preset.hex}
                              </div>
                              <div className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                {preset.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic Palette Spectrum generated automatically */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Spektrum 11 Tingkat Shading Otomatis (Tailwind Shades 50 - 950)</span>
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Dihitung proporsional secara matematis (HSL L-Scale)
                        </span>
                      </div>
                      <div className="grid grid-cols-11 gap-1 h-9 rounded-lg overflow-hidden border border-slate-200">
                        {Object.entries(generatePalette(data.settings.primary_color || '#800020')).map(([step, hex]) => (
                          <div
                            key={step}
                            className="group relative flex flex-col items-center justify-end pb-1 text-[9px] font-mono cursor-pointer transition-transform hover:scale-105"
                            style={{ backgroundColor: hex }}
                            title={`Shade ${step}: ${hex}`}
                          >
                            <span className={`opacity-0 group-hover:opacity-100 transition-opacity font-bold ${
                              parseInt(step) > 400 ? 'text-white' : 'text-slate-900'
                            }`}>
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                        <span>50 (Paling Terang)</span>
                        <span>500 (Medium)</span>
                        <span>800 (Base)</span>
                        <span>950 (Paling Gelap)</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. TIPOGRAFI - FONT TEKS UTAMA (BODY) */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Type className="w-4 h-4 text-maroon-800" />
                          <span>2. Font Teks Utama &amp; Paragraf (Body Font)</span>
                          <span className="text-[10px] font-semibold bg-rose-50 text-maroon-800 px-2 py-0.5 rounded-md border border-rose-200">
                            {data.settings.font_family || 'Plus Jakarta Sans'}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Digunakan untuk seluruh narasi, isi berita, biodata pengurus, form kontak, dan navigasi.
                        </p>
                      </div>

                      {/* Custom Font Input */}
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          value={customBodyFontInput}
                          onChange={(e) => setCustomBodyFontInput(e.target.value)}
                          placeholder="Ketik Google Font lain..."
                          className="w-40 sm:w-48 px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customBodyFontInput.trim()) {
                              handleUpdateThemeSetting({ font_family: customBodyFontInput.trim() });
                              setCustomBodyFontInput('');
                              showToast('success', `Font body diubah menjadi: ${customBodyFontInput.trim()}`);
                            }
                          }}
                          className="touch-target px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Terapkan
                        </button>
                      </div>
                    </div>

                    {/* Presets Grid for Body Font */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {BODY_FONT_OPTIONS.map((f) => {
                        const isSelected = (data.settings.font_family || 'Plus Jakarta Sans').toLowerCase() === f.name.toLowerCase();
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleUpdateThemeSetting({ font_family: f.name })}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-maroon-800 ring-2 ring-maroon-800/15 bg-rose-50/40 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-900" style={{ fontFamily: f.name }}>
                                {f.name}
                              </span>
                              {isSelected && (
                                <span className="text-[9px] font-bold text-maroon-800 bg-rose-100 px-1.5 py-0.5 rounded-full">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 mb-2">
                              {f.description}
                            </p>
                            <p
                              className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-1 italic"
                              style={{ fontFamily: f.name }}
                            >
                              Keadilan bagi seluruh rakyat Indonesia
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. TIPOGRAFI - FONT JUDUL & HEADING */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Type className="w-4 h-4 text-maroon-800" />
                          <span>3. Font Judul &amp; Display (Heading Font)</span>
                          <span className="text-[10px] font-semibold bg-rose-50 text-maroon-800 px-2 py-0.5 rounded-md border border-rose-200">
                            {data.settings.font_heading || 'Playfair Display'}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Digunakan untuk judul hero banner, headline seksi, nama organisasi, dan kartu apresiasi.
                        </p>
                      </div>

                      {/* Custom Heading Font Input */}
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          value={customHeadingFontInput}
                          onChange={(e) => setCustomHeadingFontInput(e.target.value)}
                          placeholder="Ketik Google Font judul..."
                          className="w-40 sm:w-48 px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-maroon-800 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customHeadingFontInput.trim()) {
                              handleUpdateThemeSetting({ font_heading: customHeadingFontInput.trim() });
                              setCustomHeadingFontInput('');
                              showToast('success', `Font judul diubah menjadi: ${customHeadingFontInput.trim()}`);
                            }
                          }}
                          className="touch-target px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Terapkan
                        </button>
                      </div>
                    </div>

                    {/* Presets Grid for Heading Font */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {HEADING_FONT_OPTIONS.map((f) => {
                        const isSelected = (data.settings.font_heading || 'Playfair Display').toLowerCase() === f.name.toLowerCase();
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleUpdateThemeSetting({ font_heading: f.name })}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-maroon-800 ring-2 ring-maroon-800/15 bg-rose-50/40 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-900" style={{ fontFamily: f.name }}>
                                {f.name}
                              </span>
                              {isSelected && (
                                <span className="text-[9px] font-bold text-maroon-800 bg-rose-100 px-1.5 py-0.5 rounded-full">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 mb-2">
                              {f.description}
                            </p>
                            <p
                              className="text-xs text-slate-900 font-bold bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-1"
                              style={{ fontFamily: f.name }}
                            >
                              Fiat Justitia Ruat Caelum
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. PRATINJAU LANGSUNG (LIVE INTERACTIVE PREVIEW) */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>4. Pratinjau Komponen Langsung (Live Visual Preview)</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Berikut simulasi nyata bagaimana font dan warna yang Anda pilih tampil pada komponen web:
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        Live Rendered
                      </span>
                    </div>

                    <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
                      {/* Mini Hero Header Card */}
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 text-white shadow-md relative overflow-hidden">
                        <div className="relative z-10 max-w-xl">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
                            Simulasi Hero Beranda
                          </span>
                          <h4
                            className="text-xl sm:text-2xl font-bold leading-tight mb-2 text-white"
                            style={{ fontFamily: data.settings.font_heading || 'Playfair Display' }}
                          >
                            {data.settings.org_name || 'BEM Fakultas Hukum'}
                          </h4>
                          <p
                            className="text-xs text-rose-100/90 leading-relaxed mb-4"
                            style={{ fontFamily: data.settings.font_family || 'Plus Jakarta Sans' }}
                          >
                            {data.settings.slogan || 'Integritas, Keadilan, dan Perjuangan Mahasiswa Hukum'}
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-maroon-950 font-bold text-xs shadow-xs">
                              {data.settings.cta_primary_label || 'Konsultasi Hukum'}
                            </span>
                            <span className="px-3.5 py-1.5 rounded-lg border border-white/30 text-white text-xs font-semibold backdrop-blur-xs">
                              {data.settings.cta_secondary_label || 'Agenda Proker'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Component Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Sample Card 1 */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-800 bg-rose-50 px-2 py-0.5 rounded-md inline-block mb-1">
                            Aksen Tombol &amp; Border
                          </span>
                          <h5
                            className="text-sm font-bold text-slate-900 mb-1"
                            style={{ fontFamily: data.settings.font_heading || 'Playfair Display' }}
                          >
                            Seminar Nasional 2026
                          </h5>
                          <p
                            className="text-xs text-slate-600 mb-3"
                            style={{ fontFamily: data.settings.font_family || 'Plus Jakarta Sans' }}
                          >
                            Kajian kritis reformasi hukum dan peradilan konstitusi.
                          </p>
                          <button
                            type="button"
                            className="w-full py-1.5 rounded-lg bg-maroon-800 text-white text-xs font-bold"
                          >
                            Daftar Sekarang
                          </button>
                        </div>

                        {/* Sample Card 2 */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md inline-block mb-1">
                            Kutipan / Motto
                          </span>
                          <blockquote
                            className="text-xs text-slate-800 border-l-2 border-maroon-800 pl-2.5 py-1 my-2 italic font-serif"
                            style={{ fontFamily: data.settings.font_heading || 'Playfair Display' }}
                          >
                            &ldquo;Hukum tidak pernah tidur untuk mereka yang gigih memperjuangkan keadilan.&rdquo;
                          </blockquote>
                          <p
                            className="text-[10px] text-slate-500"
                            style={{ fontFamily: data.settings.font_family || 'Plus Jakarta Sans' }}
                          >
                            Bidang Advokasi &amp; Hak Asasi Manusia
                          </p>
                        </div>

                        {/* Sample Card 3 */}
                        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mb-1">
                              Status Keaktifan
                            </span>
                            <h5
                              className="text-sm font-bold text-slate-900 mb-1"
                              style={{ fontFamily: data.settings.font_heading || 'Playfair Display' }}
                            >
                              Konsultasi Terbuka
                            </h5>
                            <p
                              className="text-xs text-slate-600"
                              style={{ fontFamily: data.settings.font_family || 'Plus Jakarta Sans' }}
                            >
                              Layanan advokasi mahasiswa FH aktif setiap hari kerja.
                            </p>
                          </div>
                          <div className="pt-3">
                            <span className="text-xs font-bold text-maroon-800 hover:underline cursor-pointer inline-flex items-center gap-1">
                              Pelajari Selengkapnya &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button Footer */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      Klik tombol simpan di kanan untuk mempublikasikan tema ke pengunjung website.
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleResetTheme}
                        className="touch-target flex-1 sm:flex-none px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Reset Default
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="touch-target flex-1 sm:flex-none px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 text-amber-300" />
                        <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Tema'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 2: TENTANG KAMI (SEJARAH, VISI, MISI)
            ======================================================== */}
            {activeTab === 'tentang' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                      2. Tentang Kami: Sejarah, Visi & Misi
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Atur narasi sejarah perjuangan lembaga, visi jangka panjang, dan butir-butir misi.
                    </p>
                  </div>

                  {/* Sejarah */}
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Sejarah Organisasi
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={data.settings.sejarah}
                      onChange={(e) => setData({
                        ...data,
                        settings: { ...data.settings, sejarah: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 leading-relaxed"
                    />
                  </div>

                  {/* Visi */}
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Visi Organisasi
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={data.settings.visi}
                      onChange={(e) => setData({
                        ...data,
                        settings: { ...data.settings, visi: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 leading-relaxed font-serif italic"
                    />
                  </div>

                  {/* Misi (Dynamic array) */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Butir-butir Misi ({data.settings.misi?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newMisi = [...(data.settings.misi || []), ''];
                          setData({
                            ...data,
                            settings: { ...data.settings, misi: newMisi }
                          });
                        }}
                        className="touch-target px-3 py-1 bg-rose-50 text-maroon-800 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Butir Misi
                      </button>
                    </div>

                    <div className="space-y-3">
                      {data.settings.misi?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...data.settings.misi];
                              updated[idx] = e.target.value;
                              setData({
                                ...data,
                                settings: { ...data.settings, misi: updated }
                              });
                            }}
                            className="touch-target flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = data.settings.misi.filter((_, i) => i !== idx);
                              setData({
                                ...data,
                                settings: { ...data.settings, misi: updated }
                              });
                            }}
                            className="touch-target w-9 h-9 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center justify-center shrink-0"
                            title="Hapus butir ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="touch-target px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-sm font-bold shadow-sm flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Tentang Kami'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ========================================================
                TAB 3: STRUKTUR KEPENGURUSAN
            ======================================================== */}
            {activeTab === 'pengurus' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        3. Struktur Kepengurusan
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kelola susunan dewan pembina, pimpinan harian, dan ketua divisi advokasi.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingPengurus({
                        id: '',
                        nama: '',
                        gelar: '',
                        jabatan: '',
                        divisi: 'Pengurus Harian',
                        foto_url: '',
                        urutan: (data.pengurus?.length || 0) + 1,
                        bio: '',
                        kontak_email: '',
                        is_active: true,
                      })}
                      className="touch-target px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Tambah Pengurus Baru</span>
                    </button>
                  </div>

                  {/* Pengurus List Table / Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.pengurus?.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                              alt={item.nama}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-800 bg-rose-50 px-2 py-0.5 rounded-full inline-block mb-1">
                              {item.divisi}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {item.nama} {item.gelar}
                            </h4>
                            <p className="text-xs text-slate-600 truncate">{item.jabatan}</p>
                          </div>
                        </div>

                        {item.bio && (
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                            {item.bio}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                          <span className="text-[11px] text-slate-400">
                            Urutan: #{item.urutan}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingPengurus(item)}
                              className="touch-target p-1.5 text-slate-600 hover:text-maroon-800 hover:bg-slate-200 rounded-lg transition-colors"
                              title="Edit Pengurus"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePengurus(item.id)}
                              className="touch-target p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Pengurus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ========================================================
                TAB 4: KEGIATAN & AGENDA MENDATANG
            ======================================================== */}
            {activeTab === 'kegiatan' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        4. Kegiatan & Agenda Mendatang
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kelola arsip kegiatan yang telah terlaksana dan jadwal agenda peradilan/pelatihan mendatang.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingKegiatan({
                        id: '',
                        judul: '',
                        kategori: 'Advokasi',
                        tipe: 'kegiatan',
                        tanggal: new Date().toISOString().split('T')[0],
                        waktu: '09:00 WIB - Selesai',
                        lokasi: 'Sekretariat Utama',
                        deskripsi: '',
                        foto_url: '',
                        is_featured: false,
                        link_pendaftaran: '',
                      })}
                      className="touch-target px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Tambah Kegiatan / Agenda Baru</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.kegiatan?.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-maroon-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.foto_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=200&q=80'}
                              alt={item.judul}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                item.tipe === 'agenda'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900'
                              }`}>
                                {item.tipe === 'agenda' ? 'Agenda Mendatang' : 'Kegiatan Terlaksana'}
                              </span>
                              <span className="text-[10px] bg-rose-50 text-maroon-800 border border-rose-200 font-bold px-2 py-0.5 rounded-full">
                                {item.kategori}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                              {item.judul}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {item.tanggal} • {item.lokasi}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => setEditingKegiatan(item)}
                            className="touch-target p-2 text-slate-600 hover:text-maroon-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteKegiatan(item.id)}
                            className="touch-target p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ========================================================
                TAB 5: DOKUMENTASI GALERI FOTO
            ======================================================== */}
            {activeTab === 'galeri' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        5. Dokumentasi Foto & Galeri
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kelola dokumentasi foto kegiatan pendampingan dan persidangan pro bono.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingGaleri({
                        id: '',
                        judul: '',
                        deskripsi: '',
                        foto_url: '',
                        tanggal: new Date().toISOString().split('T')[0],
                        urutan: (data.galeri?.length || 0) + 1,
                      })}
                      className="touch-target px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 shrink-0"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>Tambah Foto Galeri</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.galeri?.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between group"
                      >
                        <div className="aspect-4/3 overflow-hidden bg-slate-200 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.foto_url}
                            alt={item.judul}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-bold text-slate-900 line-clamp-1">
                            {item.judul}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {item.tanggal}
                          </p>
                        </div>
                        <div className="p-2 border-t border-slate-200/80 flex items-center justify-between bg-white">
                          <span className="text-[10px] text-slate-400">#{item.urutan}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingGaleri(item)}
                              className="touch-target p-1 text-slate-600 hover:text-maroon-800"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGaleri(item.id)}
                              className="touch-target p-1 text-rose-600 hover:text-rose-800"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ========================================================
                TAB 6: KONTAK & SEKRETARIAT
            ======================================================== */}
            {activeTab === 'kontak' && (
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                      6. Kontak, Media Sosial & Alamat Sekretariat
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kelola saluran komunikasi resmi untuk aduan hukum dan korespondensi publik.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nomor WhatsApp Hotline (Gunakan format 628...)
                      </label>
                      <input
                        type="text"
                        required
                        value={data.settings.whatsapp}
                        onChange={(e) => setData({
                          ...data,
                          settings: { ...data.settings, whatsapp: e.target.value }
                        })}
                        placeholder="Contoh: 6281234567890"
                        className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Akun Instagram Resmi
                      </label>
                      <input
                        type="text"
                        value={data.settings.instagram}
                        onChange={(e) => setData({
                          ...data,
                          settings: { ...data.settings, instagram: e.target.value }
                        })}
                        placeholder="Contoh: bemfh_official atau demafh.univ"
                        className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Alamat Email Resmi Organisasi
                      </label>
                      <input
                        type="email"
                        required
                        value={data.settings.email}
                        onChange={(e) => setData({
                          ...data,
                          settings: { ...data.settings, email: e.target.value }
                        })}
                        placeholder="kontak@organisasi.org"
                        className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Jam Operasional & Layanan
                      </label>
                      <input
                        type="text"
                        value={data.settings.jam_operasional}
                        onChange={(e) => setData({
                          ...data,
                          settings: { ...data.settings, jam_operasional: e.target.value }
                        })}
                        placeholder="Senin - Jumat: 08.30 - 17.00 WIB"
                        className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Alamat Lengkap Kantor Sekretariat
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={data.settings.alamat}
                      onChange={(e) => setData({
                        ...data,
                        settings: { ...data.settings, alamat: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tautan Google Maps Lokasi
                    </label>
                    <input
                      type="url"
                      value={data.settings.maps_url}
                      onChange={(e) => setData({
                        ...data,
                        settings: { ...data.settings, maps_url: e.target.value }
                      })}
                      placeholder="https://maps.google.com/..."
                      className="touch-target w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="touch-target px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-sm font-bold shadow-sm flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Kontak'}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ========================================================
                TAB 7: PESAN KONSULTASI MASUK
            ======================================================== */}
            {activeTab === 'pesan' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                      7. Pesan & Permohonan Konsultasi Masuk
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Daftar permohonan advokasi dari masyarakat yang dikirim lewat formulir landing page.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {data.pesan?.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 text-sm">
                        Belum ada permohonan pesan masuk.
                      </div>
                    ) : (
                      data.pesan?.map((p) => {
                        const cleanPesanWa = p.telepon.replace(/\D/g, '');
                        const waDirectUrl = `https://wa.me/${cleanPesanWa.startsWith('0') ? '62' + cleanPesanWa.slice(1) : cleanPesanWa}?text=Halo%20${encodeURIComponent(p.nama)},%20kami%20dari%20${encodeURIComponent(data.settings.org_name)}%20menindaklanjuti%20permohonan%20konsultasi%20hukum%20Anda.`;

                        return (
                          <div
                            key={p.id}
                            className={`p-5 rounded-2xl border transition-all ${
                              p.status === 'belum_dibaca'
                                ? 'bg-amber-50/40 border-amber-200'
                                : p.status === 'diproses'
                                ? 'bg-blue-50/30 border-blue-200'
                                : 'bg-slate-50 border-slate-200 opacity-80'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                              <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mr-2 ${
                                  p.status === 'belum_dibaca'
                                    ? 'bg-amber-200 text-amber-900'
                                    : p.status === 'diproses'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  Status: {p.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {new Date(p.created_at).toLocaleString('id-ID')}
                                </span>
                              </div>

                              {/* Status changer buttons */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-500 mr-1">Ubah Status:</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePesanStatus(p.id, 'belum_dibaca')}
                                  className={`touch-target px-2.5 py-1 text-xs rounded-lg font-semibold ${
                                    p.status === 'belum_dibaca' ? 'bg-amber-600 text-white' : 'bg-white border text-slate-700'
                                  }`}
                                >
                                  Baru
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePesanStatus(p.id, 'diproses')}
                                  className={`touch-target px-2.5 py-1 text-xs rounded-lg font-semibold ${
                                    p.status === 'diproses' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
                                  }`}
                                >
                                  Diproses
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePesanStatus(p.id, 'selesai')}
                                  className={`touch-target px-2.5 py-1 text-xs rounded-lg font-semibold ${
                                    p.status === 'selesai' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-700'
                                  }`}
                                >
                                  Selesai
                                </button>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-200/80 mb-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                                <h4 className="text-base font-bold text-slate-900">
                                  {p.nama}
                                </h4>
                                <span className="text-xs font-semibold text-maroon-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                  Kategori: {p.kategori_hukum}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-slate-700 mb-2">
                                Subjek: {p.subjek}
                              </p>
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                {p.pesan}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <a
                                href={waDirectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="touch-target px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Hubungi WA ({p.telepon})</span>
                              </a>

                              {p.email && p.email !== '-' && (
                                <a
                                  href={`mailto:${p.email}?subject=Tindak Lanjut Permohonan: ${encodeURIComponent(p.subjek)}`}
                                  className="touch-target px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>Kirim Email ({p.email})</span>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 8: DATABASE SUPABASE & SQL SCHEMA
            ======================================================== */}
            {activeTab === 'database' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Database className="w-5 h-5 text-maroon-800" />
                      Status Koneksi Supabase & SQL Schema
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Informasi integrasi cloud database dan panduan menjalankan skema SQL.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs text-slate-500 block mb-1">Status Supabase</span>
                      <div className="flex items-center gap-2">
                        {data.isSupabaseConnected ? (
                          <>
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-bold text-emerald-700">Tersambung Cloud</span>
                          </>
                        ) : (
                          <>
                            <span className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="text-sm font-bold text-amber-700">Local Sync Aktif</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs text-slate-500 block mb-1">Storage Bucket</span>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-bold text-slate-800">&quot;media&quot; (Publik)</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-xs text-slate-500 block mb-1">Supabase Project Ref</span>
                      <span className="text-sm font-bold font-mono text-slate-800">aachoudpemjvgjqlvcqp</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-rose-50/60 rounded-xl border border-rose-200 text-xs text-slate-700 mb-6">
                    <h3 className="font-bold text-maroon-900 mb-1 text-sm">
                      Langkah Menjalankan SQL di Supabase SQL Editor:
                    </h3>
                    <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                      <li>Salin script SQL di bawah ini dengan menekan tombol <strong>&quot;Salin Script SQL&quot;</strong>.</li>
                      <li>Buka dashboard Supabase pada menu <strong>SQL Editor</strong>.</li>
                      <li>Tempel (Paste) script SQL dan klik <strong>&quot;Run&quot;</strong>.</li>
                      <li>Setelah selesai, seluruh data akan otomatis tersinkronisasi dan tersimpan langsung di tabel cloud Supabase Anda!</li>
                    </ol>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const sqlScript = `-- SCHEMA DATABASE SUPABASE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'general',
    org_name TEXT NOT NULL,
    slogan TEXT NOT NULL,
    welcome_title TEXT NOT NULL,
    welcome_subtitle TEXT NOT NULL,
    logo_url TEXT DEFAULT '',
    hero_badge TEXT DEFAULT '',
    hero_image_url TEXT DEFAULT '',
    sejarah TEXT NOT NULL,
    visi TEXT NOT NULL,
    misi JSONB NOT NULL DEFAULT '[]'::jsonb,
    cta_primary_label TEXT DEFAULT 'Ajukan Permohonan Bantuan',
    cta_primary_url TEXT DEFAULT '',
    cta_secondary_label TEXT DEFAULT 'Lihat Kegiatan Terbaru',
    cta_secondary_url TEXT DEFAULT '#kegiatan',
    instagram TEXT DEFAULT '',
    whatsapp TEXT DEFAULT '',
    email TEXT DEFAULT '',
    alamat TEXT DEFAULT '',
    maps_url TEXT DEFAULT '',
    jam_operasional TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_primary_label TEXT DEFAULT 'Ajukan Permohonan Bantuan';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_primary_url TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_secondary_label TEXT DEFAULT 'Lihat Kegiatan Terbaru';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cta_secondary_url TEXT DEFAULT '#kegiatan';

CREATE TABLE IF NOT EXISTS public.pengurus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    gelar TEXT DEFAULT '',
    jabatan TEXT NOT NULL,
    divisi TEXT NOT NULL DEFAULT 'Pengurus Harian',
    foto_url TEXT DEFAULT '',
    urutan INT NOT NULL DEFAULT 0,
    bio TEXT DEFAULT '',
    kontak_email TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kegiatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL DEFAULT 'Advokasi',
    tipe TEXT NOT NULL DEFAULT 'kegiatan',
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    waktu TEXT DEFAULT '',
    lokasi TEXT NOT NULL DEFAULT '',
    deskripsi TEXT NOT NULL,
    foto_url TEXT DEFAULT '',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    link_pendaftaran TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.galeri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    deskripsi TEXT DEFAULT '',
    foto_url TEXT NOT NULL,
    tanggal DATE DEFAULT CURRENT_DATE,
    urutan INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pesan_kontak (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    telepon TEXT NOT NULL,
    subjek TEXT NOT NULL,
    kategori_hukum TEXT DEFAULT 'Umum',
    pesan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'belum_dibaca',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesan_kontak ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage site_settings" ON public.site_settings FOR ALL TO authenticated, service_role USING (true);

CREATE POLICY "Public read pengurus" ON public.pengurus FOR SELECT USING (true);
CREATE POLICY "Admin manage pengurus" ON public.pengurus FOR ALL TO authenticated, service_role USING (true);

CREATE POLICY "Public read kegiatan" ON public.kegiatan FOR SELECT USING (true);
CREATE POLICY "Admin manage kegiatan" ON public.kegiatan FOR ALL TO authenticated, service_role USING (true);

CREATE POLICY "Public read galeri" ON public.galeri FOR SELECT USING (true);
CREATE POLICY "Admin manage galeri" ON public.galeri FOR ALL TO authenticated, service_role USING (true);

CREATE POLICY "Public insert pesan_kontak" ON public.pesan_kontak FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage pesan_kontak" ON public.pesan_kontak FOR ALL TO authenticated, service_role USING (true);`;

                          navigator.clipboard.writeText(sqlScript);
                          setCopiedSql(true);
                          setTimeout(() => setCopiedSql(false), 3000);
                          showToast('success', 'Script SQL berhasil disalin ke clipboard!');
                        }}
                        className="touch-target px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                      >
                        {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-amber-300" />}
                        <span>{copiedSql ? 'Tersalin!' : 'Salin Script SQL'}</span>
                      </button>

                      <a
                        href="https://supabase.com/dashboard/project/aachoudpemjvgjqlvcqp/sql/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="touch-target px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-maroon-800" />
                        <span>Buka Supabase SQL Editor &rarr;</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ========================================================
          MODAL: EDIT / TAMBAH PENGURUS
      ======================================================== */}
      {editingPengurus && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col p-5 sm:p-7 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {editingPengurus.id ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
                </h3>
                <p className="text-xs text-slate-500">Struktur BPH, departemen, dan kordinator organisasi</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPengurus(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors touch-target"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePengurus} className="space-y-4 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPengurus.nama}
                    onChange={(e) => setEditingPengurus({ ...editingPengurus, nama: e.target.value })}
                    placeholder="Nama lengkap"
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gelar / Jenjang
                  </label>
                  <input
                    type="text"
                    value={editingPengurus.gelar}
                    onChange={(e) => setEditingPengurus({ ...editingPengurus, gelar: e.target.value })}
                    placeholder="Kandidat S.H. / S.H."
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jabatan <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPengurus.jabatan}
                    onChange={(e) => setEditingPengurus({ ...editingPengurus, jabatan: e.target.value })}
                    placeholder="Contoh: Ketua Umum / Kadep"
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Departemen / Divisi
                  </label>
                  <input
                    type="text"
                    value={editingPengurus.divisi}
                    onChange={(e) => setEditingPengurus({ ...editingPengurus, divisi: e.target.value })}
                    placeholder="BPH / Kastrat / Adkesma"
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bio / Profil Singkat
                </label>
                <textarea
                  rows={2}
                  value={editingPengurus.bio}
                  onChange={(e) => setEditingPengurus({ ...editingPengurus, bio: e.target.value })}
                  placeholder="Mahasiswa FH angkatan 2022, aktif dalam kajian advokasi dan keorganisasian..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={editingPengurus.urutan}
                    onChange={(e) => setEditingPengurus({ ...editingPengurus, urutan: parseInt(e.target.value) || 0 })}
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    value={editingPengurus.kontak_email}
                    onChange={(e) => setEditingPengurus({ ...editingPengurus, kontak_email: e.target.value })}
                    placeholder="pengurus@bemfh.org"
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              <ImageUpload
                label="Foto Pengurus"
                value={editingPengurus.foto_url}
                onChange={(url) => setEditingPengurus({ ...editingPengurus, foto_url: url })}
                helperText="Foto almamater resmi atau pakaian formal berkerah."
              />

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingPengurus(null)}
                  className="touch-target px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="touch-target px-5 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-xs font-bold shadow-md shadow-maroon-900/10"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Pengurus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT / TAMBAH KEGIATAN & AGENDA
      ======================================================== */}
      {editingKegiatan && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col p-5 sm:p-7 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {editingKegiatan.id ? 'Edit Kegiatan / Agenda' : 'Tambah Kegiatan / Agenda Baru'}
                </h3>
                <p className="text-xs text-slate-500">Program kerja, forum diskusi, kajian, dan agenda mahasiswa</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingKegiatan(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors touch-target"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKegiatan} className="space-y-4 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Kegiatan / Agenda <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingKegiatan.judul}
                  onChange={(e) => setEditingKegiatan({ ...editingKegiatan, judul: e.target.value })}
                  placeholder="Contoh: Diskusi Publik RUU Perampasan Aset"
                  className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipe Acara
                  </label>
                  <select
                    value={editingKegiatan.tipe}
                    onChange={(e) => setEditingKegiatan({ ...editingKegiatan, tipe: e.target.value as 'kegiatan' | 'agenda' })}
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
                  >
                    <option value="kegiatan">Kegiatan Terlaksana</option>
                    <option value="agenda">Agenda Mendatang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingKegiatan.kategori}
                    onChange={(e) => setEditingKegiatan({ ...editingKegiatan, kategori: e.target.value })}
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
                  >
                    <option value="Advokasi & Aspirasi">Advokasi & Aspirasi</option>
                    <option value="Kajian & Diskusi Hukum">Kajian & Diskusi Hukum</option>
                    <option value="Peradilan Semu (Moot Court)">Peradilan Semu (Moot Court)</option>
                    <option value="Sekolah Legislatif & Kaderisasi">Sekolah Legislatif & Kaderisasi</option>
                    <option value="Sosial & Pengabdian">Sosial & Pengabdian</option>
                    <option value="Pelatihan & Workshop">Pelatihan & Workshop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Pelaksanaan <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={editingKegiatan.tanggal}
                    onChange={(e) => setEditingKegiatan({ ...editingKegiatan, tanggal: e.target.value })}
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    value={editingKegiatan.waktu}
                    onChange={(e) => setEditingKegiatan({ ...editingKegiatan, waktu: e.target.value })}
                    placeholder="09:00 - 15:00 WIB"
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lokasi Kegiatan
                </label>
                <input
                  type="text"
                  value={editingKegiatan.lokasi}
                  onChange={(e) => setEditingKegiatan({ ...editingKegiatan, lokasi: e.target.value })}
                  placeholder="Contoh: Auditorium FH Lt. 3 / Ruang Sidang Semu / Zoom"
                  className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Kegiatan
                </label>
                <textarea
                  rows={3}
                  value={editingKegiatan.deskripsi}
                  onChange={(e) => setEditingKegiatan({ ...editingKegiatan, deskripsi: e.target.value })}
                  placeholder="Uraian ringkas kegiatan, narasumber yang hadir, serta capaian program..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>

              {editingKegiatan.tipe === 'agenda' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tautan Pendaftaran (Opsional)
                  </label>
                  <input
                    type="url"
                    value={editingKegiatan.link_pendaftaran}
                    onChange={(e) => setEditingKegiatan({ ...editingKegiatan, link_pendaftaran: e.target.value })}
                    placeholder="https://forms.gle/... atau tautan grup WhatsApp"
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              )}

              <ImageUpload
                label="Foto Dokumentasi / Poster Acara"
                value={editingKegiatan.foto_url}
                onChange={(url) => setEditingKegiatan({ ...editingKegiatan, foto_url: url })}
                helperText="Format gambar JPG, PNG, atau WebP. Maksimal 5MB."
              />

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingKegiatan(null)}
                  className="touch-target px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="touch-target px-5 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-xs font-bold shadow-md shadow-maroon-900/10"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Acara'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT / TAMBAH FOTO GALERI
      ======================================================== */}
      {editingGaleri && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col p-5 sm:p-7 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {editingGaleri.id ? 'Edit Foto Galeri' : 'Tambah Foto Dokumentasi'}
                </h3>
                <p className="text-xs text-slate-500">Dokumentasi kegiatan, peradilan semu, kajian, & aksi</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingGaleri(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors touch-target"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGaleri} className="space-y-4 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Foto <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingGaleri.judul}
                  onChange={(e) => setEditingGaleri({ ...editingGaleri, judul: e.target.value })}
                  placeholder="Contoh: Delegasi NMCC Piala Mahkamah Agung / Aksi Damai"
                  className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={2}
                  value={editingGaleri.deskripsi}
                  onChange={(e) => setEditingGaleri({ ...editingGaleri, deskripsi: e.target.value })}
                  placeholder="Keterangan singkat momen foto dokumentasi..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Foto
                  </label>
                  <input
                    type="date"
                    value={editingGaleri.tanggal}
                    onChange={(e) => setEditingGaleri({ ...editingGaleri, tanggal: e.target.value })}
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={editingGaleri.urutan}
                    onChange={(e) => setEditingGaleri({ ...editingGaleri, urutan: parseInt(e.target.value) || 0 })}
                    className="touch-target w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>

              <ImageUpload
                label="Unggah Foto Dokumentasi"
                value={editingGaleri.foto_url}
                onChange={(url) => setEditingGaleri({ ...editingGaleri, foto_url: url })}
                helperText="Format gambar JPG, PNG, atau WebP. Maksimal 5MB."
              />

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingGaleri(null)}
                  className="touch-target px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="touch-target px-5 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-xl text-xs font-bold shadow-md shadow-maroon-900/10"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MOBILE BOTTOM NAVIGATION MENU (md:hidden)
          Lightweight, ergonomis jempol, bebas tab tumpang tindih
      ======================================================== */}
      <nav
        aria-label="Navigasi Menu Admin Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="grid grid-cols-5 items-center gap-1">
          {/* 1. Beranda */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('beranda');
              setIsBottomSheetOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`touch-target flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors ${
              activeTab === 'beranda'
                ? 'text-maroon-800 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'beranda' ? 'bg-maroon-50' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">Beranda</span>
          </button>

          {/* 2. Pengurus */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('pengurus');
              setIsBottomSheetOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`touch-target flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors relative ${
              activeTab === 'pengurus'
                ? 'text-maroon-800 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'pengurus' ? 'bg-maroon-50' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">Pengurus</span>
            {(data?.pengurus?.length ?? 0) > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-full flex items-center justify-center">
                {data?.pengurus?.length}
              </span>
            )}
          </button>

          {/* 3. Kegiatan */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('kegiatan');
              setIsBottomSheetOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`touch-target flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors relative ${
              activeTab === 'kegiatan'
                ? 'text-maroon-800 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'kegiatan' ? 'bg-maroon-50' : ''}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">Kegiatan</span>
            {(data?.kegiatan?.length ?? 0) > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-full flex items-center justify-center">
                {data?.kegiatan?.length}
              </span>
            )}
          </button>

          {/* 4. Pesan */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('pesan');
              setIsBottomSheetOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`touch-target flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors relative ${
              activeTab === 'pesan'
                ? 'text-maroon-800 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'pesan' ? 'bg-maroon-50' : ''}`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">Pesan</span>
            {(data?.pesan?.filter(p => p.status === 'belum_dibaca').length ?? 0) > 0 && (
              <span className="absolute top-1 right-2 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {data?.pesan?.filter(p => p.status === 'belum_dibaca').length}
              </span>
            )}
          </button>

          {/* 5. Lainnya (Buka Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setIsBottomSheetOpen(true)}
            className={`touch-target flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors relative ${
              isBottomSheetOpen || ['tema', 'tentang', 'galeri', 'kontak', 'database'].includes(activeTab)
                ? 'text-maroon-800 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className={`p-1 rounded-lg ${isBottomSheetOpen || ['tema', 'tentang', 'galeri', 'kontak', 'database'].includes(activeTab) ? 'bg-maroon-50 text-maroon-800' : ''}`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 leading-none">Lainnya</span>
            {['tema', 'tentang', 'galeri', 'kontak', 'database'].includes(activeTab) && (
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>
        </div>
      </nav>

      {/* ========================================================
          MOBILE BOTTOM SHEET DRAWER (md:hidden)
          Menu popup komprehensif untuk semua modul admin
      ======================================================== */}
      {isBottomSheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsBottomSheetOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Daftar Modul Admin"
            className="relative z-10 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200/90 max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
          >
            {/* Grab handle indicator */}
            <div className="pt-3 pb-1 flex justify-center cursor-grab shrink-0">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Sheet header */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Navigasi CMS & Modul
                </h3>
                <p className="text-xs text-slate-500">
                  Kelola konten, foto, kontak, dan tautan website
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBottomSheetOpen(false)}
                className="touch-target p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet items body */}
            <div className="p-4 space-y-2 overflow-y-auto max-h-[60vh]">
              {[
                {
                  id: 'beranda' as const,
                  label: 'Beranda & Slogan Organisasi',
                  desc: 'Logo, nama, ucapan selamat datang, tombol & link CTA',
                  icon: Home,
                  badge: null,
                },
                {
                  id: 'tema' as const,
                  label: 'Warna & Tipografi (Tema)',
                  desc: 'Pilihan warna primer organisasi & puluhan font Google Fonts',
                  icon: Palette,
                  badge: 'Kustomisasi',
                },
                {
                  id: 'tentang' as const,
                  label: 'Sejarah, Visi & Misi',
                  desc: 'Sejarah berdiri, visi lembaga, dan butir misi organisasi',
                  icon: BookOpen,
                  badge: null,
                },
                {
                  id: 'pengurus' as const,
                  label: 'Struktur Kepengurusan',
                  desc: 'Susunan BPH, kordinator departemen, dan fungsionaris',
                  icon: Users,
                  badge: `${data?.pengurus?.length || 0} Pengurus`,
                },
                {
                  id: 'kegiatan' as const,
                  label: 'Kegiatan & Agenda Mendatang',
                  desc: 'Program kerja, seminar, lokasi acara, link pendaftaran',
                  icon: Calendar,
                  badge: `${data?.kegiatan?.length || 0} Agenda`,
                },
                {
                  id: 'galeri' as const,
                  label: 'Galeri Foto Dokumentasi',
                  desc: 'Dokumentasi peradilan semu, kajian, aksi damai, & proker',
                  icon: Camera,
                  badge: `${data?.galeri?.length || 0} Foto`,
                },
                {
                  id: 'kontak' as const,
                  label: 'Kontak, Alamat & Maps',
                  desc: 'WhatsApp, akun Instagram, email resmi, lokasi sekretariat',
                  icon: Phone,
                  badge: null,
                },
                {
                  id: 'pesan' as const,
                  label: 'Kotak Pesan & Konsultasi',
                  desc: 'Pesan permohonan bantuan hukum & aduan dari warga',
                  icon: MessageSquare,
                  badge: (data?.pesan?.filter(p => p.status === 'belum_dibaca').length || 0) > 0
                    ? `${data?.pesan?.filter(p => p.status === 'belum_dibaca').length} Baru`
                    : null,
                  badgeAlert: true,
                },
                {
                  id: 'database' as const,
                  label: 'Supabase SQL & Status Sinkronisasi',
                  desc: 'Skrip tabel SQL, panduan koneksi Supabase Cloud',
                  icon: Database,
                  badge: data?.isSupabaseConnected ? 'Cloud Aktif' : 'Local Fallback',
                },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsBottomSheetOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`touch-target w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-maroon-50 border border-maroon-200 shadow-xs'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-maroon-800 text-amber-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold truncate ${isActive ? 'text-maroon-900' : 'text-slate-800'}`}>
                            {item.label}
                          </p>
                          {item.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              item.badgeAlert
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-maroon-800' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              <Link
                href="/"
                target="_blank"
                onClick={() => setIsBottomSheetOpen(false)}
                className="touch-target flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Lihat Landing Page</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsBottomSheetOpen(false);
                  handleLogout();
                }}
                className="touch-target px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
