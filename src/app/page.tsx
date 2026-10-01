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

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const data = await getOrganizationData();

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-maroon-800 selection:text-white">
        {/* 1. Header & Navigation */}
        <Navbar settings={data.settings} />

        {/* 2. Beranda: Logo, Nama, Slogan, Ucapan Selamat Datang, Foto Kegiatan Terbaru */}
        <Hero
          settings={data.settings}
          recentActivities={data.kegiatan}
        />

        {/* 3. Tentang Kami: Sejarah, Visi, Misi, Struktur Kepengurusan */}
        <AboutSection
          settings={data.settings}
          pengurus={data.pengurus}
        />

        {/* 4. Kegiatan & Agenda Mendatang */}
        <ActivitiesSection
          kegiatan={data.kegiatan}
          whatsappNumber={data.settings.whatsapp}
        />

        {/* 5. Dokumentasi Foto / Galeri */}
        <GallerySection
          galeri={data.galeri}
        />

        {/* 6. Kontak: Instagram, WhatsApp, Email, Alamat Sekretariat & Form Aduan */}
        <ContactSection
          settings={data.settings}
        />

        {/* 7. Footer dengan Legal Disclaimer & Akses Admin */}
        <Footer
          settings={data.settings}
        />

        {/* 8. Mobile Thumb Quick Action Bar (Mobile-first UX) */}
        <MobileQuickBar
          whatsappNumber={data.settings.whatsapp}
          orgName={data.settings.org_name}
        />
      </div>
    </SmoothScroll>
  );
}
