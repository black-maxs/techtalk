"use server";

import { supabaseServer } from "@/lib/supabase";
import { adminSaatIni } from "@/lib/supabaseAuth";
import { statusSaatIni } from "@/lib/statusPesanan";
import type { Pesanan } from "@/lib/types";

export type HasilCheckIn =
  | { hasil: "berhasil"; nama: string; tiket: string; instansi: string }
  | { hasil: "sudah"; nama: string; waktu: string }
  | { hasil: "belum-lunas"; nama: string; status: string }
  | { hasil: "tidak-ada" }
  | { hasil: "gagal" };

export async function checkIn(kodeMentah: string): Promise<HasilCheckIn> {
  if (!(await adminSaatIni())) return { hasil: "gagal" };

  const kode = kodeMentah.trim().toUpperCase();
  const db = supabaseServer();
  if (!db) return { hasil: "gagal" };

  const { data, error } = await db
    .from("pesanan")
    .select("*")
    .eq("kode", kode)
    .maybeSingle();
  if (error) {
    console.error("Check-in: gagal membaca pesanan:", error.message);
    return { hasil: "gagal" };
  }
  if (!data) return { hasil: "tidak-ada" };

  const pesanan = data as Pesanan;

  if (statusSaatIni(pesanan) !== "paid") {
    return { hasil: "belum-lunas", nama: pesanan.nama, status: pesanan.status };
  }

  if (pesanan.check_in_pada) {
    return { hasil: "sudah", nama: pesanan.nama, waktu: pesanan.check_in_pada };
  }

  // Hanya baris yang check_in_pada-nya masih kosong yang boleh diisi.
  // Kalau dua panitia memindai QR yang sama bersamaan, hanya satu yang berhasil.
  const { data: terupdate, error: errorUpdate } = await db
    .from("pesanan")
    .update({ check_in_pada: new Date().toISOString() })
    .eq("kode", kode)
    .is("check_in_pada", null)
    .select("nama,jenis_tiket,instansi")
    .maybeSingle();

  if (errorUpdate) {
    console.error("Check-in: gagal menyimpan:", errorUpdate.message);
    return { hasil: "gagal" };
  }
  if (!terupdate)
    return {
      hasil: "sudah",
      nama: pesanan.nama,
      waktu: new Date().toISOString(),
    };

  return {
    hasil: "berhasil",
    nama: terupdate.nama as string,
    tiket: terupdate.jenis_tiket as string,
    instansi: terupdate.instansi as string,
  };
}
