import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Penting untuk performa loading font
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SafeHome Store | Solusi Keamanan Rumah Pintar Terbaik",
    template: "%s | SafeHome Store",
  },
  description: "Dapatkan perlindungan maksimal untuk keluarga Anda. SafeHome Store menyediakan produk keamanan rumah berkualitas tinggi: Smart Lock, CCTV, Alarm Sensor, dan Brankas. Belanja aman, pengiriman cepat.",
  keywords: ["keamanan rumah", "smart home security", "cctv murah", "smart lock pintu", "brankas besi", "sensor keamanan"],
  authors: [{ name: "SafeHome Store Team" }],
  robots: "index, follow",
  openGraph: {
    title: "SafeHome Store | Keamanan Rumah Pintar Terpercaya",
    description: "Lindungi rumah Anda dengan teknologi keamanan terbaru. Beli Smart Lock, CCTV, dan Sensor terbaik hanya di SafeHome Store.",
    url: "https://safehome-store.com", // Ganti dengan domain Anda
    siteName: "SafeHome Store",
    locale: "id_ID",
    type: "website",
  },
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
    <html
      lang="id" // Diubah ke 'id' untuk SEO lokal Indonesia
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-full flex flex-col font-sans text-gray-900 bg-[#f8f9fa]">
        {children}
      </body>
    </html>
  );
}