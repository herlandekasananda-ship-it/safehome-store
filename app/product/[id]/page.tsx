// app/product/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('/placeholder.png');

  useEffect(() => {
    async function fetchProductDetail() {
      if (!id) return;
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Gagal memuat detail produk:', error.message);
      } else if (data) {
        setProduct(data as Product);
        setActiveImage(data.gambar1 || '/placeholder.png');
      }
      setLoading(false);
    }

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Produk Tidak Ditemukan</h2>
        <p className="text-gray-500 mt-2 mb-6">Produk mungkin telah dihapus atau link tidak valid.</p>
        <Link href="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
          Kembali ke Toko
        </Link>
      </div>
    );
  }

  const handleBeliLangsung = () => {
    if (product.stock < 1) {
      alert('Maaf, stok produk ini sedang habis.');
      return;
    }
    
    // Menyimpan data item ke sessionStorage untuk ditarik di halaman checkout
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

  // Kumpulan gambar galeri yang terisi (tidak null/kosong)
  const gallery = [product.gambar1, product.gambar2, product.gambar3].filter(Boolean) as string[];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600 tracking-tight">
            🏡 SafeHome Store
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-orange-600">
            ← Kembali Belanja
          </Link>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* SISI KIRI: Media (Gambar & Video) */}
          <div className="space-y-4">
            {/* Tampilan Gambar Utama Aktif */}
            <div className="border border-gray-200 rounded-xl overflow-hidden aspect-square bg-gray-100 relative">
              <img 
                src={activeImage} 
                alt={product.nama} 
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail Galeri Kecil */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-20 h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 ${
                      activeImage === imgUrl ? 'border-orange-500' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Pemutar Video (Jika Ada) */}
            {product.video && (
              <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden bg-black">
                <p className="text-white text-xs p-2 bg-gray-900 font-medium">🎥 Video Review / Panduan Produk:</p>
                <video controls className="w-full aspect-video">
                  <source src={product.video} type="video/mp4" />
                  Browser Anda tidak mendukung pemutar video.
                </video>
              </div>
            )}
          </div>

          {/* SISI KANAN: Informasi & Manajemen Keranjang */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                {product.nama}
              </h1>
              
              <div className="flex items-center gap-4 my-4">
                <span className="text-3xl font-extrabold text-orange-600">
                  Rp {product.harga.toLocaleString('id-ID')}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `Stok: ${product.stock} Pcs` : 'Stok Habis'}
                </span>
              </div>

              <hr className="my-6 border-gray-200" />

              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Deskripsi Produk</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.deskripsi || 'Tidak ada deskripsi tertulis untuk produk ini.'}
              </p>
            </div>

            {/* Section Aksi Pembelian */}
            <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Atur Jumlah Beli:</span>
                
                {/* Counter Quantity */}
                <div className="flex items-center border border-gray-300 bg-white rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => setQty(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold transition text-black"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={qty}
                    min={1}
                    max={product.stock || 1}
                    onChange={(e) => setQty(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-12 text-center text-sm font-semibold focus:outline-none text-black"
                  />
                  <button 
                    type="button"
                    onClick={() => setQty(prev => Math.min(product.stock, prev + 1))}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold transition text-black"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Harga Sementara */}
              <div className="flex justify-between items-center border-t pt-3 text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-bold text-base text-gray-900">
                  Rp {(product.harga * qty).toLocaleString('id-ID')}
                </span>
              </div>

              {/* Tombol checkout utama */}
              <button
                onClick={handleBeliLangsung}
                disabled={product.stock < 1}
                className={`w-full text-center font-bold py-3 px-4 rounded-lg text-white shadow transition duration-150 ${
                  product.stock > 0 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Beli Sekarang & Isi Form' : 'Stok Barang Habis'}
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}