import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const interSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Life.OS | Narrative Reality Console',
  description:
    'A high-tech operating system designed for the retrieval and manipulation of human destinies.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#131317',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${interSans.variable} ${jetbrainsMono.variable} font-sans bg-background text-on-background min-h-screen antialiased`}
      >
        {/* Environmental Grid Overlay */}
        <div className="grid-overlay fixed inset-0 z-0" aria-hidden="true" />

        {/* Ambient Light Waves */}
        <div
          className="fixed bottom-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0 breathing-glow"
          style={{
            background: 'radial-gradient(circle, rgba(123,208,255,0.08) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div
          className="fixed bottom-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0 breathing-glow"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            animationDelay: '3s',
          }}
          aria-hidden="true"
        />

        {/* Scanline */}
        <div className="scanline" aria-hidden="true" />

        {/* Noise Overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Main Content */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
