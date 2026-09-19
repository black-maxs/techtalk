import type { Pesanan, StatusPesanan } from "@/lib/types";

export const labelStatus: Record<StatusPesanan, string> = {
  pending: "Menunggu pembayaran",
  paid: "Lunas",
  expired: "Kedaluwarsa",
  failed: "Gagal",
};

/**
 * Status pesanan yang ditampilkan saat ini.
 * Pesanan "pending" yang sudah melewati batas bayar dianggap "expired",
 * walaupun kolom status di database belum sempat diperbarui.
 */
export function statusSaatIni(
  pesanan: Pick<Pesanan, "status" | "kedaluwarsa_pada">,
  sekarang = Date.now(),
): StatusPesanan {
  if (pesanan.status === "pending" && new Date(pesanan.kedaluwarsa_pada).getTime() <= sekarang) {
    return "expired";
  }
  return pesanan.status;
}

/** "6281234567890" → "+62 812-3456-7890" */
export function formatNomorWa(nomor: string): string {
  const lokal = nomor.slice(2);
  return `+62 ${lokal.slice(0, 3)}-${lokal.slice(3, 7)}-${lokal.slice(7)}`;
}
