import type { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import BottomNav from "@/components/BottomNav";
import ToastContainer from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://riyadhguide.com'),
  title: {
    default: "دليل السعودية | Saudi Guide",
    template: "%s | دليل السعودية"
  },
  description: "دليل السعودية الذكي - اكتشف المعالم التاريخية والمطاعم والفعاليات والجولات الصوتية والتجارب المميزة في جميع مدن المملكة. Your smart guide to tourism across Saudi Arabia.",
  keywords: ["Saudi Arabia", "Tourism", "Travel", "Guide", "السعودية", "سياحة", "دليل السعودية", "جولات صوتية", "فعاليات", "الرياض", "جدة", "الطائف"],
  authors: [{ name: "Saudi Guide Team" }],
  creator: "Saudi Guide",
  publisher: "Saudi Guide",
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    url: 'https://saudiguide.com',
    siteName: 'Saudi Guide',
    title: 'دليل السعودية | Saudi Guide',
    description: 'دليل السعودية الذكي - اكتشف المعالم والفعاليات والجولات الصوتية في جميع مدن المملكة.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'دليل السعودية - Saudi Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دليل السعودية | Saudi Guide',
    description: 'دليل السعودية الذكي - اكتشف المعالم والفعاليات والجولات الصوتية.',
    images: ['/og-image.jpg'],
    creator: '@SaudiGuide',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'travel',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&family=Zain:wght@300;400;700;800;900&family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased selection:bg-[var(--accent-gold)] selection:text-black font-sans">
        <Providers>
          <ErrorBoundary>
            <Navbar />
            {children}
            <Footer />
            <Chatbot />
            <BottomNav />
            <ToastContainer />
          </ErrorBoundary>
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
