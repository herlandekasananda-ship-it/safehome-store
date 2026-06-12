import { supabase } from '@/lib/supabase';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Ambil semua produk dari database
  const { data: products } = await supabase
    .from('products')
    .select('id, created_at');

  // 2. Buat array URL produk
  const productUrls = (products || []).map((product) => ({
    url: `https://safehome-store.com/product/${product.id}`,
    lastModified: product.created_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Gabungkan dengan halaman statis lainnya
  return [
    {
      url: 'https://safehome-store.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...productUrls,
  ];
}