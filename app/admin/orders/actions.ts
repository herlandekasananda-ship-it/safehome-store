'use server'

import { supabase } from '../../../lib/supabase'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: number, newStatus: string) {
  // Menggunakan objek 'supabase' langsung dari lib/supabase.ts
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }

  // Menyegarkan halaman admin agar statusnya langsung berubah di layar
  revalidatePath('/admin/orders')
}