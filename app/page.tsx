'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Truck, Clock, Package, ChevronLeft, ChevronRight, Store, Search, ListFilter, X } from 'lucide-react';

interface Product {
  id: number;
  nama: string;
  harga: number;
  stock: number;
  deskripsi: string | null;
  gambar1: string | null;
  gambar2: string | null;
  gambar3: string | null;
  // Catatan: Pastikan di tabel Supabase kamu ada kolom kategori/tags (opsional jika ingin mencocokkan kata kunci nama)
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
};

// --- BANNER SLIDER OTOMATIS ---
function PromoBanner() {
  const banners = ['/baner1.png', '/baner2.png', '/baner3.png', '/baner4.png'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { x: { type: 'spring', stiffness: 300, damping: 32 }, opacity: { duration: 0.2 } } },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0, transition: { x: { type: 'spring', stiffness: 300, damping: 32 }, opacity: { duration: 0.2 } } })
  };

  return (
    <section className="w-full bg-white border-b border-gray-100 pb-6">
      <div className="max-w-7xl mx-auto px-4 relative group">
        <div className="relative h-[140px] sm:h-[260px] md:h-[340px] w-full rounded-xl overflow-hidden bg-gray-50">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={currentIndex}
              src={banners[currentIndex]}
              custom={direction}
              variants={slideVariants as any}
              initial="enter"
              animate="center"
              exit="exit"
              alt="Promo Banner"
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          </AnimatePresence>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-5 bg-orange-500' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- HALAMAN UTAMA ---
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. STATE UNTUK KATEGORI YANG DIPILIH
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: 'Kunci', keyword: 'kunci', icon: '🔐' },
    { name: 'CCTV', keyword: 'cctv', icon: '🎥' },
    { name: 'Brankas', keyword: 'brankas', icon: '🗄️' },
    { name: 'Sensor', keyword: 'sensor', icon: '🚨' },
    { name: 'Lampu', keyword: 'lampu', icon: '💡' },
    { name: 'Gembok', keyword: 'gembok', icon: '🔒' },
  ];

  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    }
    getProducts();
  }, []);

  // 2. PROSES FILTER PRODUK (BERDASARKAN KEYWORD PENCARIAN & KATEGORI AKTIF)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nama.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Menyaring berdasarkan kata kunci nama produk (misal produk bernama "Kunci Pintu Digital" masuk kategori "Kunci")
    const matchesCategory = selectedCategory 
      ? product.nama.toLowerCase().includes(selectedCategory.toLowerCase()) 
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-gray-800 antialiased font-sans">
      
      {/* NAVBAR CLEAN */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-1 active:scale-95 transition-transform flex-shrink-0">
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              safehome<span className="text-orange-500">store</span>
            </span>
          </Link>

          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Cari produk keamanan rumah di sini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-black"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </nav>

      {/* HERO SLIDER BANNER */}
      <PromoBanner />

      {/* KATEGORI IKON BULAT DINAMIS */}
      <section className="max-w-7xl mx-auto px-4 py-8 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-800 tracking-tight">Kategori Terpopuler</h2>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
            >
              <X className="w-3 h-3" /> Hapus Filter Kategori
            </button>
          )}
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none justify-start md:justify-start">
          {categories.map((cat, idx) => {
            const isActive = selectedCategory === cat.keyword;
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedCategory(isActive ? null : cat.keyword)}
                className="flex flex-col items-center space-y-2 min-w-[85px] cursor-pointer group flex-shrink-0"
              >
                <div className={`w-14 h-14 border rounded-full flex items-center justify-center text-2xl transition-all duration-200 ${
                  isActive 
                    ? 'border-orange-500 bg-orange-50 scale-105 shadow-sm' 
                    : 'bg-gray-50 border-gray-100 group-hover:border-orange-400 group-hover:bg-orange-50/30'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-xs font-medium text-center transition-colors line-clamp-1 ${
                  isActive ? 'text-orange-600 font-bold' : 'text-gray-600 group-hover:text-orange-500'
                }`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* LAYOUT UTAMA */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Menampilkan <span className="font-bold text-gray-900">{filteredProducts.length}</span> produk 
            {selectedCategory && <span> untuk kategori <span className="text-orange-600 font-semibold">"{selectedCategory}"</span></span>}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer hover:text-orange-500 border px-3 py-1.5 rounded-lg bg-gray-50">
            <ListFilter className="w-3.5 h-3.5" />
            <span>Urutkan: Terbaru</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-400 text-xs">Memuat katalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm font-medium">Produk tidak ditemukan</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          >
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants as any}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-150 flex flex-col justify-between group cursor-pointer"
              >
                <Link href={`/product/${product.id}`} className="block flex-1">
                  <div className="aspect-square w-full bg-gray-50 border-b border-gray-100 overflow-hidden relative">
                    <img 
                      src={product.gambar1 || '/placeholder.png'} 
                      alt={product.nama} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                    />
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded">Habis</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-medium text-gray-700 line-clamp-2 min-h-[32px] tracking-tight group-hover:text-orange-500 transition-colors leading-tight">
                        {product.nama}
                      </h3>
                      <p className="text-sm font-extrabold text-gray-900 mt-1.5">
                        Rp {Number(product.harga).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400">
                      <span>Sisa stok: <span className="font-semibold text-gray-600">{product.stock}</span></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* LIVE BAR FITUR */}
      <section className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-gray-600" />
            <h4 className="text-xs font-bold text-gray-800">Garansi Orisinal</h4>
            <p className="text-[11px] text-gray-400">Semua produk keamanan bersertifikasi resmi.</p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Truck className="w-5 h-5 text-gray-600" />
            <h4 className="text-xs font-bold text-gray-800">Layanan Antar Aman</h4>
            <p className="text-[11px] text-gray-400">Bisa COD, amanah sampai di depan rumah.</p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Clock className="w-5 h-5 text-gray-600" />
            <h4 className="text-xs font-bold text-gray-800">Bantuan 24/7</h4>
            <p className="text-[11px] text-gray-400">Hubungi WhatsApp admin kapan saja siap respon.</p>
          </div>
        </div>
      </section>

      <footer className="bg-[#f8f9fa] py-6 text-center text-[11px] text-gray-400 border-t border-gray-200">
        <p>© 2026 SafeHome Store. Terinspirasi Layout E-Commerce Premium.</p>
      </footer>
    </div>
  );
}