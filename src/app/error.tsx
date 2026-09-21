"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import Container from "@/components/ui/Container";
import Tombol from "@/components/ui/Tombol";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tercatat di log server (Vercel → Logs), bukan di layar pengunjung
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center py-20">
      <Container className="flex max-w-lg flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm tracking-wider text-bahaya">
          {"// ERROR"}
        </p>
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.03em]">
          Ada yang tidak beres
        </h1>
        <p className="leading-relaxed text-redup">
          Maaf, halaman ini gagal dimuat. Coba lagi sebentar lagi, atau kembali
          ke beranda.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-redup">
            Kode error: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2.5 rounded-md bg-aksen px-7 py-4 font-semibold text-latar transition-colors hover:bg-aksen-terang"
          >
            <RotateCw className="size-4" />
            Coba lagi
          </button>
          <Tombol href="/" varian="garis" ukuran="besar">
            Kembali ke beranda
          </Tombol>
        </div>
      </Container>
    </main>
  );
}
