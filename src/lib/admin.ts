import "server-only";
import { event } from "@/data/event";
import { supabaseServer } from "@/lib/supabase";
import type { Pesanan, StatusPesanan } from "@/lib/types";

export type Ringkasan = {
  lunas: number;
  pendapatan: number;
  pending: number;
  sisaKuota: number;
  checkIn: number;
};

export async function ringkasanPeserta(): Promise<Ringkasan | null> {
  const db = supabaseServer();
  if (!db) return null;

  const { data, error } = await db
    .from("pesanan")
    .select("status,harga,check_in_pada,kedaluwarsa_pada");
  if (error) {
    console.error("Gagal mengambil ringkasan:", error.message);
    return null;
  }

  const sekarang = Date.now();
  let lunas = 0;
  let pendapatan = 0;
  let checkIn = 0;
  let pending = 0;

  for (const p of data) {
    if (p.status === "paid") {
      lunas++;
      pendapatan += p.harga;
      if (p.check_in_pada) checkIn++;
    } else if (
      p.status === "pending" &&
      new Date(p.kedaluwarsa_pada).getTime() > sekarang
    ) {
      pending++;
    }
  }

  return {
    lunas,
    pendapatan,
    pending,
    checkIn,
    sisaKuota: Math.max(0, event.kuota - lunas - pending),
  };
}

export type FilterPeserta = {
  status?: StatusPesanan | "semua";
  cari?: string;
};

export async function daftarPeserta({
  status = "semua",
  cari = "",
}: FilterPeserta): Promise<Pesanan[]> {
  const db = supabaseServer();
  if (!db) return [];

  let kueri = db
    .from("pesanan")
    .select("*")
    .order("dibuat_pada", { ascending: false })
    .limit(500);

  if (status !== "semua") kueri = kueri.eq("status", status);

  // Hanya huruf, angka, spasi, dan @ . - _ yang diizinkan. Karakter lain seperti
  // koma dan kurung punya arti khusus di filter PostgREST, jadi dibuang.
  const aman = cari.trim().replace(/[^\p{L}\p{N}@._\- ]/gu, "");
  if (aman) {
    kueri = kueri.or(
      `nama.ilike.%${aman}%,email.ilike.%${aman}%,kode.ilike.%${aman}%,instansi.ilike.%${aman}%`,
    );
  }

  const { data, error } = await kueri;
  if (error) {
    console.error("Gagal mengambil peserta:", error.message);
    return [];
  }
  return data as Pesanan[];
}

/** Ubah pesanan pending yang sudah lewat batas bayar menjadi expired. Mengembalikan jumlah baris. */
export async function bersihkanKedaluwarsa(): Promise<number> {
  const db = supabaseServer();
  if (!db) return 0;

  const { data, error } = await db
    .from("pesanan")
    .update({ status: "expired" })
    .eq("status", "pending")
    .lt("kedaluwarsa_pada", new Date().toISOString())
    .select("kode");

  if (error) {
    console.error("Gagal membersihkan pesanan kedaluwarsa:", error.message);
    return 0;
  }
  return data?.length ?? 0;
}
