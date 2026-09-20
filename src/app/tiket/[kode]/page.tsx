import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CalendarPlus, Clock, Info, MapPin, Ticket } from "lucide-react";
import HeaderSederhana from "@/components/layout/HeaderSederhana";
import KodeQr from "@/components/tiket/KodeQr";
import Container from "@/components/ui/Container";
import { event, tiket } from "@/data/event";
import { linkGoogleCalendar } from "@/lib/kalender";
import { ambilPesanan } from "@/lib/pesanan";
import { statusSaatIni } from "@/lib/statusPesanan";
import { formatJam, formatTanggal } from "@/lib/utils";

export const metadata: Metadata = {
  title: "E-Tiket — TechTalk 2026",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ kode: string }>;
};

export default async function HalamanTiket({ params }: Props) {
  const { kode } = await params;
  const pesanan = await ambilPesanan(kode);
  if (!pesanan) notFound();

  // E-tiket hanya untuk pesanan yang sudah lunas
  if (statusSaatIni(pesanan) !== "paid") redirect(`/pesanan/${pesanan.kode}`);

  const jenisTiket = tiket.find((t) => t.id === pesanan.jenis_tiket);

  return (
    <>
      <HeaderSederhana />
      <main className="py-14 lg:py-20">
        <Container className="flex max-w-2xl flex-col gap-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="font-mono text-sm tracking-wider text-aksen">
              {"// E-TIKET"}
            </p>
            <h1 className="text-3xl leading-tight font-semibold tracking-[-0.03em] sm:text-4xl">
              Sampai jumpa, {pesanan.nama.split(" ")[0]}!
            </h1>
            <p className="leading-relaxed text-redup">
              Tunjukkan QR code ini kepada panitia saat check-in di lokasi
              acara.
            </p>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-garis-kuat bg-panel">
            {/* Bagian QR: sengaja putih supaya mudah dipindai kamera */}
            <div className="flex flex-col items-center gap-5 bg-white p-8 sm:p-10">
              <KodeQr nilai={pesanan.kode} className="w-full max-w-56" />
              <span className="font-mono text-lg font-medium tracking-wide text-latar">
                {pesanan.kode}
              </span>
            </div>

            {/* Garis sobekan tiket */}
            <div className="flex items-center">
              <span className="size-5 shrink-0 -translate-x-1/2 rounded-full bg-latar" />
              <span className="h-px flex-1 border-t border-dashed border-garis-kuat" />
              <span className="size-5 shrink-0 translate-x-1/2 rounded-full bg-latar" />
            </div>

            <div className="flex flex-col gap-5 p-7 sm:p-9">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-redup">Peserta</span>
                <span className="text-xl font-semibold">{pesanan.nama}</span>
                <span className="text-[15px] text-redup">
                  {pesanan.instansi}
                </span>
              </div>

              <div className="flex flex-col gap-3 border-t border-garis pt-5 text-[15px]">
                <p className="flex items-center gap-3">
                  <Ticket
                    strokeWidth={1.8}
                    className="size-4.5 shrink-0 text-aksen"
                  />
                  Tiket {jenisTiket?.nama ?? pesanan.jenis_tiket}
                </p>
                <p className="flex items-center gap-3">
                  <Clock
                    strokeWidth={1.8}
                    className="size-4.5 shrink-0 text-aksen"
                  />
                  {formatTanggal(event.mulai)} · {formatJam(event.mulai)}–
                  {formatJam(event.selesai)} WIB
                </p>
                <p className="flex items-start gap-3">
                  <MapPin
                    strokeWidth={1.8}
                    className="mt-0.5 size-4.5 shrink-0 text-aksen"
                  />
                  <span>
                    {event.venue.nama}
                    <br />
                    <span className="text-redup">{event.venue.alamat}</span>
                  </span>
                </p>
              </div>

              {jenisTiket?.syarat && (
                <p className="flex gap-2.5 rounded-lg bg-panel-2 p-3.5 text-sm leading-relaxed text-redup">
                  <Info
                    strokeWidth={1.8}
                    className="mt-0.5 size-4 shrink-0 text-amber"
                  />
                  {jenisTiket.syarat}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={linkGoogleCalendar()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-md bg-aksen px-6 py-4 font-semibold text-latar transition-colors hover:bg-aksen-terang"
            >
              <CalendarPlus strokeWidth={2} className="size-5" />
              Tambahkan ke Google Calendar
            </a>
            <a
              href={event.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-md border border-teks/20 px-6 py-4 font-semibold transition-colors hover:border-teks/40"
            >
              <MapPin strokeWidth={2} className="size-5" />
              Lihat Lokasi
            </a>
          </div>

          <p className="text-center text-sm leading-relaxed text-redup">
            Simpan link halaman ini atau screenshot QR-nya. Datang 30 menit
            lebih awal supaya check-in lebih santai.
          </p>
        </Container>
      </main>
    </>
  );
}
