import type {
  Faq,
  JenisTiket,
  SesiRundown,
  Sorotan,
  Speaker,
} from "@/lib/types";

export const event = {
  nama: "TechTalk",
  tahun: 2026,
  tema: "The Future of Technology & Digital Innovation",
  deskripsi:
    "TechTalk adalah seminar teknologi yang mempertemukan peserta dengan praktisi industri. Lewat sesi sharing, diskusi, dan networking, kita bahas arah perkembangan teknologi dan pengalaman nyata di dunia kerja.",
  ringkasan:
    "Satu hari bersama tiga praktisi industri. Sharing, diskusi, dan networking tentang arah teknologi dan karier di dalamnya.",
  // Waktu selalu ditulis lengkap dengan zona WIB (+07:00)
  mulai: "2026-10-25T09:00:00+07:00",
  selesai: "2026-10-25T15:00:00+07:00",
  venue: {
    nama: "Auditorium Nusantara Tech Hub", // DUMMY
    alamat: "Jl. Contoh Raya No. 123, Jakarta Selatan", // DUMMY
    kota: "Jakarta", // DUMMY
    mapsUrl: "https://maps.google.com", // DUMMY
  },
  kuota: 200,
  format: ["Seminar", "Q&A", "Networking"],
  url: "http://localhost:3000", // ganti dengan domain produksi saat deploy
} as const;

export const navigasi = [
  { label: "Tentang", href: "#tentang" },
  { label: "Speaker", href: "#speaker" },
  { label: "Rundown", href: "#rundown" },
  { label: "Tiket", href: "#tiket" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#kontak" },
];

export const sorotan: Sorotan[] = [
  {
    ikon: "seminar",
    judul: "Seminar",
    deskripsi:
      "Tiga sesi dari praktisi yang membagikan pengalaman nyata membangun produk dan karier di industri teknologi.",
  },
  {
    ikon: "tanya-jawab",
    judul: "Q&A & Panel Diskusi",
    deskripsi:
      "Tanyakan langsung hal yang selama ini bikin penasaran, dari tren AI sampai cara masuk ke industri.",
  },
  {
    ikon: "networking",
    judul: "Networking",
    deskripsi:
      "Kenalan dengan sesama peserta dan pembicara. Siapa tahu jadi awal kolaborasi atau peluang kerja.",
  },
];

export const tiket: JenisTiket[] = [
  {
    id: "early-bird",
    nama: "Early Bird",
    harga: 35000,
    deskripsi: "Harga spesial untuk pendaftar paling awal.",
    fitur: ["Akses seluruh sesi", "E-certificate", "Snack & makan siang"],
    berlakuSampai: "2026-10-05T23:59:59+07:00",
  },
  {
    id: "student",
    nama: "Student",
    harga: 40000,
    deskripsi: "Khusus pelajar dan mahasiswa aktif.",
    fitur: ["Akses seluruh sesi", "E-certificate", "Snack & makan siang"],
    syarat: "Wajib menunjukkan kartu pelajar/mahasiswa saat check-in.",
    unggulan: true,
  },
  {
    id: "regular",
    nama: "Regular",
    harga: 50000,
    deskripsi: "Untuk umum, fresh graduate, dan profesional.",
    fitur: ["Akses seluruh sesi", "E-certificate", "Snack & makan siang"],
  },
];

// DUMMY: nama, profil, dan foto akan diganti dengan data asli dari client
export const speakers: Speaker[] = [
  {
    id: "raka",
    nama: "Raka Pradipta",
    jabatan: "Head of Engineering",
    perusahaan: "Nusa Cloud",
    topik: "AI di Dunia Kerja: Ancaman atau Peluang?",
    bio: "Lebih dari 10 tahun membangun sistem berskala besar dan kini memimpin tim engineering yang menerapkan AI pada produk sehari-hari.",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=800&h=1000&q=80",
  },
  {
    id: "salsa",
    nama: "Salsabila Putri",
    jabatan: "Senior Product Designer",
    perusahaan: "Karsa Digital",
    topik: "Merancang Produk Digital yang Manusiawi",
    bio: "Merancang pengalaman pengguna untuk aplikasi fintech dan edutech yang dipakai jutaan orang di Indonesia.",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&w=800&h=1000&q=80",
  },
  {
    id: "dimas",
    nama: "Dimas Aryaguna",
    jabatan: "Founder & CEO",
    perusahaan: "Lumbung Data",
    topik: "Dari Kampus ke Startup: Membangun Karier di Industri Teknologi",
    bio: "Memulai startup sejak kuliah dan kini aktif membimbing talenta muda agar siap masuk ke industri teknologi.",
    foto: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&crop=faces&w=800&h=1000&q=80",
  },
];

export const rundown: SesiRundown[] = [
  {
    mulai: "08:00",
    selesai: "09:00",
    judul: "Registrasi & Check-in",
    jenis: "registrasi",
  },
  { mulai: "09:00", selesai: "09:15", judul: "Pembukaan", jenis: "pembukaan" },
  {
    mulai: "09:15",
    selesai: "10:15",
    judul: speakers[0].topik,
    jenis: "sesi",
    speakerId: "raka",
  },
  {
    mulai: "10:15",
    selesai: "11:15",
    judul: speakers[1].topik,
    jenis: "sesi",
    speakerId: "salsa",
  },
  { mulai: "11:15", selesai: "12:30", judul: "Ishoma", jenis: "istirahat" },
  {
    mulai: "12:30",
    selesai: "13:30",
    judul: speakers[2].topik,
    jenis: "sesi",
    speakerId: "dimas",
  },
  {
    mulai: "13:30",
    selesai: "14:15",
    judul: "Panel Diskusi & Q&A",
    jenis: "diskusi",
    deskripsi: "Bersama ketiga pembicara",
  },
  {
    mulai: "14:15",
    selesai: "14:50",
    judul: "Networking Session",
    jenis: "networking",
  },
  {
    mulai: "14:50",
    selesai: "15:00",
    judul: "Penutupan & Foto Bersama",
    jenis: "penutupan",
  },
];

export const faq: Faq[] = [
  {
    pertanyaan: "Siapa saja yang boleh ikut TechTalk?",
    jawaban:
      "Terbuka untuk umum, terutama pelajar, mahasiswa, fresh graduate, dan siapa pun yang tertarik dengan dunia teknologi.",
  },
  {
    pertanyaan: "Bagaimana cara mendapatkan tiket?",
    jawaban:
      "Pilih jenis tiket, isi data diri, lalu selesaikan pembayaran online. E-tiket ber-QR code akan dikirim ke email kamu.",
  },
  {
    pertanyaan: "Metode pembayaran apa saja yang tersedia?",
    jawaban:
      "QRIS, transfer virtual account, dan e-wallet seperti GoPay dan ShopeePay.",
  },
  {
    pertanyaan: "Apakah tiket bisa di-refund?",
    jawaban:
      "Tiket yang sudah dibayar tidak dapat di-refund, tetapi dapat dialihkan ke orang lain dengan menghubungi panitia.",
  },
  {
    pertanyaan: "Apakah peserta mendapatkan sertifikat?",
    jawaban: "Ya, seluruh peserta yang hadir akan mendapatkan e-certificate.",
  },
  {
    pertanyaan: "Apa yang perlu dibawa saat hari acara?",
    jawaban:
      "Bawa e-tiket (QR code) di HP. Pemegang tiket Student juga wajib membawa kartu pelajar/mahasiswa.",
  },
];

// DUMMY
export const kontak = {
  email: "halo@techtalk.id",
  whatsapp: "6281234567890", // format internasional tanpa +
  instagram: "techtalk.id",
};
