'use client';

import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Head from 'next/head';
import { motion, AnimatePresence, Variants, useInView } from 'framer-motion';

import {
  ShieldCheck,
  Store,
  Search,
  ListFilter,
  X,
  ChevronLeft,
  ChevronRight,
  Percent,
  ArrowRight,
  Check,
  Cctv,
  Smartphone,
  Sparkles,
  ChevronDown,
  Lock,
  UserCheck,
  ServerCrash,
  Menu,
  Home,
  Tag,
  Info,
  HelpCircle,
  Phone,
  Package,
  Star,
} from 'lucide-react';

import {
  FaKey,
  FaVault,
  FaLightbulb,
  FaLock,
  FaBell,
  FaShieldHalved,
  FaFingerprint,
  FaMicrophone,
  FaTowerBroadcast,
  FaHammer,
  FaPlug,
  FaSolarPanel,
  FaHouseSignal,
  FaWrench,
  FaUserShield,
  FaFireExtinguisher,
  FaKitMedical,
  FaWifi,
  FaCartShopping,
  FaMotorcycle,
  FaMessage,
  FaStar,
  FaTruck,
  FaHeadset,
  FaCircleCheck,
  FaGift,
  FaFire,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa6';

import { MdOutlineSensors as SensorIcon } from 'react-icons/md';
import { getOrCreateSessionId } from '@/lib/session';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  nama: string;
  harga: number;
  stock: number;
  deskripsi: string | null;
  gambar1: string | null;
  gambar2: string | null;
  gambar3: string | null;
}

interface FlyingItem {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SITE_URL = 'https://safehomestore.id';
const SITE_NAME = 'SafeHome Store';
const SITE_DESCRIPTION =
  'Toko CCTV, Smart Lock, Alarm Rumah, dan perlengkapan keamanan modern terpercaya. Produk original bergaransi, harga terbaik, pengiriman ke seluruh Indonesia.';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardItem: Variants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 28 } },
};

// ─── Social Links ─────────────────────────────────────────────────────────────
const SOCIALS = [
  { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://wa.me/6285881941073', color: 'text-emerald-500' },
  { icon: FaFacebook, label: 'Facebook', href: 'https://facebook.com', color: 'text-blue-500' },
  { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com', color: 'text-pink-500' },
  { icon: FaTiktok, label: 'TikTok', href: 'https://tiktok.com', color: 'text-gray-800' },
  { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com', color: 'text-red-500' },
];

const NAV_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Produk', href: '#katalog', icon: Package },
  { label: 'Promo', href: '#promo', icon: Tag },
  { label: 'Tentang', href: '#tentang', icon: Info },
  { label: 'FAQ', href: '#faq', icon: HelpCircle },
  { label: 'Kontak', href: 'https://wa.me/6285881941073', icon: Phone },
];

// ─── SEO Head ─────────────────────────────────────────────────────────────────
function SeoHead() {
  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-858-8194-1073',
      contactType: 'customer service',
      availableLanguage: 'Indonesian',
    },
    sameAs: [
      'https://wa.me/6285881941073',
      'https://facebook.com',
      'https://instagram.com',
      'https://tiktok.com',
    ],
  };

  const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdStore = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: SITE_NAME,
    image: OG_IMAGE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: '+62-858-8194-1073',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '21:00',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '12000',
    },
  };

  return (
    <Head>
      {/* Primary */}
      <title>SafeHome Store — CCTV, Smart Lock &amp; Alarm Rumah Terpercaya Indonesia</title>
      <meta name="description" content={SITE_DESCRIPTION} />
      <meta
        name="keywords"
        content="CCTV wireless, smart lock, alarm rumah, kamera keamanan, brankas, gembok, sensor gerak, kunci digital, sistem keamanan rumah, Indonesia"
      />
      <meta name="robots" content="index,follow" />
      <meta name="language" content="id" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#f97316" />
      <link rel="canonical" href={SITE_URL} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content="SafeHome Store — CCTV, Smart Lock &amp; Alarm Rumah Terpercaya" />
      <meta property="og:description" content={SITE_DESCRIPTION} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="SafeHome Store — CCTV, Smart Lock &amp; Alarm Rumah Terpercaya" />
      <meta name="twitter:description" content={SITE_DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {/* Apple */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Favicons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href={SITE_URL} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdStore) }}
      />
    </Head>
  );
}

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px 0px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ count = 5, size = 'sm' }: { count?: number; size?: 'xs' | 'sm' }) {
  const cls = size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3';
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`Rating ${count} bintang`}>
      {[...Array(count)].map((_, i) => (
        <FaStar key={i} className={cls} />
      ))}
    </div>
  );
}

// ─── PROMO BANNER — compact mobile ───────────────────────────────────────────
function PromoBanner() {
  const banners = ['/promo1.png', '/promo2.png', '/promo3.png', '/promo4.png'];
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setCurrent((p) => (p - 1 + banners.length) % banners.length);
  const next = () => setCurrent((p) => (p + 1) % banners.length);

  return (
    <section id="promo" aria-label="Banner promo SafeHome Store" className="w-full">
      {/* Mobile: 140px | Tablet: 260px | Desktop: 400px */}
      <div
        className="relative w-full h-[140px] sm:h-[260px] md:h-[400px] overflow-hidden group select-none"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
          touchStartX.current = null;
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={banners[current]}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            alt={`Promo SafeHome Store ${current + 1}`}
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
            decoding="async"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Nav arrows — hidden on mobile, show on hover for larger screens */}
        <button
          onClick={prev}
          aria-label="Banner sebelumnya"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={next}
          aria-label="Banner selanjutnya"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Lihat banner ${i + 1}`}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-5 sm:w-6 bg-white' : 'w-1 sm:w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HERO — compact mobile (image-first) ─────────────────────────────────────
function HeroSection() {
  const banners = ['/baner1.png', '/baner2.png', '/baner3.png', '/baner4.png', '/baner5.png', '/baner6.png'];
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  const trust = [
    { icon: <FaShieldHalved className="w-3.5 h-3.5" />, label: 'Produk Original' },
    { icon: <FaCircleCheck className="w-3.5 h-3.5" />, label: 'Garansi 1 Tahun' },
    { icon: <FaHeadset className="w-3.5 h-3.5" />, label: 'Konsultasi Gratis' },
  ];

  return (
    <section
      aria-label="Hero SafeHome Store"
      className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[360px] h-[360px] bg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[280px] h-[280px] bg-orange-600/6 rounded-full blur-3xl" />
      </div>

      {/* ── MOBILE LAYOUT: compact hero ─────────────────────────────────── */}
      <div className="md:hidden relative">
        {/* Mobile: image as background/foreground, fixed height */}
        <div
          className="relative h-[150px] sm:h-[200px] overflow-hidden"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40)
              diff > 0
                ? setCurrent((p) => (p + 1) % banners.length)
                : setCurrent((p) => (p - 1 + banners.length) % banners.length);
            touchStartX.current = null;
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={banners[current]}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              alt="Sistem keamanan SafeHome Store"
              className="w-full h-full object-cover absolute inset-0 select-none"
              loading="eager"
              fetchPriority="high"
            />
          </AnimatePresence>
          {/* Gradient overlay bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent pointer-events-none" />

          {/* Discount badge */}
          <div className="absolute top-2.5 right-2.5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl px-2.5 py-1.5 shadow-lg shadow-orange-500/40 rotate-2 z-10 select-none">
            <p className="text-[8px] font-bold uppercase tracking-wider opacity-80 leading-none">Diskon</p>
            <p className="text-base font-black leading-tight">15%</p>
          </div>

          {/* Dot nav */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? 'w-4 bg-white' : 'w-1 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile: text below image, compact */}
        <div className="px-4 py-3.5">
          {/* Badge */}
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded-full uppercase tracking-widest mb-2">
            <FaShieldHalved className="w-2.5 h-2.5" />
            Toko Keamanan Terpercaya
          </span>

          {/* Headline — compact */}
          <h1 className="text-[18px] font-extrabold tracking-tight text-white leading-[1.2] mb-2">
            Lindungi Rumah dengan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Sistem Keamanan Pintar
            </span>
          </h1>

          {/* Short description */}
          <p className="text-[11px] text-gray-400 leading-relaxed mb-3 max-w-xs">
            CCTV wireless, smart lock & alarm rumah — original bergaransi, pengiriman ke seluruh Indonesia.
          </p>

          {/* CTAs — full width stacked or side by side */}
          <div className="flex items-center gap-2 mb-3">
            <a
              href="#katalog"
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/30 transition-all active:scale-95 min-h-[44px]"
            >
              <FaCartShopping className="w-3.5 h-3.5" />
              Belanja Sekarang
            </a>
            <a
              href="https://wa.me/6285881941073"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/8 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl border border-white/15 transition-all active:scale-95 min-h-[44px]"
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
              Konsultasi
            </a>
          </div>

          {/* Social proof mini */}
          <div className="flex items-center gap-3 pb-1">
            <div className="flex items-center gap-1.5">
              <StarRating size="xs" />
              <span className="text-[10px] font-bold text-white">4.9/5</span>
            </div>
            <div className="w-px h-3 bg-white/15" />
            <p className="text-[10px] text-gray-500">
              <span className="font-bold text-gray-300">12.000+</span> pelanggan
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP/TABLET LAYOUT: two column ─────────────────────────────── */}
      <div className="hidden md:block relative max-w-7xl mx-auto px-6 py-14 lg:py-20">
        <div className="grid grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* IMAGE — right */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="order-2 relative"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40)
                diff > 0
                  ? setCurrent((p) => (p + 1) % banners.length)
                  : setCurrent((p) => (p - 1 + banners.length) % banners.length);
              touchStartX.current = null;
            }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 shadow-2xl bg-gray-900">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={banners[current]}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  alt="Sistem keamanan rumah SafeHome Store"
                  className="w-full h-full object-cover absolute inset-0 opacity-90 select-none"
                  loading="eager"
                  fetchPriority="high"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating discount badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl px-3.5 py-2.5 shadow-lg shadow-orange-500/40 rotate-3 z-10 select-none">
              <p className="text-[9px] font-bold uppercase tracking-wider opacity-80">Diskon hingga</p>
              <p className="text-2xl font-black leading-tight tracking-tight">15%</p>
            </div>

            {/* Social proof pill */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-100 flex items-center gap-2 z-10 select-none">
              <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
                <FaCircleCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-medium">Sudah terjual</p>
                <p className="text-xs font-black text-gray-900">12.000+ pelanggan</p>
              </div>
            </div>
          </motion.div>

          {/* TEXT — left */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.09 } } }}
            className="order-1"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
                <FaShieldHalved className="w-3 h-3" />
                Toko Keamanan Rumah Terpercaya
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[34px] lg:text-[44px] font-extrabold tracking-tight text-white leading-[1.12] mb-4"
            >
              Lindungi Rumah &amp; Kantor Anda dengan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Sistem Keamanan Pintar
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-sm lg:text-[15px] text-gray-400 leading-relaxed mb-7 max-w-md">
              Belanja CCTV wireless, smart lock, alarm rumah pintar — original bergaransi, harga bersahabat,
              pengiriman cepat ke seluruh Indonesia.
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-7">
              {trust.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-300 bg-white/6 border border-white/10 px-3 py-1.5 rounded-full"
                >
                  <span className="text-orange-400">{t.icon}</span>
                  {t.label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <a
                href="#katalog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-95 text-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-orange-500/30 transition-all min-h-[44px]"
              >
                <FaCartShopping className="w-4 h-4" />
                Belanja Sekarang
              </a>
              <a
                href="https://wa.me/6285881941073"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/14 active:scale-95 text-white text-sm font-bold px-6 py-3.5 rounded-2xl border border-white/15 hover:border-emerald-500/60 transition-all min-h-[44px]"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-400" />
                Konsultasi Gratis
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4 mt-7 pt-6 border-t border-white/10"
            >
              <div className="flex items-center gap-2">
                <StarRating />
                <span className="text-xs font-bold text-white">4.9/5</span>
              </div>
              <div className="w-px h-4 bg-white/15" />
              <p className="text-xs text-gray-500">
                Dipercaya <span className="font-bold text-gray-300">12.000+</span> pelanggan
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── TRUST HIGHLIGHTS ─────────────────────────────────────────────────────────
function TrustHighlights() {
  const items = [
    { icon: <FaShieldHalved className="w-5 h-5" />, title: 'Produk Original', desc: 'Bergaransi resmi & teruji' },
    { icon: <FaTruck className="w-5 h-5" />, title: 'Pengiriman Cepat', desc: 'Ke seluruh Indonesia' },
    { icon: <Lock className="w-5 h-5" />, title: 'Pembayaran Aman', desc: 'Transfer, e-wallet, COD' },
    { icon: <FaHeadset className="w-5 h-5" />, title: 'Support 24 Jam', desc: 'Konsultasi via WhatsApp' },
    { icon: <FaCircleCheck className="w-5 h-5" />, title: 'Harga Terbaik', desc: 'Garansi harga termurah' },
  ];

  return (
    <section aria-label="Keunggulan SafeHome Store" className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none sm:grid sm:grid-cols-3 md:grid-cols-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all duration-200 min-w-[160px] sm:min-w-0 flex-shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-gray-900 truncate">{item.title}</p>
                <p className="text-[10px] sm:text-[11px] text-gray-500 truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY CHOOSE US ────────────────────────────────────────────────────────────
function WhyChooseUs() {
  const reasons = [
    {
      icon: <FaShieldHalved className="w-5 h-5" />,
      title: 'Produk 100% Original',
      desc: 'Semua item bersumber langsung dari distributor resmi dengan sertifikat autentisitas.',
    },
    {
      icon: <FaCircleCheck className="w-5 h-5" />,
      title: 'Garansi 1 Tahun',
      desc: 'Garansi resmi pabrik berlaku penuh — klaim mudah langsung via WhatsApp.',
    },
    {
      icon: <Tag className="w-5 h-5" />,
      title: 'Harga Terjangkau',
      desc: 'Harga bersaing tanpa mengorbankan kualitas — transparan tanpa biaya tersembunyi.',
    },
    {
      icon: <FaTruck className="w-5 h-5" />,
      title: 'Pengiriman Kilat',
      desc: 'Proses dalam 1×24 jam, dikirim lewat ekspedisi terpercaya dengan resi lacak.',
    },
    {
      icon: <FaHeadset className="w-5 h-5" />,
      title: 'CS Responsif',
      desc: 'Tim kami siap membantu kapan saja — konsultasi produk, instalasi, dan klaim garansi.',
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Transaksi Aman',
      desc: 'Pembayaran terenkripsi end-to-end. Data Anda aman, kami tidak menjual informasi pribadi.',
    },
  ];

  return (
    <section id="tentang" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <RevealSection>
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full">
            Mengapa Kami?
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-4">
            6 Alasan Pelanggan Mempercayai SafeHome Store
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Bukan sekadar toko — kami adalah mitra keamanan rumah Anda jangka panjang.
          </p>
        </div>
      </RevealSection>

      <RevealSection>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                {r.icon}
              </div>
              <h3 className="text-[12px] sm:text-[13px] font-bold text-gray-900 mb-1.5 leading-snug">{r.title}</h3>
              <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </RevealSection>
    </section>
  );
}

// ─── BEST SELLER SECTION ──────────────────────────────────────────────────────
const BestSellerSection = memo(function BestSellerSection({
  product,
  cartLoadingId,
  successId,
  onAddToCart,
}: {
  product: Product;
  cartLoadingId: number | null;
  successId: number | null;
  onAddToCart: (id: number, img: string | null, e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const hargaAsli = Math.floor(product.harga / (1 - 0.15));

  return (
    <RevealSection>
      <section aria-label="Produk terlaris" className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-orange-500/25">
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <ShieldCheck className="absolute -bottom-8 -right-8 w-64 h-64 text-white" />
          </div>

          <div className="relative px-4 sm:px-5 pt-4 sm:pt-5 pb-2 flex items-center gap-2">
            <FaFire className="w-4 h-4 text-orange-200 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-black text-orange-100 uppercase tracking-widest">
              🔥 Produk Terlaris Minggu Ini
            </span>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-5 px-4 sm:px-5 pb-5 sm:pb-6">
            {/* Image */}
            <div className="w-32 h-32 sm:w-48 sm:h-48 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center p-3 sm:p-4 flex-shrink-0 border border-white/25 shadow-inner">
              <img
                src={product.gambar1 || '/placeholder.png'}
                alt={product.nama}
                className="max-w-full max-h-full object-contain drop-shadow-xl"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left w-full">
              <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                <StarRating />
                <span className="text-[11px] text-orange-100 ml-1">4.9 · Terjual 500+</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-snug mb-2 line-clamp-2">
                {product.nama}
              </h2>
              <div className="flex items-baseline justify-center sm:justify-start gap-2 sm:gap-2.5 mb-4 sm:mb-5">
                <span className="text-lg sm:text-xl font-black text-white">
                  Rp {Number(product.harga).toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-orange-200 line-through">
                  Rp {hargaAsli.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">-15%</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                <button
                  disabled={cartLoadingId === product.id}
                  onClick={(e) => onAddToCart(product.id, product.gambar1, e)}
                  aria-label={`Tambah ${product.nama} ke keranjang`}
                  className={`inline-flex items-center gap-2 text-sm font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 active:scale-95 shadow-sm focus-visible:outline-2 focus-visible:outline-white min-h-[44px] ${
                    successId === product.id
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : 'bg-white text-orange-600 hover:bg-orange-50 shadow-white/20'
                  }`}
                >
                  {successId === product.id ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Masuk Keranjang!</span>
                    </>
                  ) : (
                    <>
                      <FaCartShopping className="w-4 h-4" />
                      <span>{cartLoadingId === product.id ? 'Memproses...' : 'Tambah ke Keranjang'}</span>
                    </>
                  )}
                </button>
                <Link
                  href={`/product/${product.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-orange-100 hover:text-white font-semibold transition-colors underline-offset-2 hover:underline min-h-[44px] items-center"
                >
                  Lihat detail produk <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
});

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqSection() {
  const faqs = [
    {
      q: 'Apakah produk CCTV dan smart lock di sini original?',
      a: 'Ya, seluruh produk di SafeHome Store adalah barang original dengan garansi resmi dan jaminan pembaruan firmware berkala.',
    },
    {
      q: 'Berapa lama estimasi pengiriman?',
      a: 'Pesanan diproses dalam 1×24 jam dan dikirim ke seluruh Indonesia menggunakan ekspedisi terpercaya dengan nomor resi yang bisa dilacak.',
    },
    {
      q: 'Apakah ada layanan pemasangan untuk CCTV?',
      a: 'Kami melayani konsultasi pemasangan via WhatsApp, termasuk rekomendasi jasa instalasi sesuai lokasi Anda.',
    },
    {
      q: 'Metode pembayaran apa yang tersedia?',
      a: 'Tersedia transfer bank, e-wallet, dan COD (Cash on Delivery) untuk area tertentu — semua transaksi terenkripsi dan aman.',
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <RevealSection>
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full">
            FAQ
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Belum menemukan jawaban? Hubungi kami langsung via WhatsApp.
          </p>
        </div>

        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'border-orange-300 shadow-sm shadow-orange-100'
                    : 'border-gray-200 hover:border-orange-200'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-inset min-h-[52px]"
                >
                  <span className="text-sm font-semibold text-gray-800 leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 sm:px-5 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </RevealSection>
    </section>
  );
}

// ─── WHATSAPP FLOATING CS ─────────────────────────────────────────────────────
function WhatsAppCS() {
  const [isOpen, setIsOpen] = useState(false);
  const phone = '6285881941073';

  const faqs = [
    {
      question: '📦 Cek status pengiriman',
      message:
        'Halo SafeHome Store, saya mau cek status pengiriman pesanan saya dengan nomor resi/invoice: ',
    },
    {
      question: '🛡️ Konsultasi sistem keamanan',
      message:
        'Halo Admin, saya butuh rekomendasi paket CCTV atau smart lock untuk rumah saya.',
    },
    {
      question: '🔧 Info garansi & klaim',
      message:
        'Halo SafeHome Store, saya ingin tahu detail klaim garansi produk dan layanan pemasangan.',
    },
    {
      question: '💳 Metode pembayaran',
      message:
        'Halo Admin, apakah tersedia pembayaran via transfer bank, e-wallet, atau COD?',
    },
  ];

  return (
    <div className="fixed bottom-5 sm:bottom-6 right-4 sm:right-5 z-[999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[288px] sm:w-[340px] overflow-hidden"
            role="dialog"
            aria-label="Bantuan Customer Service WhatsApp"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center relative">
                  <FaMessage className="w-4 h-4" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-300 rounded-full border-2 border-emerald-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Customer Service</h3>
                  <p className="text-[11px] text-emerald-100">Online · Siap membantu</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Tutup chat CS"
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Pertanyaan Populer
              </p>
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    window.open(
                      `https://wa.me/${phone}?text=${encodeURIComponent(faq.message)}`,
                      '_blank'
                    );
                    setIsOpen(false);
                  }}
                  className="w-full text-left bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-emerald-700 transition-all shadow-sm min-h-[44px]"
                >
                  {faq.question}
                </button>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-gray-100">
              <button
                onClick={() => {
                  window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent(
                      'Halo Admin SafeHome Store, saya butuh bantuan...'
                    )}`,
                    '_blank'
                  );
                  setIsOpen(false);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-95 min-h-[44px]"
              >
                <FaWhatsapp className="w-4 h-4" />
                Mulai Percakapan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Tutup chat' : 'Hubungi CS via WhatsApp'}
        aria-expanded={isOpen}
        className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-shadow hover:shadow-2xl hover:shadow-emerald-500/50 relative"
      >
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white z-10">
            <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75" />
          </span>
        )}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="x"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              key="wa"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <FaWhatsapp className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// ─── PRODUCT CARD — premium redesign ─────────────────────────────────────────
const ProductCard = memo(function ProductCard({
  product,
  cartLoadingId,
  successId,
  onAddToCart,
}: {
  product: Product;
  cartLoadingId: number | null;
  successId: number | null;
  onAddToCart: (id: number, img: string | null, e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const hargaAsli = Math.floor(product.harga / (1 - 0.15));
  const isLoading = cartLoadingId === product.id;
  const isSuccess = successId === product.id;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <motion.article
      variants={cardItem}
      className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/60 hover:border-orange-200/70 hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      {/* Image area */}
      <Link
        href={`/product/${product.id}`}
        className="block relative"
        aria-label={`Lihat detail ${product.nama}`}
      >
        <div className="aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100/50 relative overflow-hidden flex items-center justify-center p-3 sm:p-4">
          {/* Discount badge */}
          <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 z-10 shadow-sm shadow-red-500/30">
            <Percent className="w-2 h-2" /> 15%
          </span>

          {/* Stock badge */}
          {isLowStock && (
            <span className="absolute top-2 right-2 bg-gray-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 backdrop-blur-sm">
              Sisa {product.stock}
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute top-2 right-2 bg-gray-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
              Habis
            </span>
          )}

          <img
            src={product.gambar1 || '/placeholder.png'}
            alt={product.nama}
            className={`max-w-full max-h-full object-contain transition-transform duration-400 group-hover:scale-110 mix-blend-multiply ${
              isOutOfStock ? 'opacity-50 grayscale' : ''
            }`}
            loading="lazy"
            decoding="async"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/4 transition-colors duration-300 pointer-events-none" />
        </div>
      </Link>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-1 flex-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 min-h-[28px] sm:min-h-[32px] leading-snug group-hover:text-orange-500 transition-colors duration-200">
            {product.nama}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <StarRating size="xs" />
          <span className="text-[10px] text-gray-400 font-medium">4.9</span>
          <span className="text-[9px] text-gray-300 ml-0.5">(500+)</span>
        </div>

        {/* Price */}
        <div className="mt-1.5 mb-2">
          <p className="text-sm font-extrabold text-gray-950 tracking-tight">
            Rp {Number(product.harga).toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-gray-400 line-through">
            Rp {hargaAsli.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-3 pb-3 mt-auto">
        {!isOutOfStock ? (
          <button
            disabled={isLoading}
            onClick={(e) => onAddToCart(product.id, product.gambar1, e)}
            aria-label={`Tambah ${product.nama} ke keranjang`}
            className={`w-full text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-500 min-h-[40px] ${
              isSuccess
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : 'bg-gray-900 hover:bg-orange-500 text-white shadow-sm hover:shadow-md hover:shadow-orange-500/25'
            }`}
          >
            {isSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <FaCartShopping className="w-3 h-3" />
                <span>{isLoading ? 'Memuat...' : 'Keranjang'}</span>
              </>
            )}
          </button>
        ) : (
          <span
            className="w-full text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center bg-gray-100 text-gray-400 cursor-not-allowed min-h-[40px]"
            aria-label="Stok habis"
          >
            Stok Habis
          </span>
        )}
      </div>
    </motion.article>
  );
});

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [cartCount, setCartCount] = useState(0);
  const [cartLoadingId, setCartLoadingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [bestSellerProduct, setBestSellerProduct] = useState<Product | null>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const cartIconRef = useRef<HTMLAnchorElement>(null);

  const categories = [
    { name: 'Kunci', keyword: 'kunci', icon: <FaKey className="w-5 h-5" /> },
    { name: 'CCTV', keyword: 'cctv', icon: <Cctv className="w-5 h-5" /> },
    { name: 'Aksesoris Motor', keyword: 'motor', icon: <FaMotorcycle className="w-5 h-5" /> },
    { name: 'Aksesoris HP', keyword: 'hp', icon: <Smartphone className="w-5 h-5" /> },
    { name: 'Perangkap', keyword: 'perangkap', icon: <Sparkles className="w-5 h-5" /> },
    { name: 'Brankas', keyword: 'brankas', icon: <FaVault className="w-5 h-5" /> },
    { name: 'Sensor', keyword: 'sensor', icon: <SensorIcon className="w-5 h-5" /> },
    { name: 'Lampu', keyword: 'lampu', icon: <FaLightbulb className="w-5 h-5" /> },
    { name: 'Gembok', keyword: 'gembok', icon: <FaLock className="w-5 h-5" /> },
    { name: 'Alarm', keyword: 'alarm', icon: <FaBell className="w-5 h-5" /> },
    { name: 'Akses Biometrik', keyword: 'fingerprint', icon: <FaFingerprint className="w-5 h-5" /> },
    { name: 'Interkom', keyword: 'intercom', icon: <FaMicrophone className="w-5 h-5" /> },
    { name: 'Detektor Api', keyword: 'fire', icon: <FaFireExtinguisher className="w-5 h-5" /> },
    { name: 'Peralatan', keyword: 'peralatan', icon: <FaHammer className="w-5 h-5" /> },
    { name: 'Sistem Wi-Fi', keyword: 'wifi', icon: <FaWifi className="w-5 h-5" /> },
    { name: 'Panel Surya', keyword: 'solar', icon: <FaSolarPanel className="w-5 h-5" /> },
    { name: 'Smart Hub', keyword: 'hub', icon: <FaHouseSignal className="w-5 h-5" /> },
    { name: 'Suku Cadang', keyword: 'sparepart', icon: <FaWrench className="w-5 h-5" /> },
    { name: 'Penjaga Sinyal', keyword: 'booster', icon: <FaTowerBroadcast className="w-5 h-5" /> },
    { name: 'Kabel Saklar', keyword: 'kabel', icon: <FaPlug className="w-5 h-5" /> },
    { name: 'Atribut Patroli', keyword: 'patroli', icon: <FaUserShield className="w-5 h-5" /> },
    { name: 'Kotak P3K', keyword: 'p3k', icon: <FaKitMedical className="w-5 h-5" /> },
    { name: 'Gesper Safety', keyword: 'safety', icon: <FaShieldHalved className="w-5 h-5" /> },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const refreshCartCount = useCallback(async () => {
    const sessionId = getOrCreateSessionId();
    try {
      const { data } = await supabase
        .from('carts')
        .select('quantity')
        .eq('session_id', sessionId);
      if (data) setCartCount(data.reduce((sum, item) => sum + (item.quantity || 0), 0));
    } catch (e) {
      console.error(e);
    }
  }, []);

  async function initAppData() {
    try {
      const [allRes, bsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').eq('id', 15).maybeSingle(),
      ]);
      if (allRes.data) setProducts(allRes.data as Product[]);
      if (bsRes.data) setBestSellerProduct(bsRes.data as Product);
      await refreshCartCount();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = useCallback(
    async (productId: number, imageUrl: string | null, event: React.MouseEvent<HTMLButtonElement>) => {
      if (cartLoadingId === productId) return;
      setCartLoadingId(productId);
      const sessionId = getOrCreateSessionId();

      if (cartIconRef.current) {
        const br = event.currentTarget.getBoundingClientRect();
        const cr = cartIconRef.current.getBoundingClientRect();
        const newItem: FlyingItem = {
          id: `${productId}-${Date.now()}`,
          startX: br.left + br.width / 2 - 20,
          startY: br.top + br.height / 2 - 20,
          endX: cr.left + cr.width / 2 - 20,
          endY: cr.top + cr.height / 2 - 20,
          image: imageUrl || '/placeholder.png',
        };
        setFlyingItems((p) => [...p, newItem]);
      }

      try {
        const { data: existing } = await supabase
          .from('carts')
          .select('*')
          .eq('session_id', sessionId)
          .eq('product_id', productId)
          .maybeSingle();
        if (existing) {
          await supabase
            .from('carts')
            .update({ quantity: existing.quantity + 1 })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('carts')
            .insert({ session_id: sessionId, product_id: productId, quantity: 1 });
        }
        await refreshCartCount();
        setSuccessId(productId);
        setTimeout(() => setSuccessId(null), 2000);
      } catch (e) {
        console.error(e);
      } finally {
        setCartLoadingId(null);
      }
    },
    [cartLoadingId, refreshCartCount]
  );

  const handleAnimationComplete = useCallback((id: string) => {
    setFlyingItems((p) => p.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    setIsMounted(true);
    initAppData();
    const t = setTimeout(() => {
      setShowSplash(false);
      setShowAlert(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory ? p.nama.toLowerCase().includes(selectedCategory.toLowerCase()) : true;
    return matchSearch && matchCat;
  });
  const displayedProducts = filteredProducts.slice(0, visibleCount);

  if (!isMounted) return null;

  return (
    <>
      <SeoHead />

      <div className="bg-[#f8f9fa] min-h-screen text-gray-800 antialiased font-sans relative select-none">

        {/* ── Flying items to cart ── */}
        <div
          className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
          aria-hidden="true"
        >
          {flyingItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ left: item.startX, top: item.startY, scale: 1, opacity: 1 }}
              animate={{ left: item.endX, top: item.endY, scale: 0.2, opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              onAnimationComplete={() => handleAnimationComplete(item.id)}
              className="fixed w-10 h-10 rounded-xl bg-white border border-orange-200 shadow-md p-1 flex items-center justify-center overflow-hidden"
            >
              <img
                src={item.image}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          ))}
        </div>

        {/* ── SPLASHSCREEN ── */}
        <AnimatePresence>
          {showSplash && (
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center"
              role="status"
              aria-label="Memuat SafeHome Store"
            >
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-4"
              >
                <img
                  src="/logo.png"
                  alt="SafeHome Store Logo"
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback icon */}
                <div className="w-16 h-16 rounded-2xl bg-orange-500 items-center justify-center shadow-lg shadow-orange-500/30 hidden">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    safehome<span className="text-orange-500">store</span>
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">Sistem Keamanan Rumah Terpercaya</p>
                </div>
                <div className="flex gap-1.5 mt-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-orange-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BEST SELLER POP-UP ── */}
        <AnimatePresence>
          {showAlert && bestSellerProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAlert(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 relative z-10"
                role="dialog"
                aria-label="Promo produk terlaris"
                aria-modal="true"
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/90 uppercase tracking-widest">
                    <FaFire className="w-3 h-3 animate-pulse" /> Produk Terlaris
                  </span>
                  <button
                    onClick={() => setShowAlert(false)}
                    aria-label="Tutup popup"
                    className="p-1.5 rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex flex-col items-center">
                  <div className="w-44 h-44 bg-gray-50 rounded-2xl p-4 flex items-center justify-center mb-4 border border-gray-100">
                    <img
                      src={bestSellerProduct.gambar1 || '/placeholder.png'}
                      alt={bestSellerProduct.nama}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 text-center leading-snug px-1">
                    {bestSellerProduct.nama}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <StarRating size="xs" />
                    <span className="text-[11px] text-gray-400">(4.9 · 500+ terjual)</span>
                  </div>
                  <div className="flex items-baseline gap-2.5 mb-5">
                    <span className="text-xs text-gray-400 line-through">
                      Rp {Math.floor(bestSellerProduct.harga / (1 - 0.15)).toLocaleString('id-ID')}
                    </span>
                    <span className="text-lg font-black text-gray-950">
                      Rp {Number(bestSellerProduct.harga).toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full border border-red-100">
                      -15%
                    </span>
                  </div>

                  <button
                    disabled={cartLoadingId === bestSellerProduct.id}
                    onClick={(e) =>
                      handleAddToCart(bestSellerProduct.id, bestSellerProduct.gambar1, e)
                    }
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-emerald-500 disabled:to-emerald-600 text-white text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20 active:scale-95 min-h-[48px]"
                  >
                    {successId === bestSellerProduct.id ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Berhasil Dimasukkan!</span>
                      </>
                    ) : (
                      <>
                        <FaCartShopping className="w-4 h-4" />
                        <span>
                          {cartLoadingId === bestSellerProduct.id ? 'Memproses...' : 'Tambah ke Keranjang'}
                        </span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/product/${bestSellerProduct.id}`}
                    onClick={() => setShowAlert(false)}
                    className="mt-3 text-[11px] text-gray-400 hover:text-orange-500 hover:underline flex items-center gap-1 transition-colors min-h-[36px]"
                  >
                    Lihat detail produk <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── NAVBAR ── */}
        <nav
          role="navigation"
          aria-label="Navigasi utama SafeHome Store"
          className={`sticky top-0 z-50 transition-all duration-300 ${
            navScrolled
              ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-sm'
              : 'bg-white border-b border-gray-100'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
            {/* Logo */}
            <Link
              href="/"
              aria-label="SafeHome Store - Halaman Utama"
              className="flex items-center gap-2 active:scale-95 transition-transform flex-shrink-0"
            >
              <img
                src="/logo.png"
                alt="SafeHome Store"
                className="h-7 sm:h-8 w-auto object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              {/* Fallback */}
              <div className="hidden w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-500 items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-gray-900">
                safehome<span className="text-orange-500">store</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5" role="menubar">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  role="menuitem"
                  className="text-sm font-medium text-gray-600 hover:text-orange-500 px-3 py-2 rounded-xl hover:bg-orange-50 transition-all"
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-[200px] sm:max-w-xs md:max-w-sm w-full">
              <label htmlFor="search-produk" className="sr-only">
                Cari produk keamanan rumah
              </label>
              <input
                id="search-produk"
                type="search"
                inputMode="search"
                autoComplete="off"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(8);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-8 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 h-9 sm:h-10"
              />
              <Search
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setVisibleCount(8);
                  }}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Social icons (desktop only) */}
            <div className="hidden lg:flex items-center gap-1">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ikuti kami di ${s.label}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${s.color}`}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Cart */}
            <Link
              ref={cartIconRef}
              href="/cart"
              aria-label={`Keranjang belanja, ${cartCount} item`}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2 sm:p-2.5 bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-xl relative text-gray-700 hover:text-orange-500 transition-all flex items-center justify-center flex-shrink-0"
            >
              <FaCartShopping className="w-4 h-4" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white leading-none"
                    aria-hidden="true"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
              className="md:hidden min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2 rounded-xl border border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-500 transition-colors flex items-center justify-center flex-shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu Drawer ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                aria-hidden="true"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 350, damping: 38 }}
                className="fixed right-0 top-0 h-full w-72 bg-white z-[70] shadow-2xl flex flex-col"
                role="dialog"
                aria-label="Menu navigasi mobile"
                aria-modal="true"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <img
                      src="/logo.png"
                      alt="SafeHome Store"
                      className="h-7 w-auto object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="font-extrabold text-gray-900 text-sm">
                      safehome<span className="text-orange-500">store</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Tutup menu"
                    className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1" role="menu">
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      role="menuitem"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors min-h-[48px]"
                    >
                      <l.icon className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      {l.label}
                    </a>
                  ))}
                </nav>

                <div className="px-5 py-4 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ikuti Kami</p>
                  <div className="flex gap-2 flex-wrap">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Buka ${s.label}`}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 ${s.color} hover:scale-105 transition-transform`}
                      >
                        <s.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── HERO ── */}
        <HeroSection />

        {/* ── TRUST ── */}
        <TrustHighlights />

        {/* ── PROMO BANNER ── */}
        <div className="pt-4 sm:pt-6">
          <PromoBanner />
        </div>

        {/* ── BEST SELLER ── */}
        {bestSellerProduct && (
          <div className="mt-3 sm:mt-4">
            <BestSellerSection
              product={bestSellerProduct}
              cartLoadingId={cartLoadingId}
              successId={successId}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {/* ── CATEGORY ── */}
        <section aria-labelledby="kategori-heading" className="bg-white border-y border-gray-100 mt-3 sm:mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h2
                id="kategori-heading"
                className="text-sm font-extrabold text-gray-900 tracking-tight uppercase"
              >
                Kategori Terpopuler
              </h2>
              {selectedCategory && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setVisibleCount(8);
                  }}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1.5 font-semibold transition-colors min-h-[36px] px-2"
                >
                  <X className="w-3.5 h-3.5" /> Hapus Filter
                </button>
              )}
            </div>

            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none snap-x md:flex-wrap md:overflow-x-visible md:pb-0">
              {categories.map((cat, i) => {
                const active = selectedCategory === cat.keyword;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedCategory(active ? null : cat.keyword);
                      setVisibleCount(8);
                    }}
                    aria-pressed={active}
                    aria-label={`Filter kategori ${cat.name}`}
                    className="flex flex-col items-center gap-1.5 min-w-[70px] sm:min-w-[80px] cursor-pointer group flex-shrink-0 snap-start active:scale-95 transition-transform"
                  >
                    <div
                      className={`border rounded-2xl flex items-center justify-center transition-all duration-200 ${
                        active
                          ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/30'
                          : 'bg-gray-50 border-gray-100 text-gray-600 group-hover:text-orange-500 group-hover:bg-orange-50/60 group-hover:border-orange-200'
                      }`}
                      style={{ width: 48, height: 48 }}
                    >
                      {cat.icon}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-medium text-center line-clamp-2 px-0.5 tracking-tight max-w-[72px] leading-tight ${
                        active
                          ? 'text-orange-600 font-bold'
                          : 'text-gray-600 group-hover:text-orange-500'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── PRODUCT GRID ── */}
        <main id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
              {selectedCategory
                ? `Kategori: ${categories.find((c) => c.keyword === selectedCategory)?.name}`
                : 'Semua Produk Keamanan Rumah'}
            </h2>
          </div>

          <div className="bg-white px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-200 flex justify-between items-center mb-4 sm:mb-6 text-xs">
            <p className="text-gray-600">
              Menampilkan{' '}
              <span className="font-bold text-gray-900">{displayedProducts.length}</span> dari{' '}
              <span className="font-bold text-gray-900">{filteredProducts.length}</span> produk
            </p>
            <div className="flex items-center gap-1.5 font-semibold text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl bg-gray-50">
              <ListFilter className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
              Terbaru
            </div>
          </div>

          {loading ? (
            <div
              className="text-center py-20 sm:py-24 flex flex-col items-center gap-3"
              role="status"
              aria-live="polite"
            >
              <div className="w-7 h-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-xs">Memuat produk...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              className="text-center py-16 sm:py-20 bg-white rounded-2xl border border-gray-200"
              role="status"
            >
              <Store className="w-12 h-12 text-gray-200 mx-auto mb-3" aria-hidden="true" />
              <p className="text-gray-500 text-sm font-semibold">Produk tidak ditemukan</p>
              <p className="text-xs text-gray-400 mt-1">Coba kata kunci lain atau hapus filter</p>
              {selectedCategory && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                    setVisibleCount(8);
                  }}
                  className="mt-4 text-xs text-orange-500 hover:text-orange-600 font-bold underline underline-offset-2 transition-colors min-h-[40px] px-4"
                >
                  Lihat semua produk
                </button>
              )}
            </div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4"
                aria-label="Daftar produk"
              >
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartLoadingId={cartLoadingId}
                    successId={successId}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </motion.div>

              {filteredProducts.length > visibleCount && (
                <div className="flex justify-center mt-8 sm:mt-10">
                  <button
                    onClick={() => setVisibleCount((p) => p + 8)}
                    className="bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 text-gray-700 text-sm font-bold px-8 py-3 rounded-2xl flex items-center gap-2 shadow-sm transition-all duration-200 active:scale-95 min-h-[48px]"
                  >
                    Lihat Lebih Banyak <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* ── WHY CHOOSE US ── */}
        <WhyChooseUs />

        {/* ── SECURITY DATA SECTION ── */}
        <section
          aria-label="Keamanan data SafeHome Store"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-6"
        >
          <RevealSection>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-800 relative overflow-hidden">
              <div
                className="absolute -right-12 -bottom-12 text-gray-800/10 pointer-events-none"
                aria-hidden="true"
              >
                <ShieldCheck className="w-72 h-72" />
              </div>
              <div className="max-w-2xl relative z-10">
                <span className="text-[10px] font-black tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg uppercase">
                  100% Privacy &amp; Security Guaranteed
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-4 mb-4 leading-tight">
                  Belanja Perangkat Keamanan Rumah Jadi Lebih Tenang di SafeHome Store
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                  Lebih dari sekadar toko, kami adalah partner andalan Anda dalam membangun ekosistem rumah
                  yang cerdas dan terproteksi. Integrasi sistem kami dirancang tanpa celah untuk privasi
                  tingkat tinggi.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 border-t border-gray-800 pt-5 sm:pt-6">
                  {[
                    {
                      icon: <Lock className="w-4 h-4" />,
                      title: 'Enkripsi End-to-End',
                      desc: 'Data transaksi dan kredensial akun Anda dienkripsi ketat tanpa log pihak ketiga.',
                    },
                    {
                      icon: <UserCheck className="w-4 h-4" />,
                      title: 'Produk Resmi & Teruji',
                      desc: 'Kami hanya mendistribusikan perangkat original dengan jaminan pembaruan firmware berkala.',
                    },
                    {
                      icon: <ServerCrash className="w-4 h-4" />,
                      title: 'Proteksi Server Cloud',
                      desc: 'Sinkronisasi data dilakukan secara privat melalui cloud aman berbasis industri global.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-100">{item.title}</h3>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ── FAQ ── */}
        <FaqSection />

        {/* ── CTA WhatsApp Banner ── */}
        <section
          aria-label="Hubungi SafeHome Store"
          className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-12"
        >
          <RevealSection>
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-white shadow-lg shadow-emerald-500/20">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                  <FaGift className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base lg:text-lg leading-snug">
                    Butuh rekomendasi paket keamanan rumah?
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-50/90 mt-0.5">
                    Tim kami siap bantu pilih produk yang paling sesuai kebutuhan Anda.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5 justify-center flex-shrink-0">
                <a
                  href="https://wa.me/6285881941073"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-600 font-bold text-sm px-5 py-3 rounded-2xl shadow-sm hover:bg-emerald-50 transition-all active:scale-95 min-h-[48px]"
                >
                  <FaWhatsapp className="w-4 h-4" /> Chat WhatsApp
                </a>
                <a
                  href="#katalog"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-5 py-3 rounded-2xl transition-all active:scale-95 min-h-[48px]"
                >
                  Lihat Produk <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-white border-t border-gray-200 pt-10 sm:pt-12 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-8 sm:pb-10">
              <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-4" aria-label="SafeHome Store">
                  <img
                    src="/logo.png"
                    alt="SafeHome Store Logo"
                    className="h-8 w-auto object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-lg font-extrabold tracking-tight text-gray-900">
                    safehome<span className="text-orange-500">store</span>
                  </span>
                </Link>
                <p className="text-xs text-gray-500 leading-relaxed mb-5">
                  Toko CCTV, smart lock, dan perlengkapan keamanan rumah modern terpercaya untuk rumah dan
                  kantor di seluruh Indonesia.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ikuti di ${s.label}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 ${s.color} hover:scale-105 hover:border-gray-200 transition-transform`}
                    >
                      <s.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Kategori</h3>
                <ul className="space-y-2.5 text-xs text-gray-500">
                  <li>
                    <Link href="/?kategori=cctv" className="hover:text-orange-500 transition-colors">
                      CCTV Wireless &amp; Online
                    </Link>
                  </li>
                  <li>
                    <Link href="/?kategori=kunci" className="hover:text-orange-500 transition-colors">
                      Smart Lock &amp; Kunci Digital
                    </Link>
                  </li>
                  <li>
                    <Link href="/?kategori=alarm" className="hover:text-orange-500 transition-colors">
                      Alarm Rumah Pintar
                    </Link>
                  </li>
                  <li>
                    <Link href="/?kategori=brankas" className="hover:text-orange-500 transition-colors">
                      Brankas &amp; Keamanan Kantor
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Bantuan</h3>
                <ul className="space-y-2.5 text-xs text-gray-500">
                  <li>
                    <Link href="/cart" className="hover:text-orange-500 transition-colors">
                      Keranjang Belanja
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/6285881941073"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Cek Status Pesanan
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/6285881941073"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-500 transition-colors"
                    >
                      Klaim Garansi
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-orange-500 transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Kontak</h3>
                <a
                  href="https://wa.me/6285881941073"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <FaWhatsapp className="w-4 h-4" /> +62 858-8194-1073
                </a>
                <div className="flex items-center gap-1.5 mt-5">
                  <StarRating size="xs" />
                  <span className="text-[11px] text-gray-500 ml-0.5">
                    4.9 dari 12.000+ pelanggan
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
              <p>
                © 2026 SafeHome Store — Toko CCTV, Smart Lock &amp; Perlengkapan Keamanan Rumah Terpercaya
                Indonesia.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Kebijakan Privasi
                </a>
                <a href="#" className="hover:text-gray-600 transition-colors">
                  Syarat &amp; Ketentuan
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* ── WhatsApp CS ── */}
        <WhatsAppCS />
      </div>
    </>
  );
}