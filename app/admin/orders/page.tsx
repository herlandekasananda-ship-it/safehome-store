'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Edit2, Trash2, X, RefreshCw, PhoneCall } from 'lucide-react';

// Struktur item produk di dalam pesanan gabungan
interface OrderProductItem {
  produk_id: string | number;
  nama_produk: string;
  qty: number;
}

// Struktur utama data setelah dikelompokkan (Grouped)
interface GroupedOrder {
  id: string; 
  created_at: string;
  nama: string;
  email: string | null;
  whatsapp: string;
  alamat: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderProductItem[];
  rawOrders: any[]; // Menyimpan data asli database untuk kebutuhan update massal
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // State untuk modal/form Edit
  const [editingOrder, setEditingOrder] = useState<GroupedOrder | null>(null);
  const [editForm, setEditForm] = useState({ nama: '', whatsapp: '', alamat: '' });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products:produk_id (nama)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // 🔄 PROSES GABUNGKAN PESANAN (Grouping berdasarkan Nama + WA + Waktu yang sama)
        const groups: { [key: string]: GroupedOrder } = {};

        data.forEach((order: any) => {
          const productInfo = Array.isArray(order.products) ? order.products[0] : order.products;
          const namaProduk = productInfo?.nama || `Produk ID: ${order.produk_id}`;

          // Membuat Unique Key berdasarkan Nama, Nomor WhatsApp, dan Waktu Menit Order
          const orderTime = new Date(order.created_at).toISOString().slice(0, 16); 
          const groupKey = `${order.nama}-${order.whatsapp}-${orderTime}`;

          if (!groups[groupKey]) {
            groups[groupKey] = {
              id: order.id, 
              created_at: order.created_at,
              nama: order.nama,
              email: order.email,
              whatsapp: order.whatsapp,
              alamat: order.alamat,
              total: 0, // Akan diakumulasikan
              status: order.status,
              items: [],
              rawOrders: [] // Menampung baris asli database
            };
          }

          // 1. Masukkan item produk ke dalam daftar pesanan terkait
          groups[groupKey].items.push({
            produk_id: order.produk_id,
            nama_produk: namaProduk,
            qty: order.qty
          });

          // 2. Akumulasikan total belanja agar tergabung total harganya
          groups[groupKey].total += Number(order.total);

          // 3. Simpan data asli untuk kebutuhan referensi update database kelak
          groups[groupKey].rawOrders.push(order);
        });

        // Ubah objek hasil grouping kembali menjadi bentuk Array
        setOrders(Object.values(groups));
      }
    } catch (error: any) {
      alert('Gagal mengambil data pesanan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- 1. UPDATE STATUS & MANAJEMEN STOK UNTUK MULTI-ITEMS ---
  const handleUpdateStatus = async (order: GroupedOrder, newStatus: string) => {
    if (order.status === newStatus || statusUpdatingId !== null) return;

    setStatusUpdatingId(order.id);

    // Jika diubah DARI Completed, kembalikan stok untuk semua item di dalam pesanan ini
    if (order.status === 'completed' && newStatus !== 'completed') {
      const gantiStok = confirm('Pesanan ini diubah dari Selesai. Kembalikan semua stok barang ke gudang otomatis?');
      if (gantiStok) {
        for (const item of order.items) {
          await supabase.rpc('increment_stock', { row_id: item.produk_id, quantity: item.qty });
        }
      }
    }

    // Eksekusi update status ke semua baris pesanan asli di database
    let updateSuccess = true;
    for (const raw of order.rawOrders) {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', raw.id);
      if (error) updateSuccess = false;
    }

    if (!updateSuccess) {
      alert('Ada kendala saat memperbarui beberapa status pesanan.');
      setStatusUpdatingId(null);
      return;
    }

    // Jika diubah MENJADI Completed, potong stok untuk semua produk dalam pesanan ini
    if (newStatus === 'completed' && order.status !== 'completed') {
      let stockSuccess = true;
      for (const item of order.items) {
        const { error: stockError } = await supabase.rpc('decrement_stock', { row_id: item.produk_id, quantity: item.qty });
        if (stockError) stockSuccess = false;
      }
      
      if (!stockSuccess) {
        alert('Status berhasil diselesaikan, namun beberapa stok item gagal dipotong.');
      } else {
        alert('Status Diperbarui! Semua stok produk dalam pesanan ini berhasil dipotong.');
      }
    } else {
      alert(`Status berhasil diperbarui menjadi ${newStatus}.`);
    }

    // Perbarui state local UI
    setOrders(prevOrders =>
      prevOrders.map(o => o.id === order.id ? { ...o, status: newStatus as any } : o)
    );
    setStatusUpdatingId(null);
  };

  // --- 2. HAPUS DATA ORDERS GABUNGAN ---
  const handleDeleteOrder = async (order: GroupedOrder) => {
    const yakin = confirm(`Apakah Anda yakin ingin menghapus permanen seluruh pesanan atas nama ${order.nama}? Semua produk di dalamnya akan ikut terhapus.`);
    if (!yakin) return;

    let deleteSuccess = true;
    for (const raw of order.rawOrders) {
      const { error } = await supabase.from('orders').delete().eq('id', raw.id);
      if (error) deleteSuccess = false;
    }

    if (deleteSuccess) {
      setOrders(prevOrders => prevOrders.filter(o => o.id !== order.id));
      alert('Seluruh item dalam pesanan ini berhasil dihapus.');
    } else {
      alert('Gagal menghapus beberapa data pesanan.');
    }
  };

  // --- 3. EDIT DATA ALAMAT/KONTAK GABUNGAN ---
  const startEdit = (order: GroupedOrder) => {
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

    let editSuccess = true;
    for (const raw of editingOrder.rawOrders) {
      const { error } = await supabase
        .from('orders')
        .update({
          nama: editForm.nama,
          whatsapp: editForm.whatsapp,
          alamat: editForm.alamat
        })
        .eq('id', raw.id);
      if (error) editSuccess = false;
    }

    if (editSuccess) {
      setOrders(prevOrders =>
        prevOrders.map(o => o.id === editingOrder.id ? { ...o, ...editForm } : o)
      );
      setEditingOrder(null);
      alert('Data pesanan berhasil diperbarui!');
    } else {
      alert('Gagal memperbarui beberapa data alamat pesanan.');
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
            Order Management (Grouped View)
          </span>
        </div>
        <Link href="/" className="text-sm hover:underline text-slate-300">Lihat Toko ↗</Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daftar Pesanan Masuk</h1>
            <p className="text-sm text-gray-500">Kelola pesanan gabungan multi-produk dan sinkronisasi stok gudang otomatis.</p>
          </div>
          <button 
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-1.5 self-start md:self-auto bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
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

        {/* Tabel Data */}
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
                    <th className="p-4 w-28">ID Tampilan</th>
                    <th className="p-4">Pelanggan</th>
                    <th className="p-4">Daftar Produk / Qty</th>
                    <th className="p-4">Total Gabungan</th>
                    <th className="p-4">Alamat Pengiriman</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition">
                      
                      {/* ID Referensi */}
                      <td className="p-4 font-mono font-bold text-gray-900 break-all">
                        <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs block text-center mb-1 border border-slate-200">
                          {order.id}
                        </span>
                        <span className="block font-sans font-normal text-[11px] text-gray-400 text-center">
                          {new Date(order.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </td>

                      {/* Info Pelanggan */}
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

                      {/* PRODUK YANG DIJADIKAN SATU BARIS */}
                      <td className="p-4 min-w-[220px]">
                        <div className="space-y-1.5">
                          {order.items.map((item, index) => (
                            <div key={index} className="bg-orange-50/60 border border-orange-100 rounded-lg p-2 text-xs">
                              <p className="font-semibold text-gray-800 line-clamp-1">{item.nama_produk}</p>
                              <p className="text-gray-500 font-medium mt-0.5">Jumlah: <span className="text-orange-600 font-bold">{item.qty}x</span></p>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total Gabungan Belanja */}
                      <td className="p-4 font-extrabold text-orange-600 text-base">
                        Rp {order.total.toLocaleString('id-ID')}
                      </td>

                      {/* Alamat */}
                      <td className="p-4 min-w-[200px] max-w-xs">
                        <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed break-all">
                          {order.alamat}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <select
                            value={order.status}
                            disabled={statusUpdatingId === order.id}
                            onChange={(e) => handleUpdateStatus(order, e.target.value)}
                            className="bg-white border text-xs font-medium rounded-lg p-1.5 focus:ring-2 focus:ring-orange-500 outline-none shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="processing">📦 Processing</option>
                            <option value="completed">✅ Completed</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>

                          <button
                            onClick={() => startEdit(order)}
                            disabled={statusUpdatingId === order.id}
                            className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-gray-600 disabled:opacity-50"
                            title="Edit Data Pelanggan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteOrder(order)}
                            disabled={statusUpdatingId === order.id}
                            className="p-1.5 border border-red-200 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
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