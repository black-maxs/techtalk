"use server";

import { revalidatePath } from "next/cache";
import { bersihkanKedaluwarsa } from "@/lib/admin";
import { adminSaatIni } from "@/lib/supabaseAuth";

export async function bersihkan() {
  // WAJIB: Server Action adalah endpoint publik. Kalau hanya mengandalkan
  // tombolnya disembunyikan, orang masih bisa memanggilnya langsung.
  if (!(await adminSaatIni())) return;

  await bersihkanKedaluwarsa();
  revalidatePath("/admin");
}
