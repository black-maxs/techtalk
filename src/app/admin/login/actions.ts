"use server";

import { redirect } from "next/navigation";
import { supabaseAuth } from "@/lib/supabaseAuth";

export type StateLogin = { pesan?: string };

export async function masuk(
  _state: StateLogin,
  formData: FormData,
): Promise<StateLogin> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { pesan: "Email dan password wajib diisi." };

  const supabase = await supabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // Pesannya sengaja tidak menyebut mana yang salah, supaya tidak membocorkan email mana yang terdaftar
  if (error) return { pesan: "Email atau password salah." };

  redirect("/admin");
}

export async function keluar() {
  const supabase = await supabaseAuth();
  await supabase.auth.signOut();
  redirect("/login-panitia");
}
