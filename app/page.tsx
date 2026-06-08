'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Clock, Package, ChevronLeft, ChevronRight, Store } from 'lucide-react';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 110 } }
};

// --- KOMPONEN BANNER SLIDER OTOMATIS (BARU) ---
function PromoBanner() {
  const banners = ['/baner1.png', '/baner2.png', '/baner3.png', '/baner4.png'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 untuk kanan, -1 untuk kiri

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000); // Banner otomatis berganti setiap 4 detik

    return () => clearInterval(timer);
  }, [banners.length]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
    })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mt-8">
      <div className="relative h-[160px] sm:h-[280px] md:h-[360px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100 group">
        
        {/* Gambar Bergerak */}
        <div className="relative w-full h-full overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={currentIndex}
              src={banners[currentIndex]}
              custom={direction}
              variants={slideVariants as any}
              initial="enter"
              animate="center"
              exit="exit"
              alt={`Promo Banner ${currentIndex + 1}`}
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          </AnimatePresence>
        </div>

        {/* Tombol Navigasi Manual */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:bg-orange-500 hover:text-white transition opacity-0 group-hover:opacity-100 z-10 hidden sm:block"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:bg-orange-500 hover:text-white transition opacity-0 group-hover:opacity-100 z-10 hidden sm:block"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indikator Titik Ganti */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-orange-500' : 'w-2 bg-white/60 shadow-sm'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- KOMPONEN INTERNAL CAROUSEL GAMBAR PRODUK ---
function ProductCarousel({ product }: { product: Product }) {
  const images = [product.gambar1, product.gambar2, product.gambar3].filter(Boolean) as string[];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <img src="/placeholder.png" alt={product.nama} className="w-full h-full object-cover" />
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative aspect-square w-full bg-gray-50 overflow-hidden group/carousel select-none">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${product.nama} - ${currentIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full object-cover transition-transform duration-500 md:group-hover/carousel:scale-105"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-gray-700 hover:bg-orange-500 hover:text-white transition md:opacity-0 md:group-hover/carousel:opacity-100 z-10 touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-gray-700 hover:bg-orange-500 hover:text-white transition md:opacity-0 md:group-hover/carousel:opacity-100 z-10 touch-manipulation"
          >
            <ChevronRight className="w-4 h-4 md:w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-4 bg-orange-500' : 'w-1.5 bg-white/70 shadow-sm'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- HALAMAN UTAMA ---
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Gagal mengambil produk:', error.message);
      } else if (data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    }

    getProducts();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen text-gray-900 selection:bg-orange-500 selection:text-white antialiased">
      
      {/* 1. NAVBAR RESPONSIF */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3.5 flex justify-center sm:justify-start items-center">
          <Link href="/" className="flex items-center gap-2 active:scale-95 transition-transform">
            <img 
              src="/logo.jpg" 
              alt="SafeHome Store Logo" 
              className="h-8 md:h-9 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textFallback = document.getElementById('brand-text');
                if (textFallback) textFallback.classList.remove('hidden');
              }}
            />
            <span id="brand-text" className="text-lg md:text-xl font-bold text-orange-600 tracking-tight hidden">
              🏡 SafeHome Store
            </span>
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION RESPONSIF */}
      <header className="bg-white border-b py-12 md:py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px] opacity-5"></div>
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-black text-gray-900 sm:text-5xl md:text-6xl tracking-tight leading-tight">
            Selamat Datang di <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">SafeHome</span>
          </h1>
          <p className="mt-3 md:mt-5 text-sm md:text-lg text-gray-500 max-w-xl mx-auto font-medium px-2">
            Temukan produk terbaik untuk keamanan dan kenyamanan rumah Anda dengan harga bersahabat.
          </p>
        </motion.div>
      </header>

      {/* 3. GRID FITUR KEUNGGULAN */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 -mt-6 md:-mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-orange-50 p-2.5 md:p-3 rounded-lg text-orange-600 flex-shrink-0"><ShieldCheck className="w-5 h-5 md:w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-xs md:text-sm text-gray-800">Produk 100% Original</h3>
              <p className="text-[11px] md:text-xs text-gray-400 mt-0.5">Jaminan kualitas perlindungan rumah.</p>
            </div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-orange-50 p-2.5 md:p-3 rounded-lg text-orange-600 flex-shrink-0"><Truck className="w-5 h-5 md:w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-xs md:text-sm text-gray-800">Bisa Bayar di Tempat (COD)</h3>
              <p className="text-[11px] md:text-xs text-gray-400 mt-0.5">Belanja aman barang sampai baru bayar.</p>
            </div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 sm:col-span-2 md:col-span-1">
            <div className="bg-orange-50 p-2.5 md:p-3 rounded-lg text-orange-600 flex-shrink-0"><Clock className="w-5 h-5 md:w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-xs md:text-sm text-gray-800">Respon Cepat Admin</h3>
              <p className="text-[11px] md:text-xs text-gray-400 mt-0.5">Konfirmasi via WA kilat setelah checkout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. CAROUSEL BANNER PROMO (BARU) --- */}
      <PromoBanner />

      {/* 5. DAFTAR KOLEKSI PRODUK UTAMA */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="flex items-center gap-2 mb-6 md:mb-8">
          <Package className="w-5 h-5 md:w-6 h-6 text-orange-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Semua Koleksi Produk</h2>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <div className="w-9 h-9 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm md:text-base font-medium">Memuat produk terbaik untuk Anda...</p>
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 px-4"
          >
            <Store className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold text-base">Belum ada produk yang dijual.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
          >
            {products.map((product) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants as any}
                className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm md:hover:shadow-md md:hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between group"
              >
                <ProductCarousel product={product} />

                <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
                      {product.nama}
                    </h3>
                    <p className="text-sm md:text-base font-extrabold text-orange-600 mb-1.5">
                      Rp {Number(product.harga).toLocaleString('id-ID')}
                    </p>
                    <p className="text-[11px] md:text-xs text-gray-400 line-clamp-2 mb-3 hidden sm:block">
                      {product.deskripsi || 'Tidak ada deskripsi produk.'}
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center text-[10px] md:text-xs border-t pt-2 md:pt-3 border-gray-50">
                      <span className="text-gray-400">Stok</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] md:text-xs ${
                        product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {product.stock} pcs
                      </span>
                    </div>
                    <Link 
                      href={`/product/${product.id}`}
                      className="block w-full text-center bg-gray-900 hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-lg text-xs md:text-sm transition-all duration-200 shadow-sm touch-manipulation"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* 6. FOOTER */}
      <footer className="bg-white border-t mt-12 md:mt-24 py-6 md:py-8 text-center text-xs text-gray-400">
        <p>© 2026 SafeHome Store. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}