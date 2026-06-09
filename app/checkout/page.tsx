/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, ShoppingBag, CheckCircle, Printer, X, Navigation } from 'lucide-react';

interface CheckoutItem {
  product_id: number;
  nama: string;
  harga: number;
  qty: number;
  gambar: string | null;
}

interface RegionItem {
  id: string;
  name: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const strukRef = useRef<HTMLDivElement>(null);
  
  // FIX HYDRATION: State untuk memastikan komponen sudah terpasang di client
  const [isMounted, setIsMounted] = useState(false);

  const [cartItem, setCartItem] = useState<CheckoutItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [regencies, setRegencies] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);
  const [villages, setVillages] = useState<RegionItem[]>([]); // State baru untuk Kelurahan/Desa
  const [loadingGPS, setLoadingGPS] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
    provinsi: '',
    kota: '',
    kecamatan: '',
    kelurahan: '', // Properti baru
    kodePos: '',
    detailAlamat: '',
  });

  useEffect(() => {
    setIsMounted(true);

    const savedItem = sessionStorage.getItem('checkout_item');
    if (!savedItem) {
      alert('Tidak ada produk di keranjang checkout.');
      router.push('/');
      return;
    }
    setCartItem(JSON.parse(savedItem));

    // Ambil data provinsi di sisi client
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error('Gagal memuat provinsi:', err));
  }, [router]);

  const handleProvinsiChange = async (provinsiName: string) => {
    const selectedProv = provinces.find(p => p.name === provinsiName);
    setFormData({ ...formData, provinsi: provinsiName, kota: '', kecamatan: '', kelurahan: '' });
    setRegencies([]);
    setDistricts([]);
    setVillages([]);

    if (selectedProv) {
      try {
        const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv.id}.json`);
        const data = await res.json();
        setRegencies(data);
      } catch (err) {
        console.error('Gagal memuat kota:', err);
      }
    }
  };

  const handleKotaChange = async (kotaName: string) => {
    const selectedKota = regencies.find(r => r.name === kotaName);
    setFormData({ ...formData, kota: kotaName, kecamatan: '', kelurahan: '' });
    setDistricts([]);
    setVillages([]);

    if (selectedKota) {
      try {
        const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedKota.id}.json`);
        const data = await res.json();
        setDistricts(data);
      } catch (err) {
        console.error('Gagal memuat kecamatan:', err);
      }
    }
  };

  const handleKecamatanChange = async (kecamatanName: string) => {
    const selectedKec = districts.find(d => d.name === kecamatanName);
    setFormData({ ...formData, kecamatan: kecamatanName, kelurahan: '' });
    setVillages([]);

    if (selectedKec) {
      try {
        const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedKec.id}.json`);
        const data = await res.json();
        setVillages(data);
      } catch (err) {
        console.error('Gagal memuat kelurahan:', err);
      }
    }
  };

  const handleGetGPSLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Browser atau HP Anda tidak mendukung deteksi lokasi otomatis.');
      return;
    }

    setLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await res.json();
          
          if (data && data.address) {
            const addr = data.address;
            const detilJalan = data.display_name || '';
            
            setFormData(prev => ({
              ...prev,
              provinsi: addr.state || prev.provinsi,
              kota: addr.city || addr.regency || addr.state_district || prev.kota,
              kecamatan: addr.suburb || addr.municipality || prev.kecamatan,
              kelurahan: addr.village || addr.village_marketplace || prev.kelurahan,
              kodePos: addr.postcode || prev.kodePos,
              detailAlamat: detilJalan,
            }));
            alert('Lokasi berhasil dikunci! Silakan periksa kembali kecocokan wilayah di form.');
          } else {
            alert('Gagal menerjemahkan koordinat GPS ke teks alamat.');
          }
        } catch (error) {
          console.error(error);
          alert('Gagal mengambil data alamat dari server koordinat.');
        } finally {
          setLoadingGPS(false);
        }
      },
      (error) => {
        console.error("GPS Error Log:", error);
        alert('Gagal mendapatkan lokasi. Pastikan GPS HP aktif dan izin lokasi di-allow pada browser.');
        setLoadingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!isMounted || !cartItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 text-sm font-medium">Memuat sistem checkout aman...</p>
      </div>
    );
  }

  const totalTagihan = cartItem.harga * cartItem.qty;
  const gabunganAlamat = `${formData.detailAlamat}, Kel. ${formData.kelurahan}, Kec. ${formData.kecamatan}, ${formData.kota}, ${formData.provinsi} (${formData.kodePos})`;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.whatsapp || !formData.provinsi || !formData.kota || !formData.kecamatan || !formData.kelurahan || !formData.detailAlamat) {
      alert('Mohon lengkapi data pengiriman Anda.');
      return;
    }

    setSubmitting(true);
    const customInvoiceId = `SH-${Date.now().toString().slice(-6)}`;

    const { error } = await supabase
      .from('orders')
      .insert([
        {
          nama: formData.nama,
          email: formData.email || null,
          whatsapp: formData.whatsapp,
          alamat: gabunganAlamat,
          produk_id: cartItem.product_id,
          qty: cartItem.qty,
          total: totalTagihan,
          status: 'pending'
        }
      ]);

    if (error) {
      alert('Gagal memproses pesanan: ' + error.message);
      setSubmitting(false);
    } else {
      await supabase.rpc('decrement_stock', { 
        row_id: cartItem.product_id, 
        quantity: cartItem.qty 
      });

      setOrderId(customInvoiceId);
      setSubmitting(false);
      setShowInvoice(true); 
      sessionStorage.removeItem('checkout_item');
    }
  };

  const handlePrintInvoice = () => {
    const printContent = strukRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); 
    }
  };

  return (
    <div className="bg-[#f4f4f4] min-h-screen text-[#333333] antialiased pb-16">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
            SAFEHOME<span className="text-orange-500">STORE</span>
          </Link>
          <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2.5 py-1 rounded">Formulir Checkout Aman</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* SISI KIRI: Formulir Alamat */}
        <div className="lg:col-span-7 bg-white p-5 md:p-6 rounded border border-gray-200 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" /> Informasi Alamat Pengiriman
            </h2>
            <button
              type="button"
              onClick={handleGetGPSLocation}
              disabled={loadingGPS}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-xs transition"
            >
              <Navigation className={`w-3 h-3 ${loadingGPS ? 'animate-spin' : ''}`} />
              {loadingGPS ? 'Mengunci Koordinat...' : '📍 Sherlock Alamat'}
            </button>
          </div>
          
          <form onSubmit={handleSubmitOrder} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nama Penerima *</label>
                <input 
                  required type="text" placeholder="Masukkan nama lengkap"
                  value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})}
                  className="w-full border border-gray-300 p-2.5 rounded text-black bg-white focus:border-orange-500 outline-none text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nomor WhatsApp / HP *</label>
                <input 
                  required type="tel" placeholder="Contoh: 08123456789"
                  value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full border border-gray-300 p-2.5 rounded text-black bg-white focus:border-orange-500 outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email (Opsional)</label>
              <input 
                type="email" placeholder="alamat.email@anda.com"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 p-2.5 rounded text-black bg-white focus:border-orange-500 outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Provinsi *</label>
                <select
                  required
                  value={formData.provinsi}
                  onChange={e => handleProvinsiChange(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 rounded text-black bg-white focus:border-orange-500 outline-none text-xs cursor-pointer"
                >
                  <option value="">-- Pilih Provinsi --</option>
                  {provinces.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Kota / Kabupaten *</label>
                <select
                  required
                  disabled={!formData.provinsi}
                  value={formData.kota}
                  onChange={e => handleKotaChange(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 rounded text-black bg-white focus:border-orange-500 outline-none text-xs cursor-pointer disabled:bg-gray-100"
                >
                  <option value="">-- Pilih Kota/Kabupaten --</option>
                  {regencies.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Kecamatan *</label>
                <select
                  required
                  disabled={!formData.kota}
                  value={formData.kecamatan}
                  onChange={e => handleKecamatanChange(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 rounded text-black bg-white focus:border-orange-500 outline-none text-xs cursor-pointer disabled:bg-gray-100"
                >
                  <option value="">-- Pilih Kecamatan --</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Kelurahan / Desa *</label>
                <select
                  required
                  disabled={!formData.kecamatan}
                  value={formData.kelurahan}
                  onChange={e => setFormData({...formData, kelurahan: e.target.value})}
                  className="w-full border border-gray-300 p-2.5 rounded text-black bg-white focus:border-orange-500 outline-none text-xs cursor-pointer disabled:bg-gray-100"
                >
                  <option value="">-- Pilih Kelurahan/Desa --</option>
                  {villages.map(v => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Kode Pos *</label>
              <input 
                required type="text" placeholder="Contoh: 40132"
                value={formData.kodePos} onChange={e => setFormData({...formData, kodePos: e.target.value})}
                className="w-full border border-gray-300 p-2.5 rounded text-black bg-white focus:border-orange-500 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Detail Nama Jalan, RT/RW & No. Rumah *</label>
              <textarea 
                required rows={3} placeholder="Nama jalan, nomor bangunan, nomor RT/RW, nomor kamar, dsb."
                value={formData.detailAlamat} onChange={e => setFormData({...formData, detailAlamat: e.target.value})}
                className="w-full border border-gray-300 p-2.5 rounded text-black bg-white focus:border-orange-500 outline-none text-xs leading-relaxed"
              />
            </div>

            <button
              type="submit" disabled={submitting}
              className={`w-full font-bold py-3 px-4 rounded text-xs text-white text-center tracking-wider uppercase transition shadow-sm ${
                submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {submitting ? 'Sedang Menyimpan Transaksi...' : 'Konfirmasi & Kirim Pesanan'}
            </button>
          </form>
        </div>

        {/* SISI KANAN: Ringkasan Belanja */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 md:p-5 rounded border border-gray-200 shadow-sm">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-orange-500" /> Ringkasan Pembelian
            </h2>
            
            <div className="flex gap-4">
              <img 
                src={cartItem.gambar || '/placeholder.png'} alt="" 
                className="w-16 h-16 object-contain rounded border border-gray-100 bg-white flex-shrink-0"
              />
              <div className="text-xs">
                <h3 className="font-bold text-gray-800 line-clamp-2 leading-tight">{cartItem.nama}</h3>
                <p className="text-gray-400 mt-1">Kuantitas: {cartItem.qty} unit</p>
                <p className="text-gray-900 font-extrabold mt-1">Rp {cartItem.harga.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-5 pt-4 space-y-2.5 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Subtotal Barang</span>
                <span className="font-medium text-gray-800">Rp {totalTagihan.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[#2ecc71] font-semibold">
                <span>Kurir Pengiriman</span>
                <span>Gratis Ongkir / COD</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 border-t border-dashed pt-3 mt-2">
                <span>Total Tagihan</span>
                <span className="text-orange-500 text-base font-black">Rp {totalTagihan.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50/70 border border-orange-200/60 p-4 rounded text-[11px] text-orange-800 leading-relaxed">
            💡 <strong>Informasi Sistem Pembayaran:</strong> Transaksi ini menggunakan sistem COD (Bayar di Tempat) / Transfer Mandiri Mandat. Tim operasional admin kami akan segera memvalidasi alamat kirim via nomor WhatsApp aktif Anda dalam hitungan menit.
          </div>
        </div>
      </main>

      {/* POP UP MODAL STRUK BELANJA */}
      {showInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded shadow-2xl overflow-hidden my-auto">
            
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-[#2ecc71]" /> Invoice Pembelian Sukses
              </div>
              <button 
                onClick={() => { setShowInvoice(false); router.push('/'); }} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AREA NOTA INVOICE YANG DICETAK */}
            <div ref={strukRef} className="p-6 bg-white font-mono text-xs text-[#222222] space-y-4">
              <div className="text-center border-b border-dashed border-gray-400 pb-3">
                <h2 className="text-sm font-bold tracking-widest">SAFEHOME STORE</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Solusi Keamanan & Kenyamanan Hunian</p>
                <p className="text-[10px] text-gray-400 mt-1">ID Transaksi: {orderId}</p>
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-1">Detail Penerima Paket:</p>
                <table className="w-full text-[11px] space-y-0.5">
                  <tbody>
                    <tr><td className="w-20 text-gray-400">Nama</td><td>: {formData.nama}</td></tr>
                    <tr><td className="text-gray-400">Kontak</td><td>: {formData.whatsapp}</td></tr>
                    <tr><td className="text-gray-400">Alamat</td><td className="leading-tight">: {gabunganAlamat}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-b border-dashed border-gray-400 py-2.5">
                <p className="font-bold text-gray-900 mb-1.5">Rincian Belanja:</p>
                <div className="flex justify-between items-start text-[11px]">
                  <span className="max-w-[240px] pr-2">{cartItem.nama} ({cartItem.qty}x)</span>
                  <span className="font-bold shrink-0">Rp {totalTagihan.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="space-y-1 text-right text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-400">Metode Pengiriman:</span>
                  <span className="font-bold text-gray-900">COD / Cash On Delivery</span>
                </div>
                <div className="flex justify-between border-t pt-1.5 text-xs font-bold">
                  <span>TOTAL BAYAR:</span>
                  <span className="text-orange-600 font-black">Rp {totalTagihan.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="text-center text-[10px] text-gray-400 pt-3 border-t border-dashed border-gray-300">
                 Terima kasih telah berbelanja di SafeHome Store! <br />
                Simpan nota ini sebagai bukti transaksi sah Anda.
              </div>
            </div>

            {/* Menu Tombol Aksi */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handlePrintInvoice}
                className="flex-1 bg-gray-900 text-white font-bold py-2 px-4 rounded text-xs flex items-center justify-center gap-1.5 hover:bg-black transition"
              >
                Cetak / Unduh Struk
              </button>
              <button
                onClick={() => { setShowInvoice(false); router.push('/'); }}
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded text-xs hover:bg-gray-300 transition text-center"
              >
                Selesai & Kembali
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}