'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface OrderItem {
  id: number;
  created_at: string;
  nama: string;
  email: string | null;
  whatsapp: string;
  alamat: string;
  produk_id: number;
  qty: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  products?: {
    nama: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // 1. Ambil data orders dan data products secara terpisah sesuai skema database kamu
  const fetchOrders = async () => {
    setLoading(true);
    
    // Tahap A: Ambil semua data dari tabel 'orders'
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('id', { ascending: false });

    if (ordersError) {
      alert('Gagal mengambil data pesanan: ' + ordersError.message);
      setLoading(false);
      return;
    }

    if (ordersData && ordersData.length > 0) {
      // Tahap B: Ambil semua ID produk unik dari daftar order
      const productIds = Array.from(new Set(ordersData.map(o => o.produk_id).filter(Boolean)));

      // Tahap C: Ambil nama produk dari tabel 'products' berdasarkan ID tersebut
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, nama')
        .in('id', productIds);

      if (productsError) {
        console.error('Gagal mengambil nama produk:', productsError.message);
      }

      // Tahap D: Gabungkan nama produk ke masing-masing data order di level aplikasi
      const combinedData = ordersData.map(order => {
        const matchingProduct = productsData?.find(p => p.id === order.produk_id);
        return {
          ...order,
          products: matchingProduct ? { nama: matchingProduct.nama } : undefined
        };
      });

      setOrders(combinedData);
    } else {
      setOrders([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Fungsi untuk mengubah status pesanan langsung dari tabel admin
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Gagal memperbarui status: ' + error.message);
    } else {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
    }
  };

  // 3. Filter data berdasarkan tab status yang dipilih admin
  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  // Helper warna badge status pesanan
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 text-black">
      {/* Navbar Admin */}
      <nav className="bg-slate-900 text-white shadow-sm py-4 px-6 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="text-xl font-bold text-orange-500 flex items-center gap-2">
            🛡️ SafeHome Admin
          </Link>
          <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700">
            Order Management
          </span>
        </div>
        <Link href="/" className="text-sm hover:underline text-slate-300">
          Lihat Toko ↗
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daftar Pesanan Masuk</h1>
            <p className="text-sm text-gray-500">Kelola pesanan, pengiriman, dan status pembayaran COD/Transfer.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="self-start md:self-auto bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Tab Filter Status */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                filterStatus === status
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'Semua Pesanan' : status}
            </button>
          ))}
        </div>

        {/* Konten Utama / Tabel */}
        {loading ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-2"></div>
            <p className="text-gray-500">Sedang memuat data pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm text-gray-500">
            📭 Tidak ada data pesanan dengan status <strong>{filterStatus}</strong>.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                    <th className="p-4 w-16">ID</th>
                    <th className="p-4">Pelanggan</th>
                    <th className="p-4">Produk / Qty</th>
                    <th className="p-4">Total Tagihan</th>
                    <th className="p-4">Alamat Pengiriman</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition">
                      
                      {/* ID & Tgl */}
                      <td className="p-4 font-mono font-bold text-gray-900">
                        #{order.id}
                        <span className="block font-sans font-normal text-xs text-gray-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </td>

                      {/* Info Pelanggan */}
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{order.nama}</p>
                        <p className="text-xs text-gray-500">{order.email || '-'}</p>
                        <a 
                          href={`https://wa.me/${order.whatsapp.replace(/^0/, '62')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-green-600 hover:underline mt-1 gap-1"
                        >
                          💬 WhatsApp ({order.whatsapp})
                        </a>
                      </td>

                      {/* Detail Produk */}
                      <td className="p-4">
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {order.products?.nama || `Produk ID: ${order.produk_id}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Jumlah: {order.qty}x</p>
                      </td>

                      {/* Total Biaya (Mendukung NUMERIC database) */}
                      <td className="p-4 font-bold text-orange-600">
                        Rp {Number(order.total).toLocaleString('id-ID')}
                      </td>

                      {/* Alamat */}
                      <td className="p-4 max-w-xs">
                        <p className="text-xs line-clamp-2" title={order.alamat}>
                          {order.alamat}
                        </p>
                      </td>

                      {/* Badge Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Kontrol Aksi Ganti Status */}
                      <td className="p-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="bg-white border text-xs font-medium rounded-lg p-1.5 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm cursor-pointer"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="processing">📦 Processing</option>
                          <option value="completed">✅ Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}