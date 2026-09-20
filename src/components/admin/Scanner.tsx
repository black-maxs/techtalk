"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import {
  CameraOff,
  CircleAlert,
  CircleCheck,
  Clock,
  LoaderCircle,
  ScanLine,
} from "lucide-react";
import { checkIn, type HasilCheckIn } from "@/app/admin/checkin/actions";

/** "2026-10-25T09:12:00Z" → "16.12" (WIB) */
function jamWib(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export default function Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const kodeTerakhir = useRef<string>("");
  const [kamera, setKamera] = useState<"memuat" | "jalan" | "gagal">("memuat");
  const [memproses, setMemproses] = useState(false);
  const [hasil, setHasil] = useState<HasilCheckIn | null>(null);
  const [manual, setManual] = useState("");

  async function proses(kode: string) {
    // Kamera membaca QR yang sama berkali-kali per detik, jadi kode yang sama diabaikan
    if (!kode || kode === kodeTerakhir.current) return;
    kodeTerakhir.current = kode;
    setMemproses(true);
    setHasil(await checkIn(kode));
    setMemproses(false);

    // Setelah 3 detik, kode yang sama boleh dipindai lagi
    setTimeout(() => {
      if (kodeTerakhir.current === kode) kodeTerakhir.current = "";
    }, 3000);
  }

  useEffect(() => {
    const pembaca = new BrowserQRCodeReader();
    let kendali: IScannerControls | undefined;
    let dibatalkan = false;

    pembaca
      .decodeFromConstraints(
        { video: { facingMode: "environment" } }, // kamera belakang
        videoRef.current ?? undefined,
        (result) => {
          if (result) void proses(result.getText());
        },
      )
      .then((c) => {
        if (dibatalkan) c.stop();
        else {
          kendali = c;
          setKamera("jalan");
        }
      })
      .catch(() => setKamera("gagal"));

    return () => {
      dibatalkan = true;
      kendali?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-garis-kuat bg-panel-2">
        <video
          ref={videoRef}
          className="size-full object-cover"
          playsInline
          muted
        />

        {kamera === "jalan" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <div className="size-56 max-w-[70%] rounded-xl border-2 border-aksen/70 shadow-[0_0_0_9999px_rgba(10,12,16,0.45)]" />
          </div>
        )}

        {kamera !== "jalan" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            {kamera === "memuat" ? (
              <>
                <LoaderCircle className="size-6 animate-spin text-aksen" />
                <span className="text-sm text-redup">Menyalakan kamera…</span>
              </>
            ) : (
              <>
                <CameraOff className="size-6 text-bahaya" />
                <span className="text-sm text-redup">
                  Kamera tidak bisa diakses. Izinkan kamera di pengaturan
                  browser, atau masukkan kode secara manual di bawah.
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void proses(manual);
          setManual("");
        }}
        className="flex gap-2"
      >
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="Atau ketik kode: TT26-XXXXX-XXXXX"
          className="h-12 flex-1 rounded-md border border-garis-kuat bg-panel-2 px-4 font-mono text-sm uppercase transition-[border-color] duration-200 focus-visible:border-aksen"
        />
        <button
          type="submit"
          disabled={memproses}
          className="rounded-md border border-garis-kuat px-5 text-sm font-medium transition-colors hover:border-teks/40 disabled:opacity-50"
        >
          Cek
        </button>
      </form>

      <div aria-live="polite" className="min-h-28">
        {memproses && (
          <p className="flex items-center gap-3 rounded-xl border border-garis-kuat bg-panel p-5">
            <LoaderCircle className="size-5 animate-spin text-aksen" />
            Memeriksa tiket…
          </p>
        )}

        {!memproses && hasil?.hasil === "berhasil" && (
          <div className="flex items-start gap-4 rounded-xl border border-aksen/40 bg-aksen/10 p-5">
            <CircleCheck className="mt-0.5 size-6 shrink-0 text-aksen" />
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">Check-in berhasil</span>
              <span>{hasil.nama}</span>
              <span className="text-sm text-redup">
                {hasil.instansi} · tiket{" "}
                <span className="capitalize">
                  {hasil.tiket.replace("-", " ")}
                </span>
              </span>
            </div>
          </div>
        )}

        {!memproses && hasil?.hasil === "sudah" && (
          <div className="flex items-start gap-4 rounded-xl border border-amber/40 bg-amber/10 p-5">
            <Clock className="mt-0.5 size-6 shrink-0 text-amber" />
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">Sudah check-in</span>
              <span>{hasil.nama}</span>
              <span className="text-sm text-redup">
                Tercatat masuk pukul {jamWib(hasil.waktu)} WIB
              </span>
            </div>
          </div>
        )}

        {!memproses && hasil?.hasil === "belum-lunas" && (
          <div className="flex items-start gap-4 rounded-xl border border-bahaya/40 bg-bahaya/10 p-5">
            <CircleAlert className="mt-0.5 size-6 shrink-0 text-bahaya" />
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">Belum lunas</span>
              <span>{hasil.nama}</span>
              <span className="text-sm text-redup">
                Status pesanan: {hasil.status}. Arahkan ke meja panitia.
              </span>
            </div>
          </div>
        )}

        {!memproses && hasil?.hasil === "tidak-ada" && (
          <p className="flex items-center gap-3 rounded-xl border border-bahaya/40 bg-bahaya/10 p-5">
            <CircleAlert className="size-6 shrink-0 text-bahaya" />
            Tiket tidak ditemukan. Pastikan QR-nya dari TechTalk 2026.
          </p>
        )}

        {!memproses && hasil?.hasil === "gagal" && (
          <p className="flex items-center gap-3 rounded-xl border border-bahaya/40 bg-bahaya/10 p-5">
            <CircleAlert className="size-6 shrink-0 text-bahaya" />
            Gagal memproses. Cek koneksi, lalu coba lagi.
          </p>
        )}

        {!memproses && !hasil && kamera === "jalan" && (
          <p className="flex items-center gap-3 rounded-xl border border-garis bg-panel p-5 text-redup">
            <ScanLine className="size-5 shrink-0 text-aksen" />
            Arahkan kamera ke QR code peserta.
          </p>
        )}
      </div>
    </div>
  );
}
