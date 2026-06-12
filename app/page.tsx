'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// AMBIL IKON UTAMA DARI LUCIDE
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
  ServerCrash
} from 'lucide-react';

// AMBIL SEMUA IKON KATEGORI & KART DARI REACT ICONS
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
  FaMessage
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
  visible: { opacity: 1, transition: { staggerChildren: 0.02 } }
};

const itemVariants = {
  hidden: { y: 8, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 25 } }
};

// --- BANNER SLIDER ---
function PromoBanner() {
  const banners = ['/baner1.png', '/baner2.png', '/baner3.png', '/baner4.png'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="w-full bg-[#f8f9fa] pb-6 pt-2">
      <div className="max-w-7xl mx-auto px-4 relative group">
        <div className="relative h-[160px] sm:h-[300px] md:h-[360px] w-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-xs">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={banners[currentIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              alt="Promo Banner"
              className="w-full h-full object-cover absolute top-0 left-0 select-none"
            />
          </AnimatePresence>

          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs z-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs z-20"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

// --- KOMPONEN BUTTON CS WHATSAPP & FAQ ---
function WhatsAppCS() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '6285881941073'; // Format internasional langsung tanpa tanda +

  const faqs = [
    {
      question: '📦 Bagaimana cara cek resi/pengiriman?',
      message: 'Halo SafeHome Store, saya mau tanya mengenai status pengiriman pesanan saya dengan nomor resi/invoice berikut: '
    },
    {
      question: '🛡️ Konsultasi sistem keamanan rumah',
      message: 'Halo Admin, rumah saya tipe minimalis, kira-kira paket CCTV atau kunci pintar apa ya yang paling direkomendasikan?'
    },
    {
      question: '🔧 Apakah produk memiliki garansi?',
      message: 'Halo SafeHome Store, saya ingin tahu mengenai detail klaim garansi produk dan apakah melayani jasa pemasangan ke rumah?'
    },
    {
      question: '💳 Metode pembayaran yang tersedia?',
      message: 'Halo Admin, apakah pesanan di SafeHome Store bisa dibayar via transfer bank otomatis, e-wallet, atau COD?'
    }
  ];

  const handleSendFaq = (message: string) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3 font-sans">
      {/* BOX MENU FAQ JIKA POPUP AKTIF */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-[300px] sm:w-[340px] overflow-hidden"
          >
            {/* Header Mini */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
                  <FaMessage className="w-3.5 h-3.5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-tight">Customer Service</h3>
                  <p className="text-[10px] text-emerald-100 opacity-90">Online • Siap membantu Anda</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Pertanyaan Sering Diajukan */}
            <div className="p-4 bg-gray-50 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pertanyaan Populer</p>
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => handleSendFaq(faq.message)}
                  className="w-full text-left bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:text-emerald-700 transition-all shadow-2xs"
                >
                  {faq.question}
                </button>
              ))}
            </div>

            {/* Chat Kosong / Bebas */}
            <div className="p-3 bg-white border-t border-gray-100">
              <button
                onClick={() => handleSendFaq('Halo Admin SafeHome Store, saya butuh bantuan informasi lainnya...')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Buka Obrolan Kosong</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOMBOL UTAMA MELAYANG (FLOATING ACTION BUTTON) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 transition-all relative cursor-pointer group"
      >
        {/* Notifikasi Badge Merah Berkedip */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center z-10">
            <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75" />
          </span>
        )}

        {/* Pergantian Ikon Menggunakan Framer Motion */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5 stroke-[2.5]" />
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
              {/* Ikon SVG Asli WhatsApp */}
              <svg 
                viewBox="0 0 24 24" 
                className="w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// --- HALAMAN UTAMA ---
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

  async function initAppData() {
    try {
      const [allProductsRes, bestSellerRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').eq('id', 15).maybeSingle()
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
      const { data } = await supabase
        .from('carts')
        .select('quantity')
        .eq('session_id', sessionId);
        
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
        image: imageUrl || '/placeholder.png'
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
        await supabase
          .from('carts')
          .insert({
            session_id: sessionId,
            product_id: productId,
            quantity: 1
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
            <img src={item.image} alt="flying product" className="max-w-full max-h-full object-contain" />
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
              <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">
                safehome<span className="text-orange-500">store</span>
              </h1>
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mt-2" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ALERT POP-UP */}
      <AnimatePresence>
        {showAlert && bestSellerProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAlert(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl border border-gray-100 relative z-10 p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  🔥 Produk Terlaris
                </span>
                <button 
                  onClick={() => setShowAlert(false)}
                  className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
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
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 px-1">
                    {bestSellerProduct.nama}
                  </h3>
                  
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
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  {successId === bestSellerProduct.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Berhasil Dimasukkan!</span>
                    </>
                  ) : (
                    <>
                      <FaCartShopping className="w-3.5 h-3.5" />
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
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1 active:scale-95 transition-transform flex-shrink-0">
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              safehome<span className="text-orange-500">store</span>
            </span>
          </Link>

          <div className="relative flex-1 max-w-xl w-full">
            <input
              type="text"
              placeholder="Cari produk keamanan rumah..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(8);
              }}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-black"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <Link 
            ref={cartIconRef}
            href="/cart" 
            className="p-2.5 bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-xl relative text-gray-700 hover:text-orange-500 transition-all flex items-center justify-center"
          >
            <FaCartShopping className="w-4 h-4" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </nav>

      {/* BANNER */}
      <PromoBanner />

      {/* SECTION KATEGORI */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white border-y border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase">Kategori Terpopuler</h2>
          {selectedCategory && (
            <button 
              onClick={() => {
                setSelectedCategory(null);
                setVisibleCount(8);
              }}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold"
            >
              <X className="w-3 h-3" /> Hapus Filter
            </button>
          )}
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x md:flex-wrap md:justify-start md:overflow-x-visible">
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat.keyword;
            return (
              <div 
                key={idx} 
                onClick={() => {
                  setSelectedCategory(isActive ? null : cat.keyword);
                  setVisibleCount(8);
                }}
                className="flex flex-col items-center space-y-1.5 min-w-[76px] sm:min-w-[84px] md:w-[90px] cursor-pointer group flex-shrink-0 snap-contained transition-transform active:scale-95"
              >
                <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'border-orange-500 bg-orange-50 text-orange-500 shadow-xs' 
                    : 'bg-gray-50 border-gray-100 text-gray-600 group-hover:text-orange-500 group-hover:bg-orange-50/50 group-hover:border-orange-200'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-[10.5px] font-medium text-center line-clamp-2 px-0.5 tracking-tight max-w-[76px] leading-tight ${isActive ? 'text-orange-600 font-bold' : 'text-gray-600 group-hover:text-orange-500'}`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* GRID KATALOG UTAMA */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex justify-between items-center mb-6 text-xs">
          <div className="text-gray-600">
            Menampilkan <span className="font-bold text-gray-900">{displayedProducts.length}</span> dari <span className="font-bold text-gray-900">{filteredProducts.length}</span> item
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-gray-700 border px-2.5 py-1.5 rounded-lg bg-gray-50">
            <ListFilter className="w-3.5 h-3.5 text-gray-400" />
            <span>Terbaru</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
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
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {displayedProducts.map((product) => {
                const hargaSebelumDiskon = Math.floor(product.harga / (1 - 0.15));
                const isCartLoading = cartLoadingId === product.id;
                const isSuccess = successId === product.id;

                return (
                  <motion.div 
                    key={product.id} 
                    variants={itemVariants as any}
                    className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between group relative"
                  >
                    <Link href={`/product/${product.id}`} className="block flex-1">
                      <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden relative p-3 flex items-center justify-center">
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 z-10">
                          <Percent className="w-2.5 h-2.5" /> 15% OFF
                        </span>

                        <img 
                          src={product.gambar1 || '/placeholder.png'} 
                          alt={product.nama} 
                          className="max-w-full max-h-full object-contain mix-blend-multiply" 
                        />
                      </div>

                      <div className="pt-2">
                        <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 min-h-[32px] leading-snug group-hover:text-orange-500 transition-colors">
                          {product.nama}
                        </h3>
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
                          className={`w-full text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 ${
                            isSuccess 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-gray-900 hover:bg-orange-500 text-white'
                          }`}
                        >
                          {isSuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Tersimpan</span>
                            </>
                          ) : (
                            <>
                              <FaCartShopping className="w-3 h-3" />
                              <span>{isCartLoading ? 'Memuat...' : 'Keranjang'}</span>
                            </>
                          )}
                        </button>
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
                  className="bg-white border border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700 text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <span>Lihat Selengkapnya</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* --- SECTION COPYWRITING KEAMANAN DATA --- */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-800 relative overflow-hidden">
          {/* Aksen Background */}
          <div className="absolute -right-10 -bottom-10 text-gray-800/20 pointer-events-none">
            <ShieldCheck className="w-64 h-64" />
          </div>

          <div className="max-w-2xl relative z-10">
            <span className="text-[10px] font-black tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md uppercase">
              100% Privacy & Security Guaranteed
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-3 mb-4 leading-tight">
              Belanja Perangkat Keamanan Rumah Jadi Lebih Tenang di SafeHome Store
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
              Lebih dari sekadar toko, kami adalah partner andalan Anda dalam membangun ekosistem rumah yang cerdas dan terproteksi. Kami memahami bahwa produk keamanan melibatkan privasi tingkat tinggi, itulah mengapa integrasi sistem kami dirancang tanpa celah.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-800 pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-100">Enkripsi End-to-End</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Semua data transaksi dan kredensial akun Anda dienkripsi ketat tanpa log pihak ketiga.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-100">Produk Resmi & Teruji</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Kami hanya mendistribusikan perangkat original dengan jaminan pembaruan firmware berkala.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                  <ServerCrash className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-100">Proteksi Server Cloud</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Sinkronisasi data dilakukan secara privat melalui cloud aman berbasis industri global.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER INFO */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-[11px] text-gray-400 mt-6">
        <p>© 2026 SafeHome Store. Clean & Optimized Interface.</p>
      </footer>

      {/* COMPONENT CS WHATSAPP MELAYANG */}
      <WhatsAppCS />
    </div>
  );
}