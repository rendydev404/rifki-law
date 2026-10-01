import { getOrganizationData } from '@/lib/data-service';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ActivitiesSection from '@/components/ActivitiesSection';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import MobileQuickBar from '@/components/MobileQuickBar';
import SmoothScroll from '@/components/SmoothScroll';
import ThemeApplicator from '@/components/ThemeApplicator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const data = await getOrganizationData();

  return (
    <SmoothScroll>
      {/* Dynamic Theme & Font Injection */}
      <ThemeApplicator settings={data.settings} />

      <div className="min-h-screen bg-[#faf9f8] flex flex-col selection:bg-maroon-800 selection:text-white">
        {/* Navigation Bar */}
        <Navbar settings={data.settings} />

        {/* 1. Beranda: Logo & Nama Organisasi, Ucapan Selamat Datang, Slogan */}
        <Hero
          settings={data.settings}
          recentActivities={data.kegiatan}
        />

        {/* 2. Tentang Kami: Sejarah Organisasi, Visi & Misi, Struktur Kepengurusan */}
        <AboutSection
          settings={data.settings}
          pengurus={data.pengurus}
        />

        {/* 3. Kegiatan: Daftar Kegiatan */}
        <ActivitiesSection
          kegiatan={data.kegiatan}
          whatsappNumber={data.settings.whatsapp}
        />

        {/* 3. Kegiatan: Dokumentasi Foto */}
        <GallerySection
          galeri={data.galeri}
        />

        {/* 4. Kontak: Instagram, WhatsApp, Email, Alamat */}
        <ContactSection
          settings={data.settings}
        />

        {/* 8. Footer dengan Legal Disclaimer & Akses Admin */}
        <Footer
          settings={data.settings}
        />

        {/* 9. Mobile Thumb Quick Action Bar (Mobile-first UX) */}
        <MobileQuickBar
          whatsappNumber={data.settings.whatsapp}
          orgName={data.settings.org_name}
        />
      </div>
    </SmoothScroll>
  );
}
