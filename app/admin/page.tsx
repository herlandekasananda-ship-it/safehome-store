// app/admin/page.tsx
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Produk */}
        <div className="border p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">📦 Produk Admin</h2>
          <p className="text-gray-600 mb-4">Tambah, ubah, dan hapus produk toko online kamu.</p>
          <Link href="/admin/products" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Kelola Produk
          </Link>
        </div>

        {/* Card Order */}
        <div className="border p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">🛒 Order Admin</h2>
          <p className="text-gray-600 mb-4">Lihat pesanan masuk dan ubah status pengiriman.</p>
          <Link href="/admin/orders" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Lihat Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}