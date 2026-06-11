'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getOrCreateSessionId } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: number; // ID Baris Keranjang (carts)
  quantity: number;
  products: {
    id: string | number; // PENYESUAIAN: ID Produk dibuat fleksibel sesuai skema database Anda
    nama: string;
    harga: number;
    gambar1: string | null;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil data keranjang dari Supabase berdasarkan Session ID
  async function fetchCart() {
    try {
      const sessionId = getOrCreateSessionId();
      if (!sessionId) return;

      const { data, error } = await supabase
        .from('carts')
        .select(`
          id,
          quantity,
          products (
            id,
            nama,
            harga,
            gambar1
          )
        `)
        .eq('session_id', sessionId);

      if (error) throw error;

      if (data) {
        // Melakukan mapping data untuk memastikan struktur array objek bersih dan valid
        const cleanedData = (data as any[]).map((item) => ({
          id: item.id,
          quantity: item.quantity,
          products: Array.isArray(item.products) ? item.products[0] : item.products,
        })).filter(item => item.products !== null); // Bersihkan jika produk tiba-tiba terhapus di database

        setCartItems(cleanedData as CartItem[]);
      }
    } catch (err) {
      console.error('Gagal memuat keranjang:', err);
    } finally {
      setLoading(false);
    }
  }

  // 2. Menghapus item dari keranjang
  async function handleRemoveItem(cartId: number) {
    try {
      const { error } = await supabase.from('carts').delete().eq('id', cartId);
      if (error) throw error;
      
      // Update state local agar langsung hilang dari layar
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
    } catch (err) {
      alert('Gagal menghapus produk dari keranjang.');
      console.error(err);
    }
  }

  // 3. Menghitung Total Belanja dari semua produk di keranjang
  const totalHarga = cartItems.reduce((acc, item) => {
    return acc + (item.products?.harga || 0) * item.quantity;
  }, 0);

  // 4. Mengemas SEMUA produk menjadi array sebelum dikirim ke checkout
  function handleGoToCheckout() {
    if (cartItems.length === 0) return;

    // Memetakan semua item di keranjang menjadi struktur array objek baru
    const itemsUntukCheckout = cartItems.map((item) => ({
      product_id: item.products.id, // ID Produk yang aman untuk relasi orders & pengurangan stok
      nama: item.products.nama,
      harga: item.products.harga,
      qty: item.quantity,
      gambar: item.products.gambar1 || null
    }));

    // Menyimpan struktur array ke sessionStorage dengan key 'checkout_item'
    sessionStorage.setItem('checkout_item', JSON.stringify(itemsUntukCheckout));

    // Alihkan pengguna ke halaman checkout
    router.push('/checkout');
  }

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-xs font-medium">Memuat Isi Keranjang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-gray-800 antialiased font-sans">
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Tombol Kembali */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Toko</span>
        </Link>

        {/* Judul Halaman */}
        <h1 className="text-2xl font-bold text-gray-950 mb-6 tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-orange-500" />
          <span>Keranjang Belanja</span>
        </h1>

        {/* Kondisi Jika Keranjang Kosong */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">Keranjang Kamu Kosong</h3>
            <p className="text-gray-400 text-xs mb-5">Belum ada barang yang dimasukkan.</p>
            <Link href="/" className="inline-block bg-gray-900 hover:bg-orange-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Daftar Produk di Keranjang */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0 gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Gambar Produk */}
                    <div className="w-16 h-16 bg-gray-50 rounded-xl p-2 flex items-center justify-center border border-gray-100 flex-shrink-0">
                      <img 
                        src={item.products?.gambar1 || '/placeholder.png'} 
                        className="max-w-full max-h-full object-contain mix-blend-multiply" 
                        alt={item.products?.nama} 
                      />
                    </div>
                    {/* Detail Produk */}
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">
                        {item.products?.nama}
                      </h3>
                      <p className="text-[11px] font-medium text-gray-500">
                        {item.quantity} barang × <span className="text-gray-900 font-semibold">Rp {item.products?.harga?.toLocaleString('id-ID')}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Tombol Hapus */}
                  <button 
                    onClick={() => handleRemoveItem(item.id)} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Ringkasan & Tombol Aksi */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-3">
                <span className="text-gray-500 font-medium">Subtotal Belanja</span>
                <span className="text-base font-extrabold text-gray-900">
                  Rp {totalHarga.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Tombol Trigger ke Checkout */}
              <button 
                onClick={handleGoToCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Lanjut Isi Form Alamat & Checkout ({cartItems.length} Produk)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}