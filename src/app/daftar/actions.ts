"use server";

import { redirect } from "next/navigation";
import { event } from "@/data/event";
import { buatPesanan, hitungKursiTerisi } from "@/lib/pesanan";
import { errorPerKolom, skemaDaftar, type ErrorKolom, type KolomDaftar } from "@/lib/skemaDaftar";
import { daftarTiket } from "@/lib/tiket";

const KOLOM: KolomDaftar[] = ["nama", "email", "whatsapp", "instansi", "tiket"];

export type StateDaftar = {
  /** Pesan umum di atas tombol kirim (misalnya database bermasalah) */
  pesan?: string;
  /** Pesan error per kolom */
  errors?: ErrorKolom;
  /** Isian terakhir, supaya form tidak kosong lagi setelah error */
  nilai?: Partial<Record<KolomDaftar, string>>;
};

const PESAN_GANGGUAN = "Pendaftaran sedang tidak bisa diproses. Coba lagi beberapa saat lagi, atau hubungi panitia.";

export async function daftar(_state: StateDaftar, formData: FormData): Promise<StateDaftar> {
  const nilai = Object.fromEntries(KOLOM.map((k) => [k, String(formData.get(k) ?? "")])) as Record<KolomDaftar, string>;

  // Honeypot: kolom tersembunyi yang tidak terlihat manusia. Kalau terisi, hampir pasti bot.
  if (String(formData.get("situs") ?? "") !== "") {
    return { pesan: PESAN_GANGGUAN, nilai };
  }

  // 1. Validasi ulang di server. Validasi di browser bisa dilewati, yang ini tidak.
  const hasil = skemaDaftar.safeParse(nilai);
  if (!hasil.success) {
    return { errors: errorPerKolom(hasil.error), nilai };
  }

  // 2. Cek tiket yang dipilih masih tersedia, dan ambil HARGANYA DARI SERVER
  const terisi = await hitungKursiTerisi();
  if (terisi === null) {
    return { pesan: PESAN_GANGGUAN, nilai };
  }
  const tiketDipilih = daftarTiket({ penuh: terisi >= event.kuota }).find((t) => t.id === hasil.data.tiket);
  if (!tiketDipilih?.tersedia) {
    const pesan =
      tiketDipilih?.alasan === "habis"
        ? "Maaf, kuota peserta sudah penuh."
        : "Tiket ini sudah tidak tersedia. Silakan pilih jenis tiket lain.";
    return { errors: { tiket: pesan }, nilai };
  }

  // 3. Simpan pesanan berstatus "pending" (kuota dicek ulang di database secara atomik)
  const pesanan = await buatPesanan({ ...hasil.data, harga: tiketDipilih.harga });
  if (!pesanan.ok) {
    if (pesanan.alasan === "kuota-penuh") {
      return { errors: { tiket: "Maaf, kuota peserta baru saja penuh." }, nilai };
    }
    return { pesan: PESAN_GANGGUAN, nilai };
  }

  // 4. Lanjut ke halaman pesanan (pembayaran ditambahkan di Tahap 6).
  // redirect() melempar "error" khusus, jadi harus dipanggil di luar try/catch.
  redirect(`/pesanan/${pesanan.pesanan.kode}`);
}
