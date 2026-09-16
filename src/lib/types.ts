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
  foto: string;
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
