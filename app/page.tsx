// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, ArrowRight, Package } from 'lucide-react';

interface Product {
  id: number;
  nama: string;
  harga: number;
  stock: number;
  deskripsi: string | null;
  gambar1: string | null;
}

// Konfigurasi Variasi Animasi Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 } // Kartu muncul bergantian satu per satu
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

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
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen text-gray-900 selection:bg-orange-500 selection:text-white">
      
      {/* Navbar dengan Efek Glassmorphism */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition active:scale-95">
            <img 
              src="/logo.jpg" 
              alt="SafeHome Store Logo" 
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const textFallback = document.getElementById('brand-text');
                if (textFallback) textFallback.classList.remove('hidden');
              }}
            />
            <span id="brand-text" className="text-xl font-bold text-orange-600 tracking-tight hidden">
              🏡 SafeHome Store
            </span>
          </Link>
          <Link href="/admin" className="text-sm font-semibold text-gray-600 hover:text-orange-600 transition flex items-center gap-1 group">
            Dashboard Admin 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </nav>

      {/* Hero Section Beranimasi */}
      <header className="bg-white border-b py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px] opacity-5"></div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl tracking-tight">
            Selamat Datang di <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">SafeHome</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-500 max-w-xl mx-auto font-medium">
            Temukan produk terbaik untuk keamanan dan kenyamanan rumah Anda dengan harga bersahabat.
          </p>
        </motion.div>
      </header>

      {/* Fitur Keunggulan Toko (Value Proposition) */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg text-orange-600"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-sm">Produk 100% Original</h3>
              <p className="text-xs text-gray-400">Jaminan kualitas perlindungan rumah.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg text-orange-600"><Truck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-sm">Bisa Bayar di Tempat (COD)</h3>
              <p className="text-xs text-gray-400">Belanja aman barang sampai baru bayar.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg text-orange-600"><Clock className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-sm">Respon Cepat Admin</h3>
              <p className="text-xs text-gray-400">Konfirmasi via WA kilat setelah checkout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Konten Utama (Daftar Produk) */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-2 mb-8">
          <Package className="w-6 'h-6' text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Semua Koleksi Produk</h2>
        </div>

        {loading ? (
          <div className="text-center py-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-lg font-medium">Memuat produk terbaik untuk Anda...</p>
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300"
          >
            <p className="text-gray-500 text-lg font-medium">Belum ada produk yang dijual.</p>
            <p className="text-sm text-gray-400 mt-1">Silakan tambah produk melalui Dashboard Admin.</p>
          </motion.div>
        ) : (
          /* Grid Kartu Produk Beranimasi */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                {/* Area Gambar dengan Efek Zoom */}
                <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                  <img 
                    src={product.gambar1 || '/placeholder.png'} 
                    alt={product.nama}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info Produk */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
                      {product.nama}
                    </h3>
                    <p className="text-base font-bold text-orange-600 mb-2">
                      Rp {product.harga.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4">
                      {product.deskripsi || 'Tidak ada deskripsi produk.'}
                    </p>
                  </div>

                  {/* Bagian Tombol dan Status Stok */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Stok Tersedia</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${
                        product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {product.stock} pcs
                      </span>
                    </div>
                    <Link 
                      href={`/product/${product.id}`}
                      className="block w-full text-center bg-gray-900 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
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

      {/* Footer */}
      <footer className="bg-white border-t mt-20 py-8 text-center text-sm text-gray-400">
        <p>© 2026 SafeHome Store. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}