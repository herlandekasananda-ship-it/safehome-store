'use client';

import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
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

// ─── Types ──────────────────────────────────────────────────────────────────
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

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardItem: Variants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 160, damping: 24 } },
};

// ─── Social media links ──────────────────────────────────────────────────────
const SOCIALS = [
  { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://wa.me/6285881941073', color: 'text-emerald-500' },
  { icon: FaFacebook, label: 'Facebook', href: 'https://facebook.com', color: 'text-blue-500' },
  { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com', color: 'text-pink-500' },
  { icon: FaTiktok, label: 'TikTok', href: 'https://tiktok.com', color: 'text-gray-900' },
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

// ─── Scroll-reveal wrapper ───────────────────────────────────────────────────
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
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

// ─── PROMO BANNER ────────────────────────────────────────────────────────────
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
    <section className="w-full">
    <div className="relative overflow-hidden">
        <div
  className="relative w-full h-[160px] sm:h-[280px] md:h-[360px] overflow-hidden group"
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
              className="w-full h-full object-cover absolute inset-0 select-none"
              loading="lazy"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

          <button onClick={prev} aria-label="Sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:scale-105 active:scale-95">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} aria-label="Selanjutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:scale-105 active:scale-95">
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Banner ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function HeroSection() {
  const banners = ['/baner1.png', '/baner2.png', '/baner3.png', '/baner4.png', '/baner5.png', '/baner6.png'];
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-gradient-to-b from-white to-[#f8f9fa] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 pt-8 sm:pt-12 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* --- Mobile: image first, then text --- */}
          {/* Image */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            className="order-1 md:order-2 relative"
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) {
                if (diff > 0) setCurrent((p) => (p + 1) % banners.length);
                else setCurrent((p) => (p - 1 + banners.length) % banners.length);
              }
              touchStartX.current = null;
            }}
          >
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative shadow-lg bg-gray-900 border border-gray-800">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={banners[current]}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  alt="Sistem CCTV dan smart lock keamanan rumah SafeHome Store"
                  className="w-full h-full object-cover absolute inset-0 opacity-90 select-none"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Dot nav */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {banners.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
                ))}
              </div>

          
            </div>

            {/* Discount badge */}
            <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 bg-orange-500 text-white rounded-2xl px-3 py-2 shadow-lg shadow-orange-500/30 rotate-3 z-10">
              <p className="text-[9px] font-semibold uppercase tracking-wide opacity-90">Diskon s.d.</p>
              <p className="text-xl font-black leading-tight">15%</p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            className="order-2 md:order-1"
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <FaShieldHalved className="w-3 h-3" />
              Toko CCTV &amp; Smart Lock Terpercaya
            </span>

            <h1 className="text-[26px] sm:text-3xl md:text-[38px] font-extrabold tracking-tight text-gray-900 leading-[1.18] mb-3">
              Lindungi Rumah &amp; Kantor Anda dengan{' '}
              <span className="text-orange-500">Sistem Keamanan Pintar</span>
            </h1>

            <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed mb-6 max-w-md">
              Belanja CCTV wireless, smart lock, alarm rumah pintar, dan perlengkapan keamanan modern — original bergaransi, harga bersahabat, pengiriman cepat ke seluruh Indonesia.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a href="#katalog"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-sm shadow-orange-500/25 transition-all">
                <FaCartShopping className="w-3.5 h-3.5" />
                Belanja Sekarang
              </a>
              <a href="https://wa.me/6285881941073" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 text-sm font-bold px-5 py-3 rounded-xl border border-gray-200 hover:border-emerald-400 transition-all">
                <FaWhatsapp className="w-4 h-4 text-emerald-500" />
                Konsultasi Gratis
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="w-3.5 h-3.5" />)}
                </div>
                <span className="text-xs font-bold text-gray-900">4.9/5</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <p className="text-xs text-gray-500">
                Dipercaya <span className="font-bold text-gray-900">12.000+</span> pelanggan
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── TRUST HIGHLIGHTS ────────────────────────────────────────────────────────
function TrustHighlights() {
  const items = [
    { icon: <FaShieldHalved className="w-4 h-4" />, title: 'Produk Original', desc: 'Bergaransi resmi & teruji' },
    { icon: <FaTruck className="w-4 h-4" />, title: 'Pengiriman Cepat', desc: 'Ke seluruh Indonesia' },
    { icon: <Lock className="w-4 h-4" />, title: 'Pembayaran Aman', desc: 'Transfer, e-wallet, COD' },
    { icon: <FaHeadset className="w-4 h-4" />, title: 'Support 24 Jam', desc: 'Konsultasi via WhatsApp' },
    { icon: <FaCircleCheck className="w-4 h-4" />, title: 'Harga Terbaik', desc: 'Garansi harga termurah' },
  ];

  return (
    <section className="bg-white border-y border-gray-100" aria-label="Keunggulan SafeHome Store">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex gap-3 overflow-x-auto scrollbar-none sm:grid sm:grid-cols-3 md:grid-cols-5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors min-w-[170px] sm:min-w-0 flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                <p className="text-[11px] text-gray-500 truncate">{item.desc}</p>
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
    { icon: <FaShieldHalved className="w-5 h-5" />, title: 'Produk 100% Original', desc: 'Semua item bersumber langsung dari distributor resmi dengan sertifikat autentisitas.' },
    { icon: <FaCircleCheck className="w-5 h-5" />, title: 'Garansi 1 Tahun', desc: 'Garansi resmi pabrik berlaku penuh — klaim mudah langsung via WhatsApp.' },
    { icon: <Tag className="w-5 h-5" />, title: 'Harga Terjangkau', desc: 'Harga bersaing tanpa mengorbankan kualitas — transparan tanpa biaya tersembunyi.' },
    { icon: <FaTruck className="w-5 h-5" />, title: 'Pengiriman Kilat', desc: 'Proses dalam 1×24 jam, dikirim lewat ekspedisi terpercaya dengan resi lacak.' },
    { icon: <FaHeadset className="w-5 h-5" />, title: 'CS Responsif', desc: 'Tim kami siap membantu kapan saja — konsultasi produk, instalasi, dan klaim garansi.' },
    { icon: <Lock className="w-5 h-5" />, title: 'Transaksi Aman', desc: 'Pembayaran terenkripsi end-to-end. Data Anda aman, kami tidak menjual informasi pribadi.' },
  ];

  return (
    <section id="tentang" className="max-w-7xl mx-auto px-4 py-10">
      <RevealSection>
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">Mengapa Kami?</span>
          <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-3">
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
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-orange-200 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                {r.icon}
              </div>
              <h3 className="text-[13px] font-bold text-gray-900 mb-1 leading-tight">{r.title}</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </RevealSection>
    </section>
  );
}

// ─── BEST SELLER SECTION ─────────────────────────────────────────────────────
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
      <section className="max-w-7xl mx-auto px-4 pb-2 pt-2">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl overflow-hidden shadow-lg shadow-orange-500/20">
          <div className="px-5 pt-5 pb-2 flex items-center gap-2">
            <FaFire className="w-4 h-4 text-orange-200" />
            <span className="text-[11px] font-black text-orange-100 uppercase tracking-widest">Produk Terlaris</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 px-5 pb-6">
            {/* Image */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 bg-white/10 rounded-2xl flex items-center justify-center p-4 flex-shrink-0 border border-white/20">
              <img
                src={product.gambar1 || '/placeholder.png'}
                alt={product.nama}
                className="max-w-full max-h-full object-contain mix-blend-multiply"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1 mb-2 text-orange-200">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="w-3 h-3" />)}
                <span className="text-[11px] text-orange-100 ml-1">4.9 • Terjual 500+</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug mb-2 line-clamp-2">{product.nama}</h3>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                <span className="text-sm font-black text-white">Rp {Number(product.harga).toLocaleString('id-ID')}</span>
                <span className="text-xs text-orange-200 line-through">Rp {hargaAsli.toLocaleString('id-ID')}</span>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">-15%</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <button
                  disabled={cartLoadingId === product.id}
                  onClick={(e) => onAddToCart(product.id, product.gambar1, e)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm ${
                    successId === product.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {successId === product.id ? (
                    <><Check className="w-3.5 h-3.5 stroke-[3]" /><span>Masuk Keranjang!</span></>
                  ) : (
                    <><FaCartShopping className="w-3.5 h-3.5" /><span>{cartLoadingId === product.id ? 'Memproses...' : 'Tambah ke Keranjang'}</span></>
                  )}
                </button>
                <Link href={`/product/${product.id}`}
                  className="inline-flex items-center gap-1 text-xs text-orange-100 hover:text-white font-semibold transition-colors">
                  Detail produk <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
});

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FaqSection() {
  const faqs = [
    { q: 'Apakah produk CCTV dan smart lock di sini original?', a: 'Ya, seluruh produk di SafeHome Store adalah barang original dengan garansi resmi dan jaminan pembaruan firmware berkala.' },
    { q: 'Berapa lama estimasi pengiriman?', a: 'Pesanan diproses dalam 1×24 jam dan dikirim ke seluruh Indonesia menggunakan ekspedisi terpercaya dengan nomor resi yang bisa dilacak.' },
    { q: 'Apakah ada layanan pemasangan untuk CCTV?', a: 'Kami melayani konsultasi pemasangan via WhatsApp, termasuk rekomendasi jasa instalasi sesuai lokasi Anda.' },
    { q: 'Metode pembayaran apa yang tersedia?', a: 'Tersedia transfer bank, e-wallet, dan COD (Cash on Delivery) untuk area tertentu — semua transaksi terenkripsi dan aman.' },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-7xl mx-auto px-4 py-10">
      <RevealSection>
        <div className="text-center mb-8">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">Belum menemukan jawaban? Hubungi kami langsung via WhatsApp.</p>
        </div>

        <div className="max-w-2xl mx-auto flex flex-col gap-2.5">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`bg-white border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-orange-300' : 'border-gray-200 hover:border-orange-200'}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <span className="text-sm font-semibold text-gray-800">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
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
      </RevealSection>
    </section>
  );
}

// ─── WHATSAPP FLOATING CS ────────────────────────────────────────────────────
function WhatsAppCS() {
  const [isOpen, setIsOpen] = useState(false);
  const phone = '6285881941073';

  const faqs = [
    { question: '📦 Cek status pengiriman', message: 'Halo SafeHome Store, saya mau cek status pengiriman pesanan saya dengan nomor resi/invoice: ' },
    { question: '🛡️ Konsultasi sistem keamanan', message: 'Halo Admin, saya butuh rekomendasi paket CCTV atau smart lock untuk rumah saya.' },
    { question: '🔧 Info garansi & klaim', message: 'Halo SafeHome Store, saya ingin tahu detail klaim garansi produk dan layanan pemasangan.' },
    { question: '💳 Metode pembayaran', message: 'Halo Admin, apakah tersedia pembayaran via transfer bank, e-wallet, atau COD?' },
  ];

  return (
    <div className="fixed bottom-6 right-5 z-[999] flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[296px] sm:w-[330px] overflow-hidden"
            role="dialog"
            aria-label="Bantuan Customer Service"
          >
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
                  <FaMessage className="w-3.5 h-3.5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold">Customer Service</h3>
                  <p className="text-[10px] text-emerald-100">Online • Siap membantu</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Tutup" className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gray-50 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pertanyaan Populer</p>
              {faqs.map((faq, i) => (
                <button key={i} onClick={() => { window.open(`https://wa.me/${phone}?text=${encodeURIComponent(faq.message)}`, '_blank'); setIsOpen(false); }}
                  className="w-full text-left bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-emerald-700 transition-all shadow-sm">
                  {faq.question}
                </button>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-gray-100">
              <button onClick={() => { window.open(`https://wa.me/${phone}?text=${encodeURIComponent('Halo Admin SafeHome Store, saya butuh bantuan...')}`, '_blank'); setIsOpen(false); }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                Buka Obrolan <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Tutup chat' : 'Buka chat WhatsApp'}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all relative"
      >
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white z-10">
            <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75" />
          </span>
        )}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5 stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div key="wa" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
              <FaWhatsapp className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
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

  return (
    <motion.div
      variants={cardItem}
      className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group relative"
    >
      <Link href={`/product/${product.id}`} className="block flex-1">
        <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden relative p-3 flex items-center justify-center">
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 z-10 shadow-sm">
            <Percent className="w-2.5 h-2.5" /> 15%
          </span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="absolute top-2 right-2 bg-gray-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
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
            {[...Array(5)].map((_, i) => <FaStar key={i} className="w-2.5 h-2.5" />)}
            <span className="text-[10px] text-gray-400 ml-1">4.9</span>
          </div>
          <div className="mt-1.5 mb-1">
            <p className="text-sm font-bold text-gray-950">Rp {Number(product.harga).toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-gray-400 line-through">Rp {hargaAsli.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </Link>

      <div className="mt-auto pt-1">
        {product.stock > 0 ? (
          <button
            disabled={isLoading}
            onClick={(e) => onAddToCart(product.id, product.gambar1, e)}
            aria-label={`Tambah ${product.nama} ke keranjang`}
            className={`w-full text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
              isSuccess ? 'bg-emerald-600 text-white' : 'bg-gray-900 hover:bg-orange-500 text-white'
            }`}
          >
            {isSuccess ? (
              <><Check className="w-3.5 h-3.5 stroke-[3]" /><span>Tersimpan</span></>
            ) : (
              <><FaCartShopping className="w-3 h-3" /><span>{isLoading ? 'Memuat...' : 'Tambah ke Keranjang'}</span></>
            )}
          </button>
        ) : (
          <span className="w-full text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center bg-gray-100 text-gray-400">
            Stok Habis
          </span>
        )}
      </div>
    </motion.div>
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

  // Scroll detection for nav
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const refreshCartCount = useCallback(async () => {
    const sessionId = getOrCreateSessionId();
    try {
      const { data } = await supabase.from('carts').select('quantity').eq('session_id', sessionId);
      if (data) setCartCount(data.reduce((sum, item) => sum + (item.quantity || 0), 0));
    } catch (e) { console.error(e); }
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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const handleAddToCart = useCallback(async (
    productId: number,
    imageUrl: string | null,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
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
      const { data: existing } = await supabase.from('carts').select('*').eq('session_id', sessionId).eq('product_id', productId).maybeSingle();
      if (existing) {
        await supabase.from('carts').update({ quantity: existing.quantity + 1 }).eq('id', existing.id);
      } else {
        await supabase.from('carts').insert({ session_id: sessionId, product_id: productId, quantity: 1 });
      }
      await refreshCartCount();
      setSuccessId(productId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (e) { console.error(e); }
    finally { setCartLoadingId(null); }
  }, [cartLoadingId, refreshCartCount]);

  const handleAnimationComplete = useCallback((id: string) => {
    setFlyingItems((p) => p.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    setIsMounted(true);
    initAppData();
    const t = setTimeout(() => { setShowSplash(false); setShowAlert(true); }, 1500);
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
    <div className="bg-[#f8f9fa] min-h-screen text-gray-800 antialiased font-sans relative select-none">

      {/* Flying items to cart */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
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
            <img src={item.image} alt="" className="max-w-full max-h-full object-contain" />
          </motion.div>
        ))}
      </div>

      {/* SPLASHSCREEN */}
      <AnimatePresence>
        {showSplash && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-white z-[999] flex flex-col items-center justify-center">
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                safehome<span className="text-orange-500">store</span>
              </h1>
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mt-2" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BEST SELLER POP-UP */}
      <AnimatePresence>
        {showAlert && bestSellerProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAlert(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <motion.div initial={{ scale: 0.93, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl border border-gray-100 relative z-10 p-5"
              role="dialog" aria-label="Promo produk terlaris"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <FaFire className="w-3 h-3" /> Produk Terlaris
                </span>
                <button onClick={() => setShowAlert(false)} aria-label="Tutup" className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-40 h-40 bg-gray-50 rounded-xl p-3 flex items-center justify-center mb-3 border border-gray-100">
                  <img src={bestSellerProduct.gambar1 || '/placeholder.png'} alt={bestSellerProduct.nama} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 text-center px-1">{bestSellerProduct.nama}</h3>
                <div className="flex items-center gap-1 mb-2 text-orange-400">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="w-3 h-3" />)}
                  <span className="text-[11px] text-gray-400 ml-1">(4.9 • 500+ terjual)</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-400 line-through">Rp {Math.floor(bestSellerProduct.harga / (1 - 0.15)).toLocaleString('id-ID')}</span>
                  <span className="text-sm font-bold text-gray-950">Rp {Number(bestSellerProduct.harga).toLocaleString('id-ID')}</span>
                </div>

                <button
                  disabled={cartLoadingId === bestSellerProduct.id}
                  onClick={(e) => handleAddToCart(bestSellerProduct.id, bestSellerProduct.gambar1, e)}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  {successId === bestSellerProduct.id ? (
                    <><Check className="w-3.5 h-3.5 stroke-[3]" /><span>Berhasil Dimasukkan!</span></>
                  ) : (
                    <><FaCartShopping className="w-3.5 h-3.5" /><span>{cartLoadingId === bestSellerProduct.id ? 'Memproses...' : 'Tambah ke Keranjang'}</span></>
                  )}
                </button>

                <Link href={`/product/${bestSellerProduct.id}`} onClick={() => setShowAlert(false)}
                  className="mt-2 text-[11px] text-gray-400 hover:text-gray-600 hover:underline flex items-center gap-0.5">
                  Lihat detail produk <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── NAVBAR ── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${navScrolled ? 'bg-white/85 backdrop-blur-md border-b border-gray-200 shadow-sm' : 'bg-white border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 active:scale-95 transition-transform flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              safehome<span className="text-orange-500">store</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-sm font-medium text-gray-600 hover:text-orange-500 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs md:max-w-sm w-full">
            <label htmlFor="search-produk" className="sr-only">Cari produk keamanan rumah</label>
            <input
              id="search-produk"
              type="text"
              placeholder="Cari CCTV, smart lock, alarm..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(8); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white transition-all text-black"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Social + Cart (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Cart */}
          <Link ref={cartIconRef} href="/cart" aria-label={`Keranjang, ${cartCount} item`}
            className="p-2.5 bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-xl relative text-gray-700 hover:text-orange-500 transition-all flex items-center justify-center flex-shrink-0">
            <FaCartShopping className="w-4 h-4" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span key={cartCount} initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Hamburger */}
          <button onClick={() => setMobileMenuOpen(true)} aria-label="Buka menu"
            className="md:hidden p-2 rounded-xl border border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-500 transition-colors flex-shrink-0">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed right-0 top-0 h-full w-72 bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <span className="font-extrabold text-gray-900 text-base">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a key={l.label} href={l.href} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <l.icon className="w-4 h-4 text-gray-400" />
                    {l.label}
                  </a>
                ))}
              </nav>

              {/* Social in drawer */}
              <div className="px-5 py-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Ikuti Kami</p>
                <div className="flex gap-3">
                  {SOCIALS.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className={`w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 ${s.color} hover:scale-105 transition-transform`}>
                      <s.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HERO */}
      <HeroSection />

      {/* TRUST */}
      <TrustHighlights />

      {/* PROMO BANNER */}
      <div className="pt-6">
        <PromoBanner />
      </div>

      {/* BEST SELLER */}
      {bestSellerProduct && (
        <BestSellerSection
          product={bestSellerProduct}
          cartLoadingId={cartLoadingId}
          successId={successId}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white border-y border-gray-100 mt-4" aria-labelledby="kategori-heading">
        <div className="flex justify-between items-center mb-4">
          <h2 id="kategori-heading" className="text-sm font-bold text-gray-900 tracking-tight uppercase">
            Kategori Terpopuler
          </h2>
          {selectedCategory && (
            <button onClick={() => { setSelectedCategory(null); setVisibleCount(8); }}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold">
              <X className="w-3 h-3" /> Hapus Filter
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x md:flex-wrap md:overflow-x-visible md:pb-0">
          {categories.map((cat, i) => {
            const active = selectedCategory === cat.keyword;
            return (
              <button key={i}
                onClick={() => { setSelectedCategory(active ? null : cat.keyword); setVisibleCount(8); }}
                aria-pressed={active}
                className="flex flex-col items-center gap-1.5 min-w-[72px] sm:min-w-[84px] cursor-pointer group flex-shrink-0 snap-start active:scale-95 transition-transform"
              >
                <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center transition-all ${
                  active ? 'border-orange-500 bg-orange-50 text-orange-500 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-600 group-hover:text-orange-500 group-hover:bg-orange-50/50 group-hover:border-orange-200'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-[10px] font-medium text-center line-clamp-2 px-0.5 tracking-tight max-w-[72px] leading-tight ${
                  active ? 'text-orange-600 font-bold' : 'text-gray-600 group-hover:text-orange-500'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <main id="katalog" className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
            {selectedCategory ? `Kategori: ${categories.find((c) => c.keyword === selectedCategory)?.name}` : 'Semua Produk Keamanan Rumah'}
          </h2>
        </div>

        <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center mb-5 text-xs">
          <p className="text-gray-600">
            Menampilkan <span className="font-bold text-gray-900">{displayedProducts.length}</span> dari{' '}
            <span className="font-bold text-gray-900">{filteredProducts.length}</span> produk
          </p>
          <div className="flex items-center gap-1.5 font-semibold text-gray-700 border px-2.5 py-1.5 rounded-lg bg-gray-50">
            <ListFilter className="w-3.5 h-3.5 text-gray-400" />
            Terbaru
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-xs">Memuat produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Store className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Produk tidak ditemukan</p>
          </div>
        ) : (
          <>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
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
              <div className="flex justify-center mt-8">
                <button onClick={() => setVisibleCount((p) => p + 8)}
                  className="bg-white border border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700 text-xs font-bold px-6 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all active:scale-95">
                  Lihat Selengkapnya <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* WHY CHOOSE US */}
      <WhyChooseUs />

      {/* SECURITY DATA SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <RevealSection>
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-800 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 text-gray-800/15 pointer-events-none">
              <ShieldCheck className="w-64 h-64" />
            </div>
            <div className="max-w-2xl relative z-10">
              <span className="text-[10px] font-black tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md uppercase">
                100% Privacy &amp; Security Guaranteed
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-3 mb-4 leading-tight">
                Belanja Perangkat Keamanan Rumah Jadi Lebih Tenang di SafeHome Store
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                Lebih dari sekadar toko, kami adalah partner andalan Anda dalam membangun ekosistem rumah yang cerdas dan terproteksi. Integrasi sistem kami dirancang tanpa celah untuk privasi tingkat tinggi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-800 pt-6">
                {[
                  { icon: <Lock className="w-4 h-4" />, title: 'Enkripsi End-to-End', desc: 'Data transaksi dan kredensial akun Anda dienkripsi ketat tanpa log pihak ketiga.' },
                  { icon: <UserCheck className="w-4 h-4" />, title: 'Produk Resmi & Teruji', desc: 'Kami hanya mendistribusikan perangkat original dengan jaminan pembaruan firmware berkala.' },
                  { icon: <ServerCrash className="w-4 h-4" />, title: 'Proteksi Server Cloud', desc: 'Sinkronisasi data dilakukan secara privat melalui cloud aman berbasis industri global.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-100">{item.title}</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA WhatsApp Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-10">
        <RevealSection>
          <div className="bg-emerald-500 rounded-2xl px-6 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-sm">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <FaGift className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">Butuh rekomendasi paket keamanan rumah?</p>
                <p className="text-xs text-emerald-50 opacity-90">Tim kami siap bantu pilih produk yang paling sesuai kebutuhan Anda.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <a href="https://wa.me/6285881941073" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-600 font-bold text-sm px-5 py-2.5 rounded-full shadow-sm hover:bg-emerald-50 transition-all active:scale-95">
                <FaWhatsapp className="w-4 h-4" /> Chat WhatsApp
              </a>
              <a href="#katalog"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all active:scale-95">
                Lihat Produk <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold tracking-tight text-gray-900">
                  safehome<span className="text-orange-500">store</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Toko CCTV, smart lock, dan perlengkapan keamanan rumah modern terpercaya untuk rumah dan kantor di seluruh Indonesia.
              </p>
              {/* Social in footer */}
              <div className="flex gap-2.5 flex-wrap">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 ${s.color} hover:scale-105 transition-transform`}>
                    <s.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
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
                <li><a href="https://wa.me/6285881941073" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">Cek Status Pesanan</a></li>
                <li><a href="https://wa.me/6285881941073" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">Klaim Garansi</a></li>
                <li><a href="#faq" className="hover:text-orange-500 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Kontak</h3>
              <a href="https://wa.me/6285881941073" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                <FaWhatsapp className="w-4 h-4" /> +62 858-8194-1073
              </a>
              <div className="flex items-center gap-1.5 mt-4 text-orange-400">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="w-3.5 h-3.5" />)}
                <span className="text-[11px] text-gray-500 ml-1">4.9 dari 12.000+ pelanggan</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 text-center text-[11px] text-gray-400">
            <p>© 2026 SafeHome Store — Toko CCTV, Smart Lock &amp; Perlengkapan Keamanan Rumah Terpercaya Indonesia.</p>
          </div>
        </div>
      </footer>

      <WhatsAppCS />
    </div>
  );
}