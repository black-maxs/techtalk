import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let klien: SupabaseClient | null = null;

/**
 * Klien Supabase khusus server, memakai SECRET key (melewati RLS).
 * Mengembalikan null jika env belum terisi, supaya halaman publik tetap bisa jalan.
 */
export function supabaseServer(): SupabaseClient | null {
  if (klien) return klien;

  const url = process.env.SUPABASE_URL;
  const kunci = process.env.SUPABASE_SECRET_KEY;
  if (!url || !kunci) return null; // JANGAN disimpan: env mungkin sudah ada di panggilan berikutnya

  klien = createClient(url, kunci, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return klien;
}
