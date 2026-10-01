import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const serifFont = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#800020",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Portal Resmi Organisasi Hukum & Advokasi | Bantuan Hukum Pro Bono",
  description: "Lembaga advokasi dan bantuan hukum independen yang berdedikasi memberikan pendampingan hukum cuma-cuma (pro bono), penyuluhan kesadaran konstitusional, dan pembelaan hak warga.",
  keywords: ["organisasi hukum", "bantuan hukum pro bono", "advokat publik", "lembaga bantuan hukum", "konsultasi hukum gratis", "pendampingan sengketa hukum"],
  authors: [{ name: "Lembaga Bantuan & Advokasi Hukum" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${sansFont.variable} ${serifFont.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#faf9f8] text-slate-900 antialiased font-sans selection:bg-maroon-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
