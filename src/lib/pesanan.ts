import "server-only";
import { randomInt } from "node:crypto";
import { event } from "@/data/event";
import { supabaseServer } from "@/lib/supabase";
import type { IdTiket, Pesanan, StatusPesanan } from "@/lib/types";

/**
 * Jumlah kursi terisi (pesanan lunas + pesanan pending yang belum kedaluwarsa).
 * null jika database belum tersambung atau sedang bermasalah.
 */
export async function hitungKursiTerisi(): Promise<number | null> {
  const db = supabaseServer();
  if (!db) return null;

  const { data, error } = await db.rpc("hitung_kursi_terisi");
  if (error) {
    console.error("Gagal menghitung kursi terisi:", error.message);
    return null;
  }
  return data as number;
}

export async function ambilPesanan(kode: string): Promise<Pesanan | null> {
  const db = supabaseServer();
  if (!db) return null;

  const { data, error } = await db
    .from("pesanan")
    .select("*")
    .eq("kode", kode)
    .maybeSingle();
  if (error) {
    console.error("Gagal mengambil pesanan:", error.message);
    return null;
  }
  return data as Pesanan | null;
}

// Tanpa huruf/angka yang mirip (0/O, 1/I/L) supaya mudah dibaca saat check-in
const HURUF_KODE = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** "TT26-7KQ2M-XH4PA". 31^10 kombinasi, jadi tidak bisa ditebak. */
function buatKodeTiket(): string {
  const acak = (panjang: number) =>
    Array.from(
      { length: panjang },
      () => HURUF_KODE[randomInt(HURUF_KODE.length)],
    ).join("");
  return `TT${String(event.tahun).slice(2)}-${acak(5)}-${acak(5)}`;
}

type DataPesananBaru = {
  nama: string;
  email: string;
  whatsapp: string;
  instansi: string;
  tiket: IdTiket;
  /** Harga WAJIB diambil dari data server (lib/tiket.ts), bukan dari form. */
  harga: number;
};

export type HasilBuatPesanan =
  | { ok: true; pesanan: Pesanan }
  | { ok: false; alasan: "tidak-terhubung" | "kuota-penuh" | "gagal" };

export async function buatPesanan(
  data: DataPesananBaru,
): Promise<HasilBuatPesanan> {
  const db = supabaseServer();
  if (!db) return { ok: false, alasan: "tidak-terhubung" };

  // Kode tiket acak bisa (sangat jarang) bentrok. Kalau bentrok, coba sekali lagi dengan kode baru.
  for (let percobaan = 0; percobaan < 2; percobaan++) {
    const { data: pesanan, error } = await db
      .rpc("buat_pesanan", {
        p_kode: buatKodeTiket(),
        p_nama: data.nama,
        p_email: data.email,
        p_whatsapp: data.whatsapp,
        p_instansi: data.instansi,
        p_jenis_tiket: data.tiket,
        p_harga: data.harga,
        p_kuota: event.kuota,
      })
      .single();

    if (!error) return { ok: true, pesanan: pesanan as Pesanan };
    if (error.message.includes("KUOTA_PENUH"))
      return { ok: false, alasan: "kuota-penuh" };
    if (error.code === "23505") continue; // unique_violation: kode tiket bentrok

    console.error("Gagal membuat pesanan:", error.message);
    return { ok: false, alasan: "gagal" };
  }

  return { ok: false, alasan: "gagal" };
}

export async function simpanTokenSnap(
  kode: string,
  token: string,
): Promise<void> {
  const db = supabaseServer();
  if (!db) return;

  const { error } = await db
    .from("pesanan")
    .update({ snap_token: token })
    .eq("kode", kode);
  if (error) console.error("Gagal menyimpan snap_token:", error.message);
}

/**
 * Menerapkan hasil notifikasi Midtrans ke satu pesanan.
 * Hanya dipanggil dari webhook, setelah tanda tangannya diverifikasi.
 */
export async function terapkanNotifikasi(
  kode: string,
  statusBaru: StatusPesanan,
  jumlahDibayar: number,
): Promise<void> {
  const db = supabaseServer();
  if (!db) return;

  const pesanan = await ambilPesanan(kode);
  if (!pesanan) {
    console.warn("Webhook: pesanan tidak ditemukan:", kode);
    return;
  }

  // Midtrans bisa mengirim notifikasi yang sama berkali-kali. Yang sudah lunas jangan diubah lagi.
  if (pesanan.status === "paid") return;

  // Penjagaan terakhir: nominal yang dibayar harus sama persis dengan harga di database kita
  if (statusBaru === "paid" && jumlahDibayar !== pesanan.harga) {
    console.error(
      `Webhook: nominal tidak cocok untuk ${kode}. Dibayar ${jumlahDibayar}, seharusnya ${pesanan.harga}`,
    );
    return;
  }

  const { error } = await db
    .from("pesanan")
    .update({
      status: statusBaru,
      ...(statusBaru === "paid"
        ? { dibayar_pada: new Date().toISOString() }
        : {}),
    })
    .eq("kode", kode);

  if (error) console.error("Webhook: gagal memperbarui status:", error.message);
}
