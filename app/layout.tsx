import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://safehome-store.com"),

  title: {
    default:
      "SafeHome Store | Toko Online Perlengkapan Rumah & Keamanan Terpercaya",
    template: "%s | SafeHome Store",
  },

  description:
    "Belanja perlengkapan rumah & keamanan: CCTV, Smart Lock, Alarm, Lampu Taman, Perangkap Tikus & lainnya. Harga terbaik, pengiriman cepat se-Indonesia.",

  keywords: [
    "SafeHome Store",
    "Toko Online",
    "Perlengkapan Rumah",
    "Lampu Taman",
    "Lampu Outdoor",
    "Perangkap Tikus",
    "CCTV",
    "Smart Lock",
    "Alarm Rumah",
    "Keamanan Rumah",
    "Peralatan Rumah Tangga",
    "Belanja Online Indonesia",
  ],

  authors: [
    {
      name: "SafeHome Store",
      url: "https://safehome-store.com",
    },
  ],

  creator: "SafeHome Store",
  publisher: "SafeHome Store",
  applicationName: "SafeHome Store",

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  alternates: {
    canonical: "https://safehome-store.com",
    languages: {
      "id-ID": "https://safehome-store.com",
      "x-default": "https://safehome-store.com",
    },
  },

  verification: {
    google: "OJv7g1ECOcVFV9JlN-oRxJg7PkiSC0r_cbxp3SKX3dM",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title:
      "SafeHome Store | Toko Online Perlengkapan Rumah & Keamanan Terpercaya",
    description:
      "Temukan berbagai produk rumah tangga dan keamanan berkualitas dengan harga terbaik. Belanja mudah, aman, dan pengiriman cepat.",
    url: "https://safehome-store.com",
    siteName: "SafeHome Store",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SafeHome Store - Toko Online Perlengkapan Rumah & Keamanan",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SafeHome Store | Toko Online Perlengkapan Rumah & Keamanan",
    description:
      "Belanja perlengkapan rumah berkualitas dengan harga terbaik hanya di SafeHome Store.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  appleWebApp: {
    capable: true,
    title: "SafeHome Store",
    statusBarStyle: "default",
  },

  category: "shopping",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://safehome-store.com/#organization",
      name: "SafeHome Store",
      url: "https://safehome-store.com",
      logo: {
        "@type": "ImageObject",
        url: "https://safehome-store.com/logo.png",
        width: 512,
        height: 512,
      },
      image: "https://safehome-store.com/og-image.jpg",
      description:
        "Toko online perlengkapan rumah dan keamanan terpercaya di Indonesia, menyediakan CCTV, smart lock, alarm, dan peralatan rumah tangga berkualitas.",
    },
    {
      "@type": "WebSite",
      "@id": "https://safehome-store.com/#website",
      url: "https://safehome-store.com",
      name: "SafeHome Store",
      description:
        "Toko online perlengkapan rumah & keamanan terpercaya di Indonesia.",
      inLanguage: "id-ID",
      publisher: {
        "@id": "https://safehome-store.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://safehome-store.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}