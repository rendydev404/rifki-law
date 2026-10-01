import { getOrganizationData } from '@/lib/data-service';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RecentActivitiesShowcase from '@/components/RecentActivitiesShowcase';
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
      <div className="min-h-screen bg-[#faf9f8] flex flex-col selection:bg-maroon-800 selection:text-white">
        {/* 1. Header & Navigation */}
        <Navbar settings={data.settings} />

        {/* 2. Beranda: Logo, Nama, Slogan, Ucapan Selamat Datang */}
        <Hero
          settings={data.settings}
          recentActivities={data.kegiatan}
        />

        {/* 3. Foto Kegiatan Terbaru Showcase (Clean & Breathable Visual Gallery) */}
        <RecentActivitiesShowcase
          activities={data.kegiatan}
        />

        {/* 4. Tentang Kami: Sejarah, Visi, Misi, Struktur Kepengurusan */}
        <AboutSection
          settings={data.settings}
          pengurus={data.pengurus}
        />

        {/* 5. Kegiatan Lapangan & Agenda Mendatang */}
        <ActivitiesSection
          kegiatan={data.kegiatan}
          whatsappNumber={data.settings.whatsapp}
        />

        {/* 6. Dokumentasi Foto / Galeri Lightbox */}
        <GallerySection
          galeri={data.galeri}
        />

        {/* 7. Kontak: Instagram, WhatsApp, Email, Alamat Sekretariat & Form Aduan */}
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
