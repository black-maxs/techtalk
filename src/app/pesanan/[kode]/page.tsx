import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircleCheck, Clock } from "lucide-react";
import HeaderSederhana from "@/components/layout/HeaderSederhana";
import Container from "@/components/ui/Container";
import Tombol from "@/components/ui/Tombol";
import { event, tiket } from "@/data/event";
import { ambilPesanan } from "@/lib/pesanan";
import { formatNomorWa, labelStatus, statusSaatIni } from "@/lib/statusPesanan";
import type { StatusPesanan } from "@/lib/types";
import { formatJam, formatRupiah, formatTanggal } from "@/lib/utils";
import TombolBayar from "@/components/pesanan/TombolBayar";

export const metadata: Metadata = {
  title: "Pesanan — TechTalk 2026",
  // Halaman pribadi peserta: jangan muncul di hasil pencarian
  robots: { index: false, follow: false },
};

const judulStatus: Record<StatusPesanan, string> = {
  pending: "Selesaikan pembayaran",
  paid: "Pembayaran berhasil",
  expired: "Pesanan kedaluwarsa",
  failed: "Pembayaran gagal",
};

const gayaStatus: Record<StatusPesanan, string> = {
  pending: "border border-amber/40 text-amber",
  paid: "bg-aksen text-latar",
  expired: "border border-garis-kuat text-redup",
  failed: "border border-bahaya/40 text-bahaya",
};

type Props = {
  params: Promise<{ kode: string }>;
};

export default async function HalamanPesanan({ params }: Props) {
  const { kode } = await params;
  const pesanan = await ambilPesanan(kode);
  if (!pesanan) notFound();

  const status = statusSaatIni(pesanan);
  const namaTiket =
    tiket.find((t) => t.id === pesanan.jenis_tiket)?.nama ??
    pesanan.jenis_tiket;

  const rincian = [
    { label: "Nama", nilai: pesanan.nama },
    { label: "Email", nilai: pesanan.email },
    { label: "WhatsApp", nilai: formatNomorWa(pesanan.whatsapp) },
    { label: "Instansi", nilai: pesanan.instansi },
    { label: "Tiket", nilai: namaTiket },
  ];

  return (
    <>
      <HeaderSederhana />
      <main className="py-14 lg:py-20">
        <Container className="flex max-w-3xl flex-col gap-10">
          <div className="flex flex-col gap-4">
            <span
              className={`w-fit rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase ${gayaStatus[status]}`}
            >
              {labelStatus[status]}
            </span>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-5xl">
              {judulStatus[status]}
            </h1>
            <p className="leading-relaxed text-redup">
              Simpan link halaman ini. Kamu bisa membukanya lagi kapan saja
              untuk melihat status pesanan.
            </p>
          </div>

          <div className="flex flex-col rounded-xl border border-garis-kuat bg-panel">
            <div className="flex flex-col gap-1 border-b border-garis p-7 sm:p-8">
              <span className="font-mono text-xs tracking-wider text-redup">
                KODE PESANAN
              </span>
              <span className="font-mono text-2xl font-medium tracking-wide text-aksen sm:text-3xl">
                {pesanan.kode}
              </span>
            </div>

            <dl className="flex flex-col gap-4 border-b border-garis p-7 sm:p-8">
              {rincian.map((r) => (
                <div
                  key={r.label}
                  className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4"
                >
                  <dt className="text-sm text-redup">{r.label}</dt>
                  <dd className="wrap-break-words">{r.nilai}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center justify-between p-7 sm:p-8">
              <span className="text-redup">Total bayar</span>
              <span className="font-mono text-2xl font-medium">
                {formatRupiah(pesanan.harga)}
              </span>
            </div>
          </div>

          {status === "pending" && (
            <div className="flex flex-col gap-5 rounded-xl border border-amber/30 bg-amber/5 p-7 sm:p-8">
              <p className="flex items-start gap-3">
                <Clock
                  strokeWidth={1.8}
                  className="mt-0.5 size-5 shrink-0 text-amber"
                />
                <span>
                  Bayar sebelum{" "}
                  <strong className="font-semibold">
                    {formatJam(pesanan.kedaluwarsa_pada)} WIB,{" "}
                    {formatTanggal(pesanan.kedaluwarsa_pada)}
                  </strong>
                  . Lewat dari itu, pesanan otomatis batal dan kursimu dilepas.
                </span>
              </p>
              {/* TAHAP 6: ganti tombol ini dengan tombol yang membuka popup Midtrans Snap */}
              <TombolBayar kode={pesanan.kode} />
            </div>
          )}

          {status === "paid" && (
            <div className="flex flex-col gap-5 rounded-xl border border-aksen/30 bg-aksen/5 p-7 sm:p-8">
              <p className="flex items-start gap-3 leading-relaxed">
                <CircleCheck
                  strokeWidth={1.8}
                  className="mt-0.5 size-5 shrink-0 text-aksen"
                />
                Terima kasih! Tiketmu sudah aktif. Tunjukkan QR code saat
                check-in di lokasi acara, {formatTanggal(event.mulai)}.
              </p>
              <Tombol
                href={`/tiket/${pesanan.kode}`}
                ukuran="besar"
                panah
                className="w-full sm:w-fit"
              >
                Lihat E-Tiket
              </Tombol>
            </div>
          )}

          {(status === "expired" || status === "failed") && (
            <div className="flex flex-col gap-5 rounded-xl border border-garis-kuat bg-panel p-7 sm:p-8">
              <p className="leading-relaxed text-redup">
                Pesanan ini sudah tidak berlaku dan kursinya sudah dilepas. Kamu
                bisa mendaftar ulang selama kuota masih tersedia.
              </p>
              <Tombol
                href="/daftar"
                ukuran="besar"
                panah
                className="w-full sm:w-fit"
              >
                Daftar Ulang
              </Tombol>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
