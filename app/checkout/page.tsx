// app/checkout/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface CheckoutItem {
  product_id: number;
  nama: string;
  harga: number;
  qty: number;
  gambar: string | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItem, setCartItem] = useState<CheckoutItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // State Form sesuai kolom tabel public.orders kamu
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
    alamat: '',
  });

  // 1. Ambil data barang yang disimpan sementara dari Halaman Detail
  useEffect(() => {
    const savedItem = sessionStorage.getItem('checkout_item');
    if (!savedItem) {
      alert('Tidak ada produk di keranjang checkout.');
      router.push('/');
      return;
    }
    setCartItem(JSON.parse(savedItem));
  }, [router]);

  if (!cartItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">Memuat data transaksi...</p>
      </div>
    );
  }

  const totalTagihan = cartItem.harga * cartItem.qty;

  // 2. Aksi simpan data ke tabel public.orders Supabase
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.whatsapp || !formData.alamat) {
      alert('Mohon lengkapi Nama, WhatsApp, dan Alamat Anda.');
      return;
    }

    setSubmitting(true);

    // Mengirim data pas sesuai dengan skema tabel database kamu
    const { error } = await supabase
      .from('orders')
      .insert([
        {
          nama: formData.nama,
          email: formData.email || null, // Opsional
          whatsapp: formData.whatsapp,
          alamat: formData.alamat,
          produk_id: cartItem.product_id, // Masuk ke kolom produk_id
          qty: cartItem.qty,             // Masuk ke kolom qty
          total: totalTagihan,           // Masuk ke kolom total
          status: 'pending'              // Sesuai default value database
        }
      ]);

    if (error) {
      alert('Gagal memproses pesanan: ' + error.message);
      setSubmitting(false);
    } else {
      // 3. Kurangi stok produk secara otomatis
      await supabase.rpc('decrement_stock', { 
        row_id: cartItem.product_id, 
        quantity: cartItem.qty 
      });

      alert('Pesanan Anda berhasil dibuat!');
      
      // Bersihkan session data belanja
      sessionStorage.removeItem('checkout_item');
      
      // Redirect ke halaman sukses / utama
      router.push('/');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b py-4 px-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-orange-600">
            🏡 SafeHome Store
          </Link>
          <span className="text-sm text-gray-500 font-medium">Formulir Checkout Aman</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* KIRI (3 Kolom): Form Alamat Pengiriman */}
        <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Data Pengiriman</h2>
          
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Nama Lengkap *</label>
              <input 
                required 
                type="text" 
                placeholder="Contoh: Budi Santoso"
                value={formData.nama}
                onChange={e => setFormData({...formData, nama: e.target.value})}
                className="w-full border p-3 rounded-lg mt-1 text-black bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Nomor WhatsApp / HP *</label>
              <input 
                required 
                type="tel" 
                placeholder="Contoh: 081234567890"
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full border p-3 rounded-lg mt-1 text-black bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Email (Opsional)</label>
              <input 
                type="email" 
                placeholder="budi@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border p-3 rounded-lg mt-1 text-black bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Alamat Lengkap Rumah *</label>
              <textarea 
                required 
                rows={4}
                placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, Kecamatan, dan Kota/Kabupaten secara detail"
                value={formData.alamat}
                onChange={e => setFormData({...formData, alamat: e.target.value})}
                className="w-full border p-3 rounded-lg mt-1 text-black bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full font-bold py-3 px-4 rounded-lg text-white text-center shadow-md transition ${
                submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {submitting ? 'Sedang Memproses...' : 'Konfirmasi & Kirim Pesanan'}
            </button>
          </form>
        </div>

        {/* KANAN (2 Kolom): Ringkasan Belanja */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 border-b pb-3 mb-4">Ringkasan Produk</h2>
            
            <div className="flex gap-4">
              <img 
                src={cartItem.gambar || '/placeholder.png'} 
                alt="" 
                className="w-16 h-16 object-cover rounded-lg border bg-gray-50 flex-shrink-0"
              />
              <div className="text-sm">
                <h3 className="font-semibold text-gray-800 line-clamp-2">{cartItem.nama}</h3>
                <p className="text-gray-500 mt-0.5">Qty: {cartItem.qty}x</p>
                <p className="text-orange-600 font-bold mt-1">Rp {cartItem.harga.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="border-t mt-5 pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span>Rp {totalTagihan.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Biaya Pengiriman</span>
                <span>Gratis / COD</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-3 mt-2">
                <span>Total Tagihan</span>
                <span className="text-orange-600">Rp {totalTagihan.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-xs text-orange-800 leading-relaxed">
            💡 <strong>Sistem Pembayaran COD / Transfer Manual:</strong> Admin kami akan langsung menghubungi Anda melalui nomor WhatsApp yang dicantumkan untuk konfirmasi pengiriman barang setelah formulir ini dikirim.
          </div>
        </div>

      </main>
    </div>
  );
}