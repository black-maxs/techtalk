import Link from "next/link";
import Container from "@/components/ui/Container";
import Tombol from "@/components/ui/Tombol";
import { kontak } from "@/data/event";

export default function TidakDitemukan() {
  return (
    <main className="grid min-h-dvh place-items-center py-20">
      <Container className="flex max-w-lg flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm tracking-wider text-aksen">
          {"// 404"}
        </p>
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.03em] sm:text-5xl">
          Halaman tidak ditemukan
        </h1>
        <p className="leading-relaxed text-redup">
          Link-nya mungkin salah ketik atau sudah tidak berlaku. Kalau kamu
          mencari tiket yang sudah dibeli, buka kembali link yang dikirim ke
          emailmu.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Tombol href="/" ukuran="besar" panah>
            Kembali ke beranda
          </Tombol>
          <Link
            href={`mailto:${kontak.email}`}
            className="inline-flex items-center rounded-md border border-teks/20 px-7 py-4 font-semibold transition-colors hover:border-teks/40"
          >
            Hubungi panitia
          </Link>
        </div>
      </Container>
    </main>
  );
}
