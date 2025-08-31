import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Én app til felt + kontor',
  description: 'Tidsregistrering og projektstyring med Scafix-integration',
  applicationName: 'FeltKontor',
  manifest: '/manifest.json',
  themeColor: '#0f4a8a',
  viewport: 'width=device-width, initial-scale=1'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}