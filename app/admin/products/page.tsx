// app/admin/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// 1. Definisikan tipe data struktur produk sesuai database Supabase kamu
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
  created_at: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // State Form Tambah Produk
  const [form, setForm] = useState({
    nama: '',
    harga: 0,
    stock: 0,
    deskripsi: '',
    gambar1: '',
    gambar2: '',
    gambar3: '',
    video: ''
  });

  // 2. Ambil Data Produk dari Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 3. Aksi Tambah Produk Baru
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('products')
      .insert([
        {
          nama: form.nama,
          harga: Number(form.harga),
          stock: Number(form.stock),
          deskripsi: form.deskripsi || null,
          gambar1: form.gambar1 || null,
          gambar2: form.gambar2 || null,
          gambar3: form.gambar3 || null,
          video: form.video || null
        }
      ]);

    if (error) {
      alert('Gagal menambah produk: ' + error.message);
    } else {
      alert('Produk berhasil ditambahkan!');
      // Reset form kembali kosong
      setForm({ 
        nama: '', 
        harga: 0, 
        stock: 0, 
        deskripsi: '', 
        gambar1: '', 
        gambar2: '', 
        gambar3: '', 
        video: '' 
      });
      fetchProducts();
    }
  };

  // 4. Aksi Hapus Produk
  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert('Gagal menghapus');
      else fetchProducts();
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📦 Kelola Produk Admin</h1>

      {/* Form Tambah Produk */}
      <form onSubmit={handleAddProduct} className="bg-gray-50 p-6 rounded-xl border mb-10 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Tambah Produk Baru</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Nama Produk</label>
            <input required type="text" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full border p-2 rounded mt-1 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium">Harga (Rp)</label>
            <input required type="number" value={form.harga || ''} onChange={e => setForm({...form, harga: Number(e.target.value)})} className="w-full border p-2 rounded mt-1 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium">Stok</label>
            <input required type="number" value={form.stock || ''} onChange={e => setForm({...form, stock: Number(e.target.value)})} className="w-full border p-2 rounded mt-1 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium">URL Video (Opsional)</label>
            <input type="text" placeholder="https://example.com/video.mp4" value={form.video} onChange={e => setForm({...form, video: e.target.value})} className="w-full border p-2 rounded mt-1 text-black" />
          </div>
        </div>

        {/* Baris Input Khusus Gambar-Gambar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium">URL Gambar 1 (Utama)</label>
            <input required type="text" placeholder="https://link-gambar-1.jpg" value={form.gambar1} onChange={e => setForm({...form, gambar1: e.target.value})} className="w-full border p-2 rounded mt-1 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium">URL Gambar 2</label>
            <input type="text" placeholder="https://link-gambar-2.jpg" value={form.gambar2} onChange={e => setForm({...form, gambar2: e.target.value})} className="w-full border p-2 rounded mt-1 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium">URL Gambar 3</label>
            <input type="text" placeholder="https://link-gambar-3.jpg" value={form.gambar3} onChange={e => setForm({...form, gambar3: e.target.value})} className="w-full border p-2 rounded mt-1 text-black" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Deskripsi Produk</label>
          <textarea value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} className="w-full border p-2 rounded mt-1 text-black" rows={3} />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">
          Simpan Produk
        </button>
      </form>

      {/* Tabel List Produk */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Daftar Produk Aktif</h2>
      {loading ? (
        <p>Loading produk...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-3">Gambar</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <img src={prod.gambar1 || '/placeholder.png'} alt="" className="w-10 h-10 object-cover rounded border" />
                      {prod.gambar2 && <img src={prod.gambar2} alt="" className="w-10 h-10 object-cover rounded border opacity-60" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{prod.nama}</td>
                  <td className="px-4 py-3">Rp {prod.harga.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3">{prod.stock} Pcs</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleDelete(prod.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">Belum ada produk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}