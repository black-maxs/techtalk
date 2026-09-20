"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { mulaiPembayaran } from "@/app/pesanan/[kode]/actions";

type HasilSnap = { transaction_status?: string };

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        opsi: {
          onSuccess?: (hasil: HasilSnap) => void;
          onPending?: (hasil: HasilSnap) => void;
          onError?: (hasil: HasilSnap) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

const PRODUKSI = process.env.NEXT_PUBLIC_MIDTRANS_PRODUKSI === "true";
const URL_SNAP = PRODUKSI
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

export default function TombolBayar({ kode }: { kode: string }) {
  const router = useRouter();
  const [siap, setSiap] = useState(false);
  const [memuat, setMemuat] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  async function bayar() {
    setMemuat(true);
    setPesan(null);

    const hasil = await mulaiPembayaran(kode);
    if ("error" in hasil) {
      setPesan(hasil.error);
      setMemuat(false);
      return;
    }

    window.snap?.pay(hasil.token, {
      // Status pembayaran TIDAK diubah di sini. Halaman hanya dimuat ulang,
      // dan status sebenarnya ditentukan webhook (Tahap 6C).
      onSuccess: () => router.refresh(),
      onPending: () => router.refresh(),
      onError: () => setPesan("Pembayaran gagal diproses. Silakan coba lagi."),
      onClose: () => setMemuat(false),
    });

    setMemuat(false);
  }

  return (
    <>
      <Script
        src={URL_SNAP}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
        onReady={() => setSiap(true)}
      />

      <button
        type="button"
        onClick={bayar}
        disabled={!siap || memuat}
        className="inline-flex h-14 items-center justify-center gap-2.5 rounded-md bg-aksen px-7 text-[17px] font-semibold text-latar transition-[background-color,opacity] duration-200 hover:bg-aksen-terang disabled:cursor-wait disabled:opacity-60"
      >
        {memuat || !siap ? (
          <>
            <LoaderCircle className="size-5 animate-spin" />
            {siap ? "Membuka pembayaran…" : "Menyiapkan…"}
          </>
        ) : (
          "Bayar Sekarang"
        )}
      </button>

      {pesan && (
        <p role="alert" className="flex gap-2.5 text-sm text-bahaya">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {pesan}
        </p>
      )}
    </>
  );
}
