import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let klien: SupabaseClient | null | undefined;

/**
 * Klien Supabase khusus server, memakai SECRET key (melewati RLS).
 * Mengembalikan null jika .env.local belum diisi, supaya landing page
 * tetap bisa jalan tanpa database.
 */
export function supabaseServer(): SupabaseClient | null {
  if (klien !== undefined) return klien;

  const url = process.env.SUPABASE_URL;
  const kunci = process.env.SUPABASE_SECRET_KEY;
  klien =
    url && kunci
      ? createClient(url, kunci, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;

  return klien;
}
