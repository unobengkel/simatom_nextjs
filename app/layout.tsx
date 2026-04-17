import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SIMATOM — Simulasi Struktur Atom 3D & Tabel Periodik',
  description:
    'Simulasi interaktif struktur atom 3D berbasis Model Bohr dengan Tabel Periodik 118 unsur dan Asisten AI DeepSeek. Cocok untuk pelajar kimia SMP dan SMA.',
  keywords: ['simulasi atom', 'tabel periodik', 'kimia', 'model bohr', 'three.js', 'deepseek ai'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        {/* MathJax Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                  displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
                },
                svg: { fontCache: 'global' }
              };
            `,
          }}
        />
      </head>
      <body className="overflow-hidden bg-slate-950 text-slate-800 font-sans antialiased">
        {children}

        {/* MathJax Script — loaded after page interactive */}
        <Script
          id="mathjax-script"
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
