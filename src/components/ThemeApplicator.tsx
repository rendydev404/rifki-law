'use client';

import React, { useEffect, useState } from 'react';
import { SiteSettings } from '@/lib/types';
import { generatePalette, getGoogleFontUrl } from '@/lib/theme-utils';

interface ThemeApplicatorProps {
  settings?: Partial<SiteSettings>;
}

export default function ThemeApplicator({ settings: initialSettings }: ThemeApplicatorProps) {
  const [currentSettings, setCurrentSettings] = useState<Partial<SiteSettings>>(initialSettings || {});

  useEffect(() => {
    if (initialSettings) {
      setCurrentSettings(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    const applyTheme = (s: Partial<SiteSettings>) => {
      const primaryHex = s.primary_color || '#800020';
      const bodyFont = s.font_family || 'Plus Jakarta Sans';
      const headingFont = s.font_heading || 'Plus Jakarta Sans';

      // 1. Apply Palette CSS variables to documentElement
      const palette = generatePalette(primaryHex);
      Object.entries(palette).forEach(([key, val]) => {
        document.documentElement.style.setProperty(key, val);
      });

      // 2. Apply Font CSS variables
      document.documentElement.style.setProperty('--custom-font-sans', `'${bodyFont}', var(--font-sans), system-ui, sans-serif`);
      document.documentElement.style.setProperty('--custom-font-serif', `'${headingFont}', var(--custom-font-sans), var(--font-sans), system-ui, sans-serif`);

      // 3. Dynamically inject / update Google Fonts stylesheet
      const fontUrl = getGoogleFontUrl(bodyFont, headingFont);
      let fontLink = document.getElementById('dynamic-google-fonts') as HTMLLinkElement | null;
      if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id = 'dynamic-google-fonts';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
      if (fontLink && fontLink.href !== fontUrl) {
        fontLink.href = fontUrl;
      }
    };

    // Apply on mount
    applyTheme(currentSettings);

    // Reactive Listeners: custom event & cross-tab storage
    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Partial<SiteSettings>>;
      if (customEvent.detail) {
        setCurrentSettings(prev => {
          const merged = { ...prev, ...customEvent.detail };
          applyTheme(merged);
          return merged;
        });
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'law_site_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setCurrentSettings(parsed);
          applyTheme(parsed);
        } catch {}
      }
    };

    window.addEventListener('law_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleStorage);

    // Initial check from localStorage in case updated in admin
    try {
      const saved = localStorage.getItem('law_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.primary_color || parsed.font_family || parsed.font_heading) {
          setCurrentSettings(prev => ({ ...prev, ...parsed }));
          applyTheme({ ...currentSettings, ...parsed });
        }
      }
    } catch {}

    return () => {
      window.removeEventListener('law_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const primaryHex = currentSettings.primary_color || '#800020';
  const bodyFont = currentSettings.font_family || 'Plus Jakarta Sans';
  const headingFont = currentSettings.font_heading || 'Plus Jakarta Sans';
  const palette = generatePalette(primaryHex);

  const styleText = `
    :root {
      ${Object.entries(palette).map(([k, v]) => `${k}: ${v};`).join('\n      ')}
      --custom-font-sans: '${bodyFont}', var(--font-sans), system-ui, sans-serif;
      --custom-font-serif: '${headingFont}', var(--custom-font-sans), var(--font-sans), system-ui, sans-serif;
    }
  `;

  return (
    <>
      <style id="theme-dynamic-vars" dangerouslySetInnerHTML={{ __html: styleText }} />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        id="dynamic-google-fonts"
        rel="stylesheet"
        href={getGoogleFontUrl(bodyFont, headingFont)}
      />
    </>
  );
}
