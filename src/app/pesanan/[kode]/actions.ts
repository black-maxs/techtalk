"use server";

import { headers } from "next/headers";
import { buatTokenSnap } from "@/lib/midtrans";
import { ambilPesanan, simpanTokenSnap } from "@/lib/pesanan";
import { statusSaatIni } from "@/lib/statusPesanan";

export type HasilPembayaran = { token: string } | { error: string };

/** Alamat situs saat ini, misalnya "http://localhost:3000" atau "https://techtalk.vercel.app" */
async function alamatSitus(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protokol = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protokol}://${host}`;
}

export async function mulaiPembayaran(kode: string): Promise<HasilPembayaran> {
  const pesanan = await ambilPesanan(kode);
  if (!pesanan) return { error: "Pesanan tidak ditemukan." };

  if (statusSaatIni(pesanan) !== "pending") {
    return { error: "Pesanan ini sudah tidak bisa dibayar." };
  }

  // Pakai ulang token lama: Midtrans menolak order_id yang sama dipakai dua kali
  if (pesanan.snap_token) return { token: pesanan.snap_token };

  const token = await buatTokenSnap(pesanan, `${await alamatSitus()}/pesanan/${pesanan.kode}`);
  if (!token) return { error: "Pembayaran sedang tidak bisa dibuka. Coba lagi beberapa saat lagi." };

  await simpanTokenSnap(pesanan.kode, token);
  return { token };
}