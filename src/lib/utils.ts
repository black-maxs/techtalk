const ZONA_WIB = "Asia/Jakarta";

export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

/** "2026-10-25T09:00:00+07:00" → "Minggu, 25 Oktober 2026" */
export function formatTanggal(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONA_WIB,
  }).format(new Date(iso));
}

/** "2026-10-25T09:00:00+07:00" → "25.10.2026" */
export function formatTanggalPendek(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: ZONA_WIB,
  })
    .format(new Date(iso))
    .replaceAll("/", ".");
}

/** "2026-10-25T09:00:00+07:00" → "09.00" */
export function formatJam(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: ZONA_WIB,
  }).format(new Date(iso));
}