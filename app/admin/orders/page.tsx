'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Edit2, Trash2, X, RefreshCw, PhoneCall } from 'lucide-react';

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

  // State untuk modal/form Edit
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [editForm, setEditForm] = useState({ nama: '', whatsapp: '', alamat: '' });

  const fetchOrders = async () => {
    setLoading(true);
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
      const productIds = Array.from(new Set(ordersData.map(o => o.produk_id).filter(Boolean)));
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, nama')
        .in('id', productIds);

      if (productsError) {
        console.error('Gagal mengambil nama produk:', productsError.message);
      }

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

  // --- 1. UPDATE STATUS, MANAJEMEN PREVENTIF STOK ---
  const handleUpdateStatus = async (orderId: number, currentStatus: string, newStatus: string, productId: number, qty: number) => {
    if (currentStatus === newStatus) return;

    // Aksi Pencegahan Ganda & Pengembalian Stok Otomatis
    if (currentStatus === 'completed' && newStatus !== 'completed') {
      const gantiStok = confirm('Pesanan ini dibatalkan/diubah dari Selesai. Apakah Anda ingin mengembalikan stok barang ke gudang otomatis?');
      if (gantiStok) {
        const { error: incError } = await supabase.rpc('increment_stock', {
          row_id: productId,
          quantity: qty
        });
        if (incError) console.error('Gagal mengembalikan stok:', incError.message);
      }
    }

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Gagal memperbarui status: ' + error.message);
      return;
    }

    // Jika status baru diselesaikan, potong stok hanya jika status sebelumnya bukan completed
    if (newStatus === 'completed' && currentStatus !== 'completed') {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        row_id: productId,
        quantity: qty
      });

      if (stockError) {
        alert('Status diubah ke Completed, tetapi gagal memotong stok: ' + stockError.message);
      } else {
        alert('Status Diperbarui! Stok produk berhasil dipotong.');
      }
    } else {
      alert(`Status berhasil diperbarui menjadi ${newStatus}.`);
    }

    // Update UI lokal secara presisi
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus as any } : order
      )
    );
  };

  // --- 2. HAPUS DATA ORDERS ---
  const handleDeleteOrder = async (orderId: number) => {
    const yakin = confirm('Apakah Anda yakin ingin menghapus permanen data pesanan ini?');
    if (!yakin) return;

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      alert('Gagal menghapus pesanan: ' + error.message);
    } else {
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      alert('Pesanan berhasil dihapus.');
    }
  };

  // --- 3. EDIT DATA ALAMAT/KONTAK ---
  const startEdit = (order: OrderItem) => {
    setEditingOrder(order);
    setEditForm({
      nama: order.nama,
      whatsapp: order.whatsapp,
      alamat: order.alamat
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    const { error } = await supabase
      .from('orders')
      .update({
        nama: editForm.nama,
        whatsapp: editForm.whatsapp,
        alamat: editForm.alamat
      })
      .eq('id', editingOrder.id);

    if (error) {
      alert('Gagal memperbarui data: ' + error.message);
    } else {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === editingOrder.id ? { ...order, ...editForm } : order
        )
      );
      setEditingOrder(null);
      alert('Data pesanan berhasil diperbarui!');
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
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
        <Link href="/" className="text-sm hover:underline text-slate-300">Lihat Toko ↗</Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daftar Pesanan Masuk</h1>
            <p className="text-sm text-gray-500">Kelola pesanan, pengiriman, dan sinkronisasi stok gudang otomatis.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-1.5 self-start md:self-auto bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" /> Refresh Data
          </button>
        </div>

        {/* Tab Filter Status */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                filterStatus === status ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border text-gray-600 hover:bg-gray-50'
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
                    <th className="p-4 text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition">
                      <td className="p-4 font-mono font-bold text-gray-900">
                        #{order.id}
                        <span className="block font-sans font-normal text-xs text-gray-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-gray-900">{order.nama}</p>
                        <p className="text-xs text-gray-500">{order.email || '-'}</p>
                        <a 
                          href={`https://wa.me/${order.whatsapp.replace(/^0/, '62')}`} 
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-green-600 hover:underline mt-1 gap-1"
                        >
                          <PhoneCall className="w-3 h-3" /> {order.whatsapp}
                        </a>
                      </td>

                      <td className="p-4">
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {order.products?.nama || `Produk ID: ${order.produk_id}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Jumlah: {order.qty}x</p>
                      </td>

                      <td className="p-4 font-bold text-orange-600">
                        Rp {Number(order.total).toLocaleString('id-ID')}
                      </td>

                      {/* --- KOLOM ALAMAT FULL --- */}
                      <td className="p-4 min-w-[220px] max-w-sm">
                        <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed breaking-words">
                          {order.alamat}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, order.status, e.target.value, order.produk_id, order.qty)}
                            className="bg-white border text-xs font-medium rounded-lg p-1.5 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm cursor-pointer"
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="processing">📦 Processing</option>
                            <option value="completed">✅ Completed</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>

                          <button
                            onClick={() => startEdit(order)}
                            className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-gray-600"
                            title="Edit Data Pelanggan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 border border-red-200 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Hapus Pesanan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL OVERLAY UNTUK EDIT DATA */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border">
            <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider">✏️ Edit Data Order #{editingOrder.id}</h3>
              <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Pelanggan</label>
                <input 
                  type="text" required
                  value={editForm.nama} 
                  onChange={e => setEditForm({...editForm, nama: e.target.value})}
                  className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-black outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
                <input 
                  type="text" required
                  value={editForm.whatsapp} 
                  onChange={e => setEditForm({...editForm, whatsapp: e.target.value})}
                  className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-black outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Alamat Lengkap Pengiriman</label>
                <textarea 
                  rows={4} required
                  value={editForm.alamat} 
                  onChange={e => setEditForm({...editForm, alamat: e.target.value})}
                  className="w-full border border-gray-300 p-2.5 rounded-lg bg-white text-black outline-none focus:border-orange-500 text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t flex gap-2">
                <button
                  type="button" onClick={() => setEditingOrder(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg shadow-sm transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}