import { tiket } from "@/data/event";
import type { JenisTiket } from "@/lib/types";

export type TiketDenganStatus = JenisTiket & {
  tersedia: boolean;
};

/**
 * Daftar tiket beserta status saat ini.
 * Tiket yang punya `berlakuSampai` (Early Bird) tidak tersedia lagi setelah waktunya lewat.
 */
export function daftarTiket(sekarang = Date.now()): TiketDenganStatus[] {
  return tiket.map((t) => ({
    ...t,
    tersedia: !t.berlakuSampai || sekarang <= new Date(t.berlakuSampai).getTime(),
  }));
}

export function hargaTermurah(daftar: TiketDenganStatus[]): number {
  return Math.min(...daftar.filter((t) => t.tersedia).map((t) => t.harga));
}