export type IdTiket = "early-bird" | "student" | "regular";

export type JenisTiket = {
  id: IdTiket;
  nama: string;
  harga: number;
  deskripsi: string;
  fitur: string[];
  /** Batas akhir pembelian (ISO, WIB). Kosong = berlaku sampai tiket habis. */
  berlakuSampai?: string;
  /** Catatan syarat, misalnya wajib membawa kartu pelajar. */
  syarat?: string;
  unggulan?: boolean;
};

export type Speaker = {
  id: string;
  nama: string;
  jabatan: string;
  perusahaan: string;
  topik: string;
  bio: string;
  /** Path di folder public, misalnya "/speakers/raka.jpg". Kosong = tampil placeholder inisial. */
  foto?: string;
  linkedin?: string;
};

export type JenisSesi =
  | "registrasi"
  | "pembukaan"
  | "sesi"
  | "istirahat"
  | "diskusi"
  | "networking"
  | "penutupan";

export type SesiRundown = {
  mulai: string; // "09:00"
  selesai: string; // "09:30"
  judul: string;
  jenis: JenisSesi;
  deskripsi?: string;
  speakerId?: string;
};

export type Faq = {
  pertanyaan: string;
  jawaban: string;
};

export type Sorotan = {
  ikon: "seminar" | "tanya-jawab" | "networking";
  judul: string;
  deskripsi: string;
};

export type StatusPesanan = "pending" | "paid" | "expired" | "failed";

/** Satu baris tabel `pesanan` di Supabase. Nama kolom mengikuti database (snake_case). */
export type Pesanan = {
  id: string;
  kode: string;
  nama: string;
  email: string;
  whatsapp: string;
  instansi: string;
  jenis_tiket: IdTiket;
  harga: number;
  status: StatusPesanan;
  dibuat_pada: string;
  kedaluwarsa_pada: string;
  dibayar_pada: string | null;
  check_in_pada: string | null;
  snap_token: string | null;
};
