import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import FormDaftar from "@/components/daftar/FormDaftar";
import HeaderSederhana from "@/components/layout/HeaderSederhana";
import Container from "@/components/ui/Container";
import { event, kontak } from "@/data/event";
import { hitungKursiTerisi } from "@/lib/pesanan";
import { daftarTiket } from "@/lib/tiket";
import { formatJam, formatTanggal } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Isi data diri untuk mendaftar TechTalk 2026 dan amankan kursimu.",
};

const langkah = [
  { judul: "Isi data diri", deskripsi: "Nama, email, WhatsApp, instansi, dan jenis tiket." },
  { judul: "Bayar online", deskripsi: "QRIS, virtual account, atau e-wallet. Batas bayar 1 jam." },
  { judul: "Terima e-tiket", deskripsi: "E-tiket ber-QR dikirim ke email setelah pembayaran terverifikasi." },
];

type Props = {
  searchParams: Promise<{ tiket?: string | string[] }>;
};

export default async function HalamanDaftar({ searchParams }: Props) {
  const { tiket } = await searchParams;
  const terisi = await hitungKursiTerisi();
  const semuaTiket = daftarTiket({ penuh: terisi !== null && terisi >= event.kuota });
  const bukaPendaftaran = semuaTiket.some((t) => t.tersedia);

  // ?tiket=student dari tombol "Pilih Student" → langsung terpilih, asal masih tersedia
  const tiketAwal = semuaTiket.find((t) => t.id === tiket && t.tersedia)?.id ?? null;

  return (
    <>
      <HeaderSederhana />
      <main className="py-14 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-sm tracking-wider text-aksen">{"// PENDAFTARAN"}</p>
              <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
                Amankan kursimu di {event.nama}
              </h1>
              <p className="max-w-xl leading-relaxed text-pretty text-redup">
                Isi data diri di bawah ini, lalu lanjutkan ke pembayaran. E-tiket ber-QR dikirim ke email setelah
                pembayaran terverifikasi.
              </p>
            </div>

            {bukaPendaftaran ? (
              <FormDaftar daftarTiket={semuaTiket} tiketAwal={tiketAwal} />
            ) : (
              <div className="flex flex-col gap-3 rounded-xl border border-garis-kuat bg-panel p-7">
                <h2 className="text-xl font-semibold">Pendaftaran ditutup</h2>
                <p className="leading-relaxed text-redup">
                  Maaf, seluruh {event.kuota} kursi sudah terisi. Kalau ada pertanyaan, hubungi panitia di{" "}
                  <a href={`mailto:${kontak.email}`} className="text-aksen underline-offset-4 hover:underline">
                    {kontak.email}
                  </a>
                  .
                </p>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-8 self-start rounded-xl border border-garis-kuat bg-panel p-7 sm:p-8 lg:sticky lg:top-8">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs tracking-wider text-redup">{"// DETAIL ACARA"}</span>
              <p className="text-lg leading-snug font-semibold text-pretty">{event.tema}</p>
              <div className="flex flex-col gap-3 text-[15px]">
                <p className="flex items-center gap-3">
                  <CalendarDays strokeWidth={1.8} className="size-4.5 shrink-0 text-aksen" />
                  {formatTanggal(event.mulai)}
                </p>
                <p className="flex items-center gap-3">
                  <Clock strokeWidth={1.8} className="size-4.5 shrink-0 text-aksen" />
                  {formatJam(event.mulai)}–{formatJam(event.selesai)} WIB
                </p>
                <p className="flex items-center gap-3">
                  <MapPin strokeWidth={1.8} className="size-4.5 shrink-0 text-aksen" />
                  {event.venue.nama}, {event.venue.kota}
                </p>
              </div>
            </div>

            <ol className="flex flex-col gap-5 border-t border-garis pt-6">
              {langkah.map((l, i) => (
                <li key={l.judul} className="flex gap-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-garis-kuat font-mono text-xs text-aksen">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{l.judul}</span>
                    <span className="text-sm leading-relaxed text-redup">{l.deskripsi}</span>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </Container>
      </main>
    </>
  );
}
