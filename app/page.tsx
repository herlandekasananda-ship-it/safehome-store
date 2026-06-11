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
  Smartphone, // Untuk Aksesoris HP
  Sparkles     // Untuk Perangkap / Alternatif lain
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
  FaMotorcycle // Untuk Aksesoris Motor
} from 'react-icons/fa6';
import { MdOutlineSensors } from 'react-icons/md';

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

// --- HALAMAN UTAMA ---
export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartLoadingId, setCartLoadingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  const [showSplash, setShowSplash] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [bestSellerProduct, setBestSellerProduct] = useState<Product | null>(null);

  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const cartIconRef = useRef<HTMLAnchorElement>(null);

  // DAFTAR KATEGORI (Ditambah Aksesoris Motor, Aksesoris HP, dan Perangkap)
  const categories = [
    { name: 'Kunci', keyword: 'kunci', icon: <FaKey className="w-5 h-5" /> },
    { name: 'CCTV', keyword: 'cctv', icon: <Cctv className="w-5 h-5" /> },
    { name: 'Aksesoris Motor', keyword: 'motor', icon: <FaMotorcycle className="w-5 h-5" /> },
    { name: 'Aksesoris HP', keyword: 'hp', icon: <Smartphone className="w-5 h-5" /> },
    { name: 'Perangkap', keyword: 'perangkap', icon: <Sparkles className="w-5 h-5" /> },
    { name: 'Brankas', keyword: 'brankas', icon: <FaVault className="w-5 h-5" /> },
    { name: 'Sensor', keyword: 'sensor', icon: <MdOutlineSensors className="w-5 h-5" /> },
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
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* SECTION KATEGORI (Optimasi Desktop Grid & Mobile Scrollable) */}
      <section className="max-w-7xl mx-auto px-4 py-6 bg-white border-y border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase">Kategori Terpopuler</h2>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold"
            >
              <X className="w-3 h-3" /> Hapus Filter
            </button>
          )}
        </div>
        
        {/* Container Responsif */}
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-none snap-x md:flex-wrap md:justify-start md:overflow-x-visible">
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat.keyword;
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedCategory(isActive ? null : cat.keyword)}
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
            Menampilkan <span className="font-bold text-gray-900">{filteredProducts.length}</span> item
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
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filteredProducts.map((product) => {
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
        )}
      </main>

      {/* FOOTER INFO */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-[11px] text-gray-400 mt-12">
        <p>© 2026 SafeHome Store. Clean & Optimized Interface.</p>
      </footer>
    </div>
  );
}