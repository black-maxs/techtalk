import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Klien Supabase yang membaca & menulis cookie sesi login */
export async function supabaseAuth() {
  const toples = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => toples.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              toples.set(name, value, options),
            );
          } catch {
            // Server Component tidak boleh menulis cookie. Aman diabaikan:
            // penyegaran token diurus oleh proxy.ts.
          }
        },
      },
    },
  );
}

/** Data user yang sedang login, atau null. Diverifikasi ke server Supabase. */
export async function adminSaatIni() {
  const supabase = await supabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
