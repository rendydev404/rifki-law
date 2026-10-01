// Utility for theme customization: dynamic color palette generation and Google Fonts management

export interface ColorPreset {
  id: string;
  name: string;
  hex: string;
  description: string;
}

export interface FontOption {
  id: string;
  name: string;
  category: 'sans-serif' | 'serif';
  description: string;
  weights: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'maroon', name: 'Marun Hukum (Default)', hex: '#800020', description: 'Warna marun klasik kemahasiswaan & lambang keadilan formal' },
  { id: 'navy', name: 'Navy Blue (Tata Negara)', hex: '#1e3a8a', description: 'Elegan, kredibel, dan berwibawa khas birokrasi & hukum' },
  { id: 'emerald', name: 'Emerald Green (Advokasi)', hex: '#047857', description: 'Simbol integritas, keberpihakan rakyat, dan keadilan sosial' },
  { id: 'purple', name: 'Royal Purple (Yudisial)', hex: '#6b21a8', description: 'Keagungan peradilan, kebijaksanaan moral, dan martabat' },
  { id: 'crimson', name: 'Crimson Red (Aktivisme)', hex: '#b91c1c', description: 'Karakter vokal, berani, dan militansi pergerakan mahasiswa' },
  { id: 'sapphire', name: 'Sapphire Blue (Progresif)', hex: '#0284c7', description: 'Modern, intelektual, dan riset hukum berwawasan luas' },
  { id: 'charcoal', name: 'Slate Charcoal (Formal)', hex: '#334155', description: 'Netral, tegas, dan berkelas seperti dokumen resmi' },
  { id: 'amber', name: 'Amber Gold (Prestasi)', hex: '#b45309', description: 'Prestasi moot court, kehormatan, dan kejayaan almamater' },
  { id: 'teal', name: 'Deep Teal (Kolaboratif)', hex: '#0f766e', description: 'Keseimbangan rasa keadilan dan pendampingan masyarakat' },
  { id: 'indigo', name: 'Indigo Velvet (Dinamis)', hex: '#4338ca', description: 'Progresif, inovatif, dan relevan dengan generasi muda' },
];

export const BODY_FONT_OPTIONS: FontOption[] = [
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', category: 'sans-serif', description: 'Modern, rapi, standar industri UI Indonesia', weights: '400;500;600;700;800' },
  { id: 'Inter', name: 'Inter', category: 'sans-serif', description: 'Netral, sangat jernih di semua ukuran layar layar HP', weights: '400;500;600;700' },
  { id: 'Poppins', name: 'Poppins', category: 'sans-serif', description: 'Geometris, bersahabat, ramah untuk mahasiswa', weights: '400;500;600;700' },
  { id: 'Montserrat', name: 'Montserrat', category: 'sans-serif', description: 'Tegas, berbobot, inspirasi tipografi urban', weights: '400;500;600;700;800' },
  { id: 'Outfit', name: 'Outfit', category: 'sans-serif', description: 'Kontemporer, bersih, gaya startup & organisasi masa kini', weights: '400;500;600;700' },
  { id: 'Roboto', name: 'Roboto', category: 'sans-serif', description: 'Fungsional, legibilitas tinggi, klasik dan stabil', weights: '400;500;700' },
  { id: 'Raleway', name: 'Raleway', category: 'sans-serif', description: 'Artistik, ramping, memiliki sentuhan editorial elegan', weights: '400;500;600;700' },
  { id: 'DM Sans', name: 'DM Sans', category: 'sans-serif', description: 'Geometris minimalis dengan kontras visual tinggi', weights: '400;500;700' },
  { id: 'Work Sans', name: 'Work Sans', category: 'sans-serif', description: 'Dirancang khusus untuk layar digital dan dokumen bacaan', weights: '400;500;600;700' },
  { id: 'Manrope', name: 'Manrope', category: 'sans-serif', description: 'Semi-kondensed, modern, cocok untuk headline & body', weights: '400;500;600;700' },
];

export const HEADING_FONT_OPTIONS: FontOption[] = [
  { id: 'Playfair Display', name: 'Playfair Display', category: 'serif', description: 'Klasik hukum terhormat, memiliki lekuk prestisius', weights: '500;600;700;800;900' },
  { id: 'Merriweather', name: 'Merriweather', category: 'serif', description: 'Gaya naskah undang-undang yang mudah dibaca dan kokoh', weights: '400;700;900' },
  { id: 'Lora', name: 'Lora', category: 'serif', description: 'Harmonis, anggun, dengan karakter kaligrafi kontemporer', weights: '400;500;600;700' },
  { id: 'Crimson Pro', name: 'Crimson Pro', category: 'serif', description: 'Tipografi buku teks akademik universitas terkemuka', weights: '400;600;700;800' },
  { id: 'Cinzel', name: 'Cinzel', category: 'serif', description: 'Inskripsi Romawi klasik, sangat berwibawa untuk hukum', weights: '500;600;700;800' },
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond', category: 'serif', description: 'Tradisi Garamond abad ke-16 dengan keanggunan abadi', weights: '500;600;700' },
  { id: 'EB Garamond', name: 'EB Garamond', category: 'serif', description: 'Presisi tinggi untuk judul riset, jurnal, dan yurisprudensi', weights: '500;600;700;800' },
  { id: 'Libre Baskerville', name: 'Libre Baskerville', category: 'serif', description: 'Baskerville formal yang dioptimalkan untuk heading web', weights: '400;700' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Match Body)', category: 'sans-serif', description: 'Seragam modern sans-serif untuk judul & isi', weights: '600;700;800' },
  { id: 'Montserrat', name: 'Montserrat (Bold Modern)', category: 'sans-serif', description: 'Tegas dan bertenaga untuk judul besar', weights: '700;800' },
];

// Helper: Convert HEX to HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) {
    cleanHex = '800020'; // default fallback
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Helper: Convert HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
  const normS = Math.min(100, Math.max(0, s)) / 100;
  const normL = Math.min(100, Math.max(0, l)) / 100;

  const a = normS * Math.min(normL, 1 - normL);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = normL - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate complete Tailwind 50-950 scale from single primary hex
export function generatePalette(baseHex: string): Record<string, string> {
  const { h, s } = hexToHsl(baseHex);

  const cleanHex = baseHex.startsWith('#') ? baseHex : `#${baseHex}`;

  return {
    '--custom-maroon-50': hslToHex(h, Math.min(s, 40), 97),
    '--custom-maroon-100': hslToHex(h, Math.min(s, 50), 92),
    '--custom-maroon-200': hslToHex(h, Math.min(s, 60), 83),
    '--custom-maroon-300': hslToHex(h, Math.min(s, 70), 71),
    '--custom-maroon-400': hslToHex(h, Math.min(s, 75), 58),
    '--custom-maroon-500': hslToHex(h, Math.min(s, 80), 48),
    '--custom-maroon-600': hslToHex(h, Math.min(s, 85), 38),
    '--custom-maroon-700': hslToHex(h, Math.min(s, 90), 30),
    '--custom-maroon-800': cleanHex, // Exact selected color as primary brand
    '--custom-maroon-900': hslToHex(h, Math.min(s, 95), 18),
    '--custom-maroon-950': hslToHex(h, Math.min(s, 100), 11),
  };
}

// Build Google Fonts CSS stylesheet import URL
export function getGoogleFontUrl(bodyFont: string, headingFont: string): string {
  const fonts = Array.from(new Set([bodyFont, headingFont])).filter(Boolean);
  if (fonts.length === 0) return '';

  const families = fonts.map(f => {
    const formatted = f.trim().replace(/\s+/g, '+');
    return `family=${formatted}:wght@300;400;500;600;700;800;900`;
  });

  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}
