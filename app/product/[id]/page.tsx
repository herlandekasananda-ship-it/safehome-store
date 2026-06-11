'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, ArrowLeft, ShoppingBag, ShieldCheck, Heart, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  nama: string;
  harga: number;
  stock: number;
  deskripsi: string | null;
  gambar1: string | null;
  gambar2: string | null;
  gambar3: string | null;
  video: string | null;
}

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  
  const [activeMedia, setActiveMedia] = useState<MediaItem>({ type: 'image', url: '/placeholder.png' });
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  
  // State untuk feedback share / copy link
  const [shareToast, setShareToast] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductData() {
      if (!id) return;
      setLoading(true);
      
      const { data: mainProduct, error: mainError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (mainError) {
        console.error('Gagal memuat detail produk:', mainError.message);
      } else if (mainProduct) {
        setProduct(mainProduct as Product);

        const list: MediaItem[] = [];
        if (mainProduct.gambar1) list.push({ type: 'image', url: mainProduct.gambar1 });
        if (mainProduct.gambar2) list.push({ type: 'image', url: mainProduct.gambar2 });
        if (mainProduct.gambar3) list.push({ type: 'image', url: mainProduct.gambar3 });
        if (mainProduct.video) list.push({ type: 'video', url: mainProduct.video });
        
        setMediaList(list);
        
        if (list.length > 0) {
          setActiveMedia(list[0]);
        } else {
          setActiveMedia({ type: 'image', url: '/placeholder.png' });
        }

        const { data: others, error: othersError } = await supabase
          .from('products')
          .select('*')
          .neq('id', id)
          .limit(4);

        if (!othersError && others) {
          setOtherProducts(others as Product[]);
        }
      }
      setLoading(false);
    }

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4]">
        <div className="w-9 h-9 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm font-medium">Memuat halaman produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f4] p-4 text-center">
        <h2 className="text-xl font-bold text-gray-800">Produk Tidak Ditemukan</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">Produk mungkin telah dihapus atau tautan tidak valid.</p>
        <Link href="/" className="bg-orange-500 text-white px-5 py-2 rounded text-sm font-semibold hover:bg-orange-600 transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const handleBeliLangsung = () => {
    if (product.stock < 1) {
      alert('Maaf, stok produk ini sedang habis.');
      return;
    }
    
    const checkoutItem = {
      product_id: product.id,
      nama: product.nama,
      harga: product.harga,
      qty: qty,
      gambar: product.gambar1
    };
    
    sessionStorage.setItem('checkout_item', JSON.stringify(checkoutItem));
    router.push('/checkout');
  };

  // FUNGSI UTAMA: Fitur Bagikan Produk Aktif
  const handleShareProduct = async () => {
    const shareData = {
      title: product.nama,
      text: `Yuk cek ${product.nama} di SafeHome Store! Keamanan rumah terbaik untuk Anda.`,
      url: window.location.href,
    };

    // Deteksi jika browser mendukung Web Share API asli (biasanya browser mobile & Safari)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('User membatalkan atau terjadi error saat share:', error);
      }
    } else {
      // Fallback: Salin URL tautan secara otomatis ke clipboard jika Web Share API tidak didukung
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareToast('Tautan produk berhasil disalin ke clipboard!');
        setTimeout(() => setShareToast(null), 2500);
      } catch (err) {
        console.error('Gagal menyalin tautan:', err);
      }
    }
  };

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-[#333333] antialiased font-sans pb-24 md:pb-16 relative">
      
      {/* GLOBAL TOAST ALERTS */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-28 md:bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 z-[99] whitespace-nowrap border border-gray-800"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            <span>{shareToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-bold tracking-tight text-gray-900">
              SAFEHOME<span className="text-orange-500">STORE</span>
            </Link>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500">
              <Link href="/" className="hover:text-orange-500">Home</Link>
              <span>&gt;</span>
              <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.nama}</span>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-orange-500 transition-colors border px-2.5 py-1.5 rounded bg-gray-50">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali Belanja
          </Link>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* KOLOM KIRI: MEDIA BOX */}
          <div className="lg:col-span-4 bg-white border border-gray-200 p-4 rounded shadow-sm space-y-4">
            <div className="relative aspect-square w-full bg-white flex items-center justify-center border border-gray-100 rounded overflow-hidden">
              {activeMedia.type === 'image' ? (
                <img 
                  src={activeMedia.url} 
                  alt={product.nama} 
                  className="w-full h-full object-contain transition-all duration-200"
                />
              ) : (
                <video key={activeMedia.url} controls autoPlay className="w-full h-full bg-black aspect-square object-contain">
                  <source src={activeMedia.url} type="video/mp4" />
                </video>
              )}
            </div>

            {mediaList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {mediaList.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedia(media)}
                    onMouseEnter={() => setActiveMedia(media)}
                    className={`w-14 h-14 border p-0.5 rounded bg-white flex-shrink-0 flex items-center justify-center transition-all ${
                      activeMedia.url === media.url 
                        ? 'border-orange-500 ring-1 ring-orange-500/20' 
                        : 'border-gray-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img src={media.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#1e272e] flex flex-col items-center justify-center text-[10px] text-white font-bold leading-none rounded-sm">
                        <span>🎥</span>
                        <span className="text-[8px] text-orange-400 mt-0.5 uppercase">Vid</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-100 text-xs text-gray-500">
              <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" /> Wishlist
              </button>
              <button 
                onClick={handleShareProduct} 
                className="flex items-center gap-1 text-gray-600 hover:text-orange-500 active:scale-95 transition-all font-medium"
              >
                <Share2 className="w-4 h-4" /> Bagikan
              </button>
            </div>
          </div>

          {/* KOLOM TENGAH: INFO DETAIL PRODUK */}
          <div className="lg:col-span-5 bg-white border border-gray-200 p-5 rounded shadow-sm space-y-5">
            <div>
              <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                Product ID: #{product.id}
              </span>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight mt-2 mb-1.5 leading-snug">
                {product.nama}
              </h1>
              
              <div className="flex items-center gap-1.5 text-xs py-1">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1 text-[#2ecc71] font-bold bg-[#2ecc71]/10 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3.5 h-3.5" /> Ready Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#e74c3c] font-bold bg-[#e74c3c]/10 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3.5 h-3.5" /> Stok Habis
                  </span>
                )}
                <span className="text-gray-400">| Sisa fisik: {product.stock} unit</span>
              </div>
            </div>

            <div className="bg-[#fafafa] p-3 rounded border border-gray-100">
              <span className="text-xs text-gray-400 block">Harga Pas</span>
              <span className="text-2xl font-black text-orange-600 tracking-tight">
                Rp {product.harga.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-1 border-gray-200">
                Deskripsi Produk
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {product.deskripsi || 'Tidak ada spesifikasi tertulis tambahan untuk produk ini.'}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-3 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-orange-500 flex-shrink-0" /> Garansi Produk Ori</div>
              <div className="flex items-center gap-1.5">📦 Packing Aman Amanah</div>
            </div>
          </div>

          {/* KOLOM KANAN: PANEL DI DESKTOP */}
          <div className="hidden lg:block lg:col-span-3 lg:sticky lg:top-20 bg-white border-2 border-gray-200 p-4 rounded shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b pb-1.5">
              Atur Jumlah & Jasa
            </h3>

            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-medium">Jumlah Pesanan</span>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden h-8 bg-white">
                <button 
                  type="button"
                  onClick={() => setQty(prev => Math.max(1, prev - 1))}
                  className="px-2.5 bg-gray-50 hover:bg-gray-100 font-bold transition h-full text-gray-700"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={qty}
                  min={1}
                  max={product.stock || 1}
                  onChange={(e) => setQty(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-10 text-center text-xs font-bold focus:outline-none h-full text-black bg-white"
                />
                <button 
                  type="button"
                  onClick={() => setQty(prev => Math.min(product.stock, prev + 1))}
                  className="px-2.5 bg-gray-50 hover:bg-gray-100 font-bold transition h-full text-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between items-end">
              <span className="text-xs text-gray-500">Subtotal</span>
              <span className="font-extrabold text-sm text-gray-900">
                Rp {(product.harga * qty).toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleBeliLangsung}
              disabled={product.stock < 1}
              className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded text-xs text-white shadow-sm tracking-wide uppercase transition-all duration-150 ${
                product.stock > 0 
                  ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/10' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
            </button>
          </div>

        </div>

        {/* REKOMENDASI PRODUK */}
        {otherProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 border-l-4 border-orange-500 pl-2">
              Rekomendasi Produk Serupa
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {otherProducts.map((p) => (
                <Link 
                  href={`/product/${p.id}`} 
                  key={p.id}
                  className="bg-white rounded border border-gray-200 p-3 shadow-sm hover:border-gray-400 transition-colors flex flex-col group cursor-pointer"
                >
                  <div className="aspect-square bg-white overflow-hidden mb-2.5 flex items-center justify-center border border-gray-50">
                    <img 
                      src={p.gambar1 || '/placeholder.png'} 
                      alt={p.nama} 
                      className="max-h-full max-w-full object-contain group-hover:scale-102 transition-transform duration-200" 
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <h3 className="font-medium text-xs text-gray-700 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors min-h-[32px]">
                      {p.nama}
                    </h3>
                    <div className="mt-2 pt-2 border-t border-gray-50">
                      <p className="font-extrabold text-xs text-gray-900">
                        Rp {p.harga.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] text-[#2ecc71] font-semibold mt-0.5">
                        {p.stock > 0 ? 'Ready Stock' : 'Stok Habis'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FLOATING ACTION BAR: KHUSUS LAYAR HP */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center justify-between gap-4 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 leading-none">Total Harga</span>
          <span className="text-base font-black text-orange-500 mt-1">
            Rp {(product.harga * qty).toLocaleString('id-ID')}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden h-9 bg-white">
            <button 
              onClick={() => setQty(prev => Math.max(1, prev - 1))}
              className="px-2 bg-gray-100 font-bold h-full text-gray-600"
            >
              -
            </button>
            <span className="w-7 text-center text-xs font-bold text-black">{qty}</span>
            <button 
              onClick={() => setQty(prev => Math.min(product.stock, prev + 1))}
              className="px-2 bg-gray-100 font-bold h-full text-gray-600"
            >
              +
            </button>
          </div>

          <button
            onClick={handleBeliLangsung}
            disabled={product.stock < 1}
            className={`h-9 px-5 rounded font-bold text-xs text-white uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-transform ${
              product.stock > 0 ? 'bg-orange-500' : 'bg-gray-400'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Beli
          </button>
        </div>
      </div>

    </div>
  );
}