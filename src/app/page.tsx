import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Tombol from "@/components/ui/Tombol";
import { tiket } from "@/data/event";
import { formatRupiah } from "@/lib/utils";

const swatch = [
  { nama: "latar", kelas: "bg-latar" },
  { nama: "panel", kelas: "bg-panel" },
  { nama: "panel-2", kelas: "bg-panel-2" },
  { nama: "trek", kelas: "bg-trek" },
  { nama: "redup", kelas: "bg-redup" },
  { nama: "teks", kelas: "bg-teks" },
  { nama: "aksen", kelas: "bg-aksen" },
  { nama: "amber", kelas: "bg-amber" },
];

export default function Home() {
  return (
    <main className="py-24">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          nomor="00"
          label="Uji gaya"
          judul="The Future of Technology"
          deskripsi="Halaman sementara untuk memastikan font, warna, dan komponen dasar sudah terpasang."
        />

        <div className="flex flex-wrap gap-3">
          <Tombol href="#" ukuran="besar" panah>
            Amankan Kursimu
          </Tombol>
          <Tombol href="#" varian="garis" ukuran="besar">
            Lihat Rundown
          </Tombol>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {swatch.map((w) => (
            <div key={w.nama} className="flex flex-col gap-2">
              <div
                className={`h-16 rounded-md border border-garis-kuat ${w.kelas}`}
              />
              <span className="font-mono text-xs text-redup">{w.nama}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiket.map((t) => (
            <div
              key={t.id}
              className={`flex flex-col gap-4 rounded-xl border p-8 ${
                t.unggulan
                  ? "border-aksen bg-panel shadow-sorot"
                  : "border-garis-kuat bg-panel"
              }`}
            >
              <span className="text-xl font-semibold">{t.nama}</span>
              <span className="font-mono text-4xl font-medium tracking-tight">
                {formatRupiah(t.harga)}
              </span>
              <span className="text-redup">{t.deskripsi}</span>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
