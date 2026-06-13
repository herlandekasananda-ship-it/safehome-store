'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence, Variant, Variants } from 'framer-motion';

// IKON UTAMA DARI LUCIDE
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
} from 'lucide-react';

// IKON KATEGORI & FUNGSIONAL DARI REACT ICONS
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
} from 'react-icons/fa6';

import { MdOutlineSensors as SensorIcon } from 'react-icons/md';

import { getOrCreateSessionId } from '@/lib/session';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 22 } },
};

const fadeUp: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// =====================================================
// PROMO BANNER (slider premium dengan dot indicator)
// =====================================================
function PromoBanner() {
  const banners = ['/baner1.png', '/baner2.png', '/baner3.png', '/baner4.png', '/baner5.png', '/baner6.png'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="w-full bg-[#f8f9fa] pb-6" aria-label="Promo banner">
      <div className="max-w-7xl mx-auto px-4 relative group">
        <div className="relative h-[160px] sm:h-[300px] md:h-[380px] w-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={banners[currentIndex]}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              alt={`Promo perlengkapan keamanan rumah SafeHome Store ${currentIndex + 1}`}
              className="w-full h-full object-cover absolute top-0 left-0 select-none"
            />
          </AnimatePresence>

          {/* Gradient overlay halus untuk premium feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            aria-label="Banner sebelumnya"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-20 hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            aria-label="Banner selanjutnya"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-20 hover:scale-105"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dot indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Lihat banner ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// HERO SECTION - thesis statement halaman
// =====================================================
function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-white to-[#f8f9fa] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-6 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp }
            className="order-2 md:order-1"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <FaShieldHalved className="w-3 h-3" aria-hidden="true" />
              Toko CCTV &amp; Smart Lock Terpercaya
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight mb-3">
              Lindungi Rumah &amp; Kantor Anda dengan{' '}
              <span className="text-orange-500">Sistem Keamanan Pintar</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-6 max-w-md">
              Belanja CCTV wireless, smart lock, alarm rumah pintar, dan perlengkapan
              keamanan rumah modern original dengan harga bersahabat — pengiriman
              cepat ke seluruh Indonesia.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#katalog"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-sm shadow-orange-500/20 transition-all active:scale-95"
              >
                <FaCartShopping className="w-3.5 h-3.5" aria-hidden="true" />
                Belanja Sekarang
              </a>
              <a
                href="https://wa.me/6285881941073"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold px-5 py-3 rounded-xl border border-gray-200 hover:border-emerald-400 transition-all active:scale-95"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                Konsultasi Gratis
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="flex text-orange-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="w-3.5 h-3.5" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-900">4.9/5</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <p className="text-xs text-gray-500">
                Dipercaya <span className="font-bold text-gray-900">12.000+</span> pelanggan
                di seluruh Indonesia
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp }
            transition={{ delay: 0.1 }}
            className="order-1 md:order-2 relative"
          >
            <div className="aspect-[4/3] w-full rounded-2xl bg-gray-900 relative overflow-hidden shadow-lg border border-gray-800">
              <img
                src="/baner1.png"
                alt="Sistem CCTV dan kamera keamanan rumah SafeHome Store"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />

              {/* Floating trust card */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 shadow-md">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <FaCircleCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">Garansi Resmi 1 Tahun</p>
                  <p className="text-[10px] text-gray-500">Produk 100% original</p>
                </div>
              </div>
            </div>

            {/* Floating discount badge */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-orange-500 text-white rounded-2xl px-3 py-2 shadow-lg shadow-orange-500/30 rotate-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide leading-none opacity-90">Diskon s.d.</p>
              <p className="text-lg font-black leading-tight">15%</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// TRUST / KEUNGGULAN SECTION (4 poin singkat)
// =====================================================
function TrustHighlights() {
  const items = [
    {
      icon: <FaShieldHalved className="w-4 h-4" aria-hidden="true" />,
      title: 'Produk Original',
      desc: 'Bergaransi resmi & teruji',
    },
    {
      icon: <FaTruck className="w-4 h-4" aria-hidden="true" />,
      title: 'Pengiriman Cepat',
      desc: 'Ke seluruh Indonesia',
    },
    {
      icon: <Lock className="w-4 h-4" aria-hidden="true" />,
      title: 'Pembayaran Aman',
      desc: 'Transfer, e-wallet, COD',
    },
    {
      icon: <FaHeadset className="w-4 h-4" aria-hidden="true" />,
      title: 'CS Responsif',
      desc: 'Konsultasi via WhatsApp',
    },
  ];

  return (
    <section className="bg-white border-y border-gray-100" aria-label="Keunggulan SafeHome Store">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 leading-tight truncate">{item.title}</p>
                <p className="text-[11px] text-gray-500 leading-tight truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// FAQ SECTION SINGKAT
// =====================================================
function FaqSection() {
  const faqs = [
    {
      q: 'Apakah produk CCTV dan smart lock di sini original?',
      a: 'Ya, seluruh produk di SafeHome Store adalah barang original dengan garansi resmi dan jaminan pembaruan firmware berkala.',
    },
    {
      q: 'Berapa lama estimasi pengiriman?',
      a: 'Pesanan diproses dalam 1x24 jam dan dikirim ke seluruh Indonesia menggunakan ekspedisi terpercaya dengan nomor resi yang bisa dilacak.',
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

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10" aria-labelledby="faq-heading">
      <div className="text-center mb-8">
        <h2 id="faq-heading" className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
          Belum menemukan jawaban? Hubungi tim kami langsung via WhatsApp.
        </p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-colors hover:border-orange-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
              >
                <span className="text-sm font-semibold text-gray-800">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`}
                  aria-hidden="true"
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
                    <p className="px-4 pb-4 text-xs sm:text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// =====================================================
// KOMPONEN BUTTON CS WHATSAPP & FAQ MELAYANG
// =====================================================
function WhatsAppCS() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '6285881941073';

  const faqs = [
    {
      question: '📦 Bagaimana cara cek resi/pengiriman?',
      message: 'Halo SafeHome Store, saya mau tanya mengenai status pengiriman pesanan saya dengan nomor resi/invoice berikut: ',
    },
    {
      question: '🛡️ Konsultasi sistem keamanan rumah',
      message: 'Halo Admin, rumah saya tipe minimalis, kira-kira paket CCTV atau kunci pintar apa ya yang paling direkomendasikan?',
    },
    {
      question: '🔧 Apakah produk memiliki garansi?',
      message: 'Halo SafeHome Store, saya ingin tahu mengenai detail klaim garansi produk dan apakah melayani jasa pemasangan ke rumah?',
    },
    {
      question: '💳 Metode pembayaran yang tersedia?',
      message: 'Halo Admin, apakah pesanan di SafeHome Store bisa dibayar via transfer bank otomatis, e-wallet, atau COD?',
    },
  ];

  const handleSendFaq = (message: string) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[300px] sm:w-[340px] overflow-hidden"
            role="dialog"
            aria-label="Bantuan Customer Service"
          >
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
                  <FaMessage className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-tight">Customer Service</h3>
                  <p className="text-[10px] text-emerald-100 opacity-90">Online • Siap membantu Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Tutup bantuan"
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pertanyaan Populer</p>
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => handleSendFaq(faq.message)}
                  className="w-full text-left bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-emerald-700 transition-all shadow-sm"
                >
                  {faq.question}
                </button>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-gray-100">
              <button
                onClick={() => handleSendFaq('Halo Admin SafeHome Store, saya butuh bantuan informasi lainnya...')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Buka Obrolan Kosong</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Tutup chat WhatsApp' : 'Buka chat WhatsApp'}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 transition-all relative cursor-pointer group"
      >
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center z-10">
            <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75" />
          </span>
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div
              key="whatsapp"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <FaWhatsapp className="w-6 h-6" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// =====================================================
// HALAMAN UTAMA
// =====================================================
export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(8);

  const [cartCount, setCartCount] = useState<number>(0);
  const [cartLoadingId, setCartLoadingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  const [showSplash, setShowSplash] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [bestSellerProduct, setBestSellerProduct] = useState<Product | null>(null);

  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const cartIconRef = useRef<HTMLAnchorElement>(null);

  const categories = [
    { name: 'Kunci', keyword: 'kunci', icon: <FaKey className="w-5 h-5" aria-hidden="true" /> },
    { name: 'CCTV', keyword: 'cctv', icon: <Cctv className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Aksesoris Motor', keyword: 'motor', icon: <FaMotorcycle className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Aksesoris HP', keyword: 'hp', icon: <Smartphone className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Perangkap', keyword: 'perangkap', icon: <Sparkles className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Brankas', keyword: 'brankas', icon: <FaVault className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Sensor', keyword: 'sensor', icon: <SensorIcon className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Lampu', keyword: 'lampu', icon: <FaLightbulb className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Gembok', keyword: 'gembok', icon: <FaLock className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Alarm', keyword: 'alarm', icon: <FaBell className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Akses Biometrik', keyword: 'fingerprint', icon: <FaFingerprint className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Interkom', keyword: 'intercom', icon: <FaMicrophone className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Detektor Api', keyword: 'fire', icon: <FaFireExtinguisher className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Peralatan', keyword: 'peralatan', icon: <FaHammer className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Sistem Wi-Fi', keyword: 'wifi', icon: <FaWifi className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Panel Surya', keyword: 'solar', icon: <FaSolarPanel className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Smart Hub', keyword: 'hub', icon: <FaHouseSignal className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Suku Cadang', keyword: 'sparepart', icon: <FaWrench className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Penjaga Sinyal', keyword: 'booster', icon: <FaTowerBroadcast className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Kabel Saklar', keyword: 'kabel', icon: <FaPlug className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Atribut Patroli', keyword: 'patroli', icon: <FaUserShield className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Kotak P3K', keyword: 'p3k', icon: <FaKitMedical className="w-5 h-5" aria-hidden="true" /> },
    { name: 'Gesper Safety', keyword: 'safety', icon: <FaShieldHalved className="w-5 h-5" aria-hidden="true" /> },
  ];

  async function initAppData() {
    try {
      const [allProductsRes, bestSellerRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').eq('id', 15).maybeSingle(),
      ]);

      if (allProductsRes.data) setProducts(allProductsRes.data as Product[]);
      if (bestSellerRes.data) setBestSellerProduct(bestSellerRes.data as Product);

      await refreshCartCount();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function refreshCartCount() {
    const sessionId = getOrCreateSessionId();
    try {
      const { data } = await supabase.from('carts').select('quantity').eq('session_id', sessionId);

      if (data) {
        const total = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(total);
      }
    } catch (error) {
      console.error('Gagal mengambil total kuantiti keranjang:', error);
    }
  }

  async function handleAddToCart(productId: number, imageUrl: string | null, event: React.MouseEvent<HTMLButtonElement>) {
    if (cartLoadingId === productId) return;

    setCartLoadingId(productId);
    const sessionId = getOrCreateSessionId();

    if (cartIconRef.current && event.currentTarget) {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const cartRect = cartIconRef.current.getBoundingClientRect();

      const newItem: FlyingItem = {
        id: `${productId}-${Date.now()}`,
        startX: buttonRect.left + buttonRect.width / 2 - 20,
        startY: buttonRect.top + buttonRect.height / 2 - 20,
        endX: cartRect.left + cartRect.width / 2 - 20,
        endY: cartRect.top + cartRect.height / 2 - 20,
        image: imageUrl || '/placeholder.png',
      };

      setFlyingItems((prev) => [...prev, newItem]);
    }

    try {
      const { data: existingItem } = await supabase
        .from('carts')
        .select('*')
        .eq('session_id', sessionId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        await supabase
          .from('carts')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
      } else {
        await supabase.from('carts').insert({
          session_id: sessionId,
          product_id: productId,
          quantity: 1,
        });
      }

      await refreshCartCount();
      setSuccessId(productId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (error) {
      console.error('Gagal memasukkan data ke keranjang:', error);
    } finally {
      setCartLoadingId(null);
    }
  }

  const handleAnimationComplete = (id: string) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    setIsMounted(true);
    initAppData();

    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowAlert(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.nama.toLowerCase().includes(selectedCategory.toLowerCase())
      : true;
    return matchesSearch && matchesCategory;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-gray-800 antialiased font-sans relative select-none">
      {/* LAYER ANIMASI ITEM FLYING TO CART */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ left: item.startX, top: item.startY, scale: 1, opacity: 1 }}
            animate={{ left: item.endX, top: item.endY, scale: 0.2, opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
            onAnimationComplete={() => handleAnimationComplete(item.id)}
            className="fixed w-10 h-10 rounded-xl bg-white border border-orange-200 shadow-md p-1 flex items-center justify-center overflow-hidden"
          >
            <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
          </motion.div>
        ))}
      </div>

      {/* 1. SPLASHSCREEN */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center text-gray-900"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">
                safehome<span className="text-orange-500">store</span>
              </h1>
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mt-2" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ALERT POP-UP BEST SELLER */}
      <AnimatePresence>
        {showAlert && bestSellerProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAlert(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl border border-gray-100 relative z-10 p-5"
              role="dialog"
              aria-label="Promo produk terlaris"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <FaFire className="w-3 h-3" aria-hidden="true" />
                  Produk Terlaris
                </span>
                <button
                  onClick={() => setShowAlert(false)}
                  aria-label="Tutup promo"
                  className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-40 h-40 bg-gray-50 rounded-xl p-3 flex items-center justify-center mb-3 border border-gray-100">
                  <img
                    src={bestSellerProduct.gambar1 || '/placeholder.png'}
                    alt={bestSellerProduct.nama}
                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="text-center w-full">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 px-1">
                    {bestSellerProduct.nama}
                  </h3>

                  <div className="flex items-center justify-center gap-1 mb-2 text-orange-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} className="w-3 h-3" aria-hidden="true" />
                    ))}
                    <span className="text-[11px] text-gray-400 ml-1">(4.9 • Terjual 500+)</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-xs text-gray-400 line-through">
                      Rp {Math.floor(bestSellerProduct.harga / (1 - 0.15)).toLocaleString('id-ID')}
                    </span>
                    <span className="text-sm font-bold text-gray-950">
                      Rp {Number(bestSellerProduct.harga).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  disabled={cartLoadingId === bestSellerProduct.id}
                  onClick={(e) => handleAddToCart(bestSellerProduct.id, bestSellerProduct.gambar1, e)}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  {successId === bestSellerProduct.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                      <span>Berhasil Dimasukkan!</span>
                    </>
                  ) : (
                    <>
                      <FaCartShopping className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{cartLoadingId === bestSellerProduct.id ? 'Memproses...' : 'Tambah ke Keranjang'}</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/product/${bestSellerProduct.id}`}
                  onClick={() => setShowAlert(false)}
                  className="mt-2 text-center text-[11px] text-gray-400 hover:text-gray-600 hover:underline flex items-center gap-0.5 justify-center"
                >
                  <span>Lihat detail info produk</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NAVBAR STICKY DENGAN EFEK BLUR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-1.5 active:scale-95 transition-transform flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">
              safehome<span className="text-orange-500">store</span>
            </span>
          </Link>

          <div className="relative flex-1 max-w-xl w-full">
            <label htmlFor="search-produk" className="sr-only">
              Cari produk keamanan rumah
            </label>
            <input
              id="search-produk"
              type="text"
              placeholder="Cari CCTV, smart lock, alarm..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(8);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white transition-all text-black"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          </div>

          <Link
            ref={cartIconRef}
            href="/cart"
            aria-label={`Keranjang belanja, ${cartCount} item`}
            className="p-2.5 bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-xl relative text-gray-700 hover:text-orange-500 transition-all flex items-center justify-center flex-shrink-0"
          >
            <FaCartShopping className="w-4 h-4" aria-hidden="true" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <HeroSection />

      {/* TRUST HIGHLIGHTS */}
      <TrustHighlights />

      {/* BANNER */}
      <PromoBanner />

      {/* SECTION KATEGORI */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white border-y border-gray-100" aria-labelledby="kategori-heading">
        <div className="flex justify-between items-center mb-4">
          <h2 id="kategori-heading" className="text-sm font-bold text-gray-900 tracking-tight uppercase">
            Kategori Terpopuler
          </h2>
          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setVisibleCount(8);
              }}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold"
            >
              <X className="w-3 h-3" aria-hidden="true" /> Hapus Filter
            </button>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x md:flex-wrap md:justify-start md:overflow-x-visible">
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat.keyword;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCategory(isActive ? null : cat.keyword);
                  setVisibleCount(8);
                }}
                aria-pressed={isActive}
                className="flex flex-col items-center space-y-1.5 min-w-[76px] sm:min-w-[84px] md:w-[90px] cursor-pointer group flex-shrink-0 snap-start transition-transform active:scale-95"
              >
                <div
                  className={`w-12 h-12 border rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'border-orange-500 bg-orange-50 text-orange-500 shadow-sm'
                      : 'bg-gray-50 border-gray-100 text-gray-600 group-hover:text-orange-500 group-hover:bg-orange-50/50 group-hover:border-orange-200'
                  }`}
                >
                  {cat.icon}
                </div>
                <span
                  className={`text-[10.5px] font-medium text-center line-clamp-2 px-0.5 tracking-tight max-w-[76px] leading-tight ${
                    isActive ? 'text-orange-600 font-bold' : 'text-gray-600 group-hover:text-orange-500'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* GRID KATALOG UTAMA */}
      <main id="katalog" className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
            {selectedCategory ? `Kategori: ${categories.find((c) => c.keyword === selectedCategory)?.name}` : 'Semua Produk Keamanan Rumah'}
          </h2>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex justify-between items-center mb-6 text-xs">
          <div className="text-gray-600">
            Menampilkan <span className="font-bold text-gray-900">{displayedProducts.length}</span> dari{' '}
            <span className="font-bold text-gray-900">{filteredProducts.length}</span> item
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-gray-700 border px-2.5 py-1.5 rounded-lg bg-gray-50">
            <ListFilter className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            <span>Terbaru</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-gray-400 text-xs">Memuat produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Store className="w-10 h-10 text-gray-300 mx-auto mb-2" aria-hidden="true" />
            <p className="text-gray-500 text-sm">Produk tidak ditemukan</p>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
            >
              {displayedProducts.map((product) => {
                const hargaSebelumDiskon = Math.floor(product.harga / (1 - 0.15));
                const isCartLoading = cartLoadingId === product.id;
                const isSuccess = successId === product.id;

                return (
                  <motion.div
                    key={product.id}
                    variants={itemVariants as any}
                    className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group relative"
                  >
                    <Link href={`/product/${product.id}`} className="block flex-1">
                      <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden relative p-3 flex items-center justify-center">
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 z-10 shadow-sm">
                          <Percent className="w-2.5 h-2.5" aria-hidden="true" /> 15% OFF
                        </span>

                        {product.stock > 0 && product.stock <= 5 && (
                          <span className="absolute top-2 right-2 bg-gray-900/85 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
                            Sisa {product.stock}
                          </span>
                        )}

                        <img
                          src={product.gambar1 || '/placeholder.png'}
                          alt={product.nama}
                          className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="pt-2">
                        <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 min-h-[32px] leading-snug group-hover:text-orange-500 transition-colors">
                          {product.nama}
                        </h3>

                        <div className="flex items-center gap-0.5 mt-1 text-orange-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} className="w-2.5 h-2.5" aria-hidden="true" />
                          ))}
                          <span className="text-[10px] text-gray-400 ml-1">4.9</span>
                        </div>

                        <div className="mt-1.5 mb-2">
                          <p className="text-sm font-bold text-gray-950">
                            Rp {Number(product.harga).toLocaleString('id-ID')}
                          </p>
                          <p className="text-[10px] text-gray-400 line-through">
                            Rp {hargaSebelumDiskon.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {product.stock > 0 && (
                      <div className="mt-auto pt-1">
                        <button
                          disabled={isCartLoading}
                          onClick={(e) => handleAddToCart(product.id, product.gambar1, e)}
                          aria-label={`Tambah ${product.nama} ke keranjang`}
                          className={`w-full text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
                            isSuccess
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-900 hover:bg-orange-500 text-white shadow-sm'
                          }`}
                        >
                          {isSuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                              <span>Tersimpan</span>
                            </>
                          ) : (
                            <>
                              <FaCartShopping className="w-3 h-3" aria-hidden="true" />
                              <span>{isCartLoading ? 'Memuat...' : 'Tambah ke Keranjang'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {product.stock === 0 && (
                      <div className="mt-auto pt-1">
                        <span className="w-full text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center bg-gray-100 text-gray-400">
                          Stok Habis
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* BUTTON SELENGKAPNYA */}
            {filteredProducts.length > visibleCount && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="bg-white border border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700 text-xs font-bold px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <span>Lihat Selengkapnya</span>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* --- SECTION COPYWRITING KEAMANAN DATA --- */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-800 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 text-gray-800/20 pointer-events-none">
            <ShieldCheck className="w-64 h-64" aria-hidden="true" />
          </div>

          <div className="max-w-2xl relative z-10">
            <span className="text-[10px] font-black tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md uppercase">
              100% Privacy &amp; Security Guaranteed
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-3 mb-4 leading-tight">
              Belanja Perangkat Keamanan Rumah Jadi Lebih Tenang di SafeHome Store
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
              Lebih dari sekadar toko, kami adalah partner andalan Anda dalam membangun ekosistem rumah
              yang cerdas dan terproteksi. Kami memahami bahwa produk keamanan melibatkan privasi
              tingkat tinggi, itulah mengapa integrasi sistem kami dirancang tanpa celah.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-800 pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-100">Enkripsi End-to-End</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Semua data transaksi dan kredensial akun Anda dienkripsi ketat tanpa log pihak ketiga.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                  <UserCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-100">Produk Resmi &amp; Teruji</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Kami hanya mendistribusikan perangkat original dengan jaminan pembaruan firmware berkala.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                  <ServerCrash className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-100">Proteksi Server Cloud</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Sinkronisasi data dilakukan secara privat melalui cloud aman berbasis industri global.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA WHATSAPP BANNER */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <div className="bg-emerald-500 rounded-2xl px-6 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-sm">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <FaGift className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base">Butuh rekomendasi paket keamanan rumah?</p>
              <p className="text-xs text-emerald-50 opacity-90">Tim kami siap bantu pilih produk yang paling sesuai kebutuhan Anda.</p>
            </div>
          </div>
          <a
            href="https://wa.me/6285881941073"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-emerald-600 font-bold text-sm px-5 py-2.5 rounded-full shadow-sm hover:bg-emerald-50 transition-all active:scale-95 flex-shrink-0"
          >
            <FaWhatsapp className="w-4 h-4" aria-hidden="true" />
            Chat via WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-lg font-extrabold tracking-tight text-gray-900">
                  safehome<span className="text-orange-500">store</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Toko CCTV, smart lock, dan perlengkapan keamanan rumah modern terpercaya untuk
                rumah dan kantor di seluruh Indonesia.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Kategori</h3>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link href="/?kategori=cctv" className="hover:text-orange-500 transition-colors">CCTV Wireless &amp; Online</Link></li>
                <li><Link href="/?kategori=kunci" className="hover:text-orange-500 transition-colors">Smart Lock &amp; Kunci Digital</Link></li>
                <li><Link href="/?kategori=alarm" className="hover:text-orange-500 transition-colors">Alarm Rumah Pintar</Link></li>
                <li><Link href="/?kategori=brankas" className="hover:text-orange-500 transition-colors">Brankas &amp; Keamanan Kantor</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Bantuan</h3>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link href="/cart" className="hover:text-orange-500 transition-colors">Keranjang Belanja</Link></li>
                <li>
                  <a href="https://wa.me/6285881941073" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                    Cek Status Pesanan
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/6285881941073" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">
                    Klaim Garansi
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Kontak</h3>
              <a
                href="https://wa.me/6285881941073"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" aria-hidden="true" />
                +62 858-8194-1073
              </a>
              <div className="flex items-center gap-1.5 mt-4 text-orange-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="w-3.5 h-3.5" aria-hidden="true" />
                ))}
                <span className="text-[11px] text-gray-500 ml-1">4.9 dari 12.000+ pelanggan</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 text-center text-[11px] text-gray-400">
            <p>© 2026 SafeHome Store — Toko CCTV, Smart Lock &amp; Perlengkapan Keamanan Rumah Terpercaya.</p>
          </div>
        </div>
      </footer>

      {/* COMPONENT CS WHATSAPP MELAYANG */}
      <WhatsAppCS />
    </div>
  );
}