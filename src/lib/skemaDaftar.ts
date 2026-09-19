import { z } from "zod";
import type { IdTiket } from "@/lib/types";

// Dipakai di browser (validasi cepat) DAN di server (validasi yang dipercaya).

const ID_TIKET = ["early-bird", "student", "regular"] as const satisfies readonly IdTiket[];

/** "0812-3456 7890" / "+62 812 3456 7890" / "812..." → "6281234567890" */
export function rapikanNomorWa(nilai: string): string {
  const angka = nilai.replace(/\D/g, "");
  if (angka.startsWith("0")) return `62${angka.slice(1)}`;
  if (angka.startsWith("8")) return `62${angka}`;
  return angka;
}

export const skemaDaftar = z.object({
  nama: z
    .string()
    .trim()
    .min(3, { error: "Nama lengkap minimal 3 huruf." })
    .max(100, { error: "Nama terlalu panjang (maksimal 100 karakter)." }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Format email belum benar. Contoh: nama@email.com" })),
  whatsapp: z
    .string()
    .transform(rapikanNomorWa)
    .pipe(z.string().regex(/^628\d{7,11}$/, { error: "Nomor WhatsApp belum benar. Contoh: 0812 3456 7890" })),
  instansi: z
    .string()
    .trim()
    .min(2, { error: "Isi nama kampus, sekolah, atau instansi." })
    .max(120, { error: "Nama instansi terlalu panjang (maksimal 120 karakter)." }),
  tiket: z.enum(ID_TIKET, { error: "Pilih salah satu jenis tiket." }),
});

export type DataDaftar = z.infer<typeof skemaDaftar>;
export type KolomDaftar = keyof DataDaftar;
export type ErrorKolom = Partial<Record<KolomDaftar, string>>;

/** Ambil pesan error pertama untuk setiap kolom */
export function errorPerKolom(error: z.ZodError<DataDaftar>): ErrorKolom {
  const { fieldErrors } = z.flattenError(error);
  const hasil: ErrorKolom = {};
  for (const [kolom, pesan] of Object.entries(fieldErrors) as [KolomDaftar, string[] | undefined][]) {
    if (pesan?.[0]) hasil[kolom] = pesan[0];
  }
  return hasil;
}
