import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
