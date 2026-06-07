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
  
  // State untuk melacak media apa yang sedang aktif di kotak besar
  const [activeMedia, setActiveMedia] = useState<MediaItem>({ type: 'image', url: '/placeholder.png' });
  // State kumpulan semua media (gambar + video) yang valid
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

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

        // Kumpulkan semua media yang tidak null/kosong
        const list: MediaItem[] = [];
        if (mainProduct.gambar1) list.push({ type: 'image', url: mainProduct.gambar1 });
        if (mainProduct.gambar2) list.push({ type: 'image', url: mainProduct.gambar2 });
        if (mainProduct.gambar3) list.push({ type: 'image', url: mainProduct.gambar3 });
        if (mainProduct.video) list.push({ type: 'video', url: mainProduct.video });
        
        setMediaList(list);
        
        // Set tampilan default pertama ke gambar1
        if (list.length > 0) {
          setActiveMedia(list[0]);
        } else {
          setActiveMedia({ type: 'image', url: '/placeholder.png' });
        }

        // Ambil produk rekomendasi lainnya
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

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
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

      {/* Konten Utama Detail Produk */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* SISI KIRI: TAMPILAN ALA TOKOPEDIA (Besar di atas, List Kecil di bawah) */}
          <div className="space-y-4">
            
            {/* 1. Kotak Media Utama (Besar) */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden aspect-square bg-gray-100 relative shadow-sm">
              {activeMedia.type === 'image' ? (
                // Jika yang aktif adalah gambar
                <img 
                  src={activeMedia.url} 
                  alt={product.nama} 
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                // Jika yang aktif adalah video, langsung jadikan player utama di atas
                <video key={activeMedia.url} controls autoPlay className="w-full h-full bg-black aspect-square object-contain">
                  <source src={activeMedia.url} type="video/mp4" />
                  Browser Anda tidak mendukung pemutar video.
                </video>
              )}
            </div>

            {/* 2. Jajaran Thumbnail Kecil (Di bawah kotak besar) */}
            {mediaList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {mediaList.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMedia(media)}
                    onMouseEnter={() => setActiveMedia(media)} // Bisa berubah juga saat kursor nempel (Hover)
                    className={`w-20 h-20 border-2 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 relative transition-all ${
                      activeMedia.url === media.url 
                        ? 'border-orange-500 ring-2 ring-orange-100' 
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img src={media.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      // Tampilan thumbnail khusus video (diberi warna gelap & icon play)
                      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center text-white p-1">
                        <span className="text-xl">🎥</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mt-0.5">Video</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SISI KANAN: Informasi, Deskripsi & Tombol Pembelian */}
          <div className="flex flex-col justify-between h-auto space-y-6">
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
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100">
                {product.deskripsi || 'Tidak ada deskripsi tertulis untuk produk ini.'}
              </p>
            </div>

            {/* Kotak Transaksi / Kuantitas */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Atur Jumlah Beli:</span>
                
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

              <div className="flex justify-between items-center border-t pt-3 text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-bold text-base text-gray-900">
                  Rp {(product.harga * qty).toLocaleString('id-ID')}
                </span>
              </div>

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

        {/* Rekomendasi Bawah */}
        {otherProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>✨</span> Produk Rekomendasi Lainnya
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {otherProducts.map((p) => (
                <Link 
                  href={`/product/${p.id}`} 
                  key={p.id}
                  className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
                >
                  <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-3 border border-gray-100">
                    <img src={p.gambar1 || '/placeholder.png'} alt={p.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 group-hover:text-orange-500 transition-colors">{p.nama}</h3>
                    <div className="mt-2">
                      <p className="font-extrabold text-sm text-orange-600">Rp {p.harga.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Stok: {p.stock}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}