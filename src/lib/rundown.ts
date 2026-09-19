import { event } from "@/data/event";

// "2026-10-25T09:00:00+07:00" → "2026-10-25"
const tanggalAcara = event.mulai.slice(0, 10);

/** "09:15" → timestamp (ms) pukul 09.15 WIB pada hari acara */
export function waktuSesi(jam: string): number {
  return new Date(`${tanggalAcara}T${jam}:00+07:00`).getTime();
}

export type StatusSesi = "akan" | "berlangsung" | "selesai";

export function statusSesi(mulai: string, selesai: string, sekarang: number): StatusSesi {
  if (sekarang < waktuSesi(mulai)) return "akan";
  if (sekarang < waktuSesi(selesai)) return "berlangsung";
  return "selesai";
}
