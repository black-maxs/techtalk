import { daftarPeserta } from "@/lib/admin";
import { adminSaatIni } from "@/lib/supabaseAuth";

/** Bungkus satu kolom CSV dengan aman */
function kolom(nilai: string): string {
  // Nilai yang diawali = + - @ bisa dijalankan Excel sebagai rumus (CSV injection),
  // jadi diberi awalan kutip satu supaya diperlakukan sebagai teks biasa.
  const teks = /^[=+\-@]/.test(nilai) ? `'${nilai}` : nilai;
  return `"${teks.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await adminSaatIni()))
    return new Response("Tidak diizinkan", { status: 401 });

  const peserta = await daftarPeserta({});
  const judul = [
    "Kode",
    "Nama",
    "Email",
    "WhatsApp",
    "Instansi",
    "Tiket",
    "Harga",
    "Status",
    "Didaftarkan",
    "Dibayar",
    "Check-in",
  ];

  const baris = peserta.map((p) =>
    [
      p.kode,
      p.nama,
      p.email,
      p.whatsapp,
      p.instansi,
      p.jenis_tiket,
      String(p.harga),
      p.status,
      p.dibuat_pada,
      p.dibayar_pada ?? "",
      p.check_in_pada ?? "",
    ]
      .map(kolom)
      .join(","),
  );

  // \uFEFF (BOM) membuat Excel membaca huruf beraksen dengan benar
  const csv = "\uFEFF" + [judul.map(kolom).join(","), ...baris].join("\r\n");
  const tanggal = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="peserta-techtalk-${tanggal}.csv"`,
    },
  });
}
