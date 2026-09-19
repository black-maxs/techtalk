import { tiket } from "@/data/event";
import type { JenisTiket } from "@/lib/types";

export type AlasanTidakTersedia = "berakhir" | "habis";

export type TiketDenganStatus = JenisTiket & {
  tersedia: boolean;
  alasan: AlasanTidakTersedia | null;
};

type Opsi = {
  /** Waktu acuan (ms). Bisa diisi tanggal lain untuk menguji. */
  sekarang?: number;
  /** true jika semua kursi sudah terisi */
  penuh?: boolean;
};

/**
 * Daftar tiket beserta status saat ini.
 * - Kuota penuh → semua tiket "habis".
 * - Tiket yang punya `berlakuSampai` (Early Bird) "berakhir" setelah waktunya lewat.
 * Dipakai di tampilan DAN di server saat membuat pesanan, jadi aturannya cukup ditulis sekali.
 */
export function daftarTiket({ sekarang = Date.now(), penuh = false }: Opsi = {}): TiketDenganStatus[] {
  return tiket.map((t) => {
    const alasan: AlasanTidakTersedia | null = penuh
      ? "habis"
      : t.berlakuSampai && sekarang > new Date(t.berlakuSampai).getTime()
        ? "berakhir"
        : null;
    return { ...t, tersedia: alasan === null, alasan };
  });
}

/** Harga tiket termurah yang masih bisa dibeli. null jika tidak ada yang tersedia. */
export function hargaTermurah(daftar: TiketDenganStatus[]): number | null {
  const tersedia = daftar.filter((t) => t.tersedia);
  return tersedia.length > 0 ? Math.min(...tersedia.map((t) => t.harga)) : null;
}
