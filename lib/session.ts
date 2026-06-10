// lib/session.ts

export function getOrCreateSessionId(): string {
  // Validasi agar tidak error saat proses Rendering di Server (SSR Next.js)
  if (typeof window === 'undefined') return '';

  // Ambil ID yang tersimpan di browser pembeli
  let sessionId = localStorage.getItem('safehome_session_id');

  // Jika pembeli baru pertama kali datang dan belum punya ID
  if (!sessionId) {
    // Buat UUID acak baru (contoh hasil: "f47ac10b-58cc-4372-a567-0e02b2c3d479")
    sessionId = crypto.randomUUID();
    // Simpan di storage browser agar ketika di-refresh ID-nya tidak berubah
    localStorage.setItem('safehome_session_id', sessionId);
  }

  return sessionId;
}