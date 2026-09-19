import { CalendarDays, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Countdown from "@/components/ui/Countdown";
import KuotaKursi from "@/components/ui/KuotaKursi";
import Reveal from "@/components/ui/Reveal";
import Tombol from "@/components/ui/Tombol";
import { event } from "@/data/event";
import { formatJam, formatTanggal, formatTanggalPendek } from "@/lib/utils";

type Props = {
  kursiTerisi: number | null;
};

export default function Hero({ kursiTerisi }: Props) {
  const [temaAwal, temaAkhir] = event.tema.split(" & ");

  return (
    <section id="hero" className="pt-32 pb-20 lg:pt-44 lg:pb-28">
      <Container className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-18">
        <Reveal className="flex flex-col gap-7 lg:gap-8">
          <p className="flex items-center gap-3 font-mono text-xs tracking-wider text-aksen sm:text-sm">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-aksen shadow-[0_0_12px_var(--color-aksen)]"
            />
            SEMINAR TEKNOLOGI · {formatTanggalPendek(event.mulai)} ·{" "}
            {event.venue.kota.toUpperCase()}
          </p>
          <h1 className="text-5xl leading-[0.98] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-[5.75rem]">
            {temaAwal} <span className="text-redup">{"&"}</span> {temaAkhir}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-redup">
            {event.ringkasan}
          </p>
          <div className="flex flex-wrap gap-3.5 pt-2">
            <Tombol href="#tiket" ukuran="besar" panah>
              Amankan Kursimu
            </Tombol>
            <Tombol href="#rundown" ukuran="besar" varian="garis">
              Lihat Rundown
            </Tombol>
          </div>
        </Reveal>

        <Reveal
          delay={0.15}
          className="flex flex-col gap-7 rounded-xl border border-garis-kuat bg-panel/85 p-6 sm:p-8"
        >
          <div className="flex justify-between font-mono text-xs tracking-wider text-redup">
            <span>{"// COUNTDOWN"}</span>
            <span>WIB</span>
          </div>
          <Countdown target={event.mulai} />
          <KuotaKursi terisi={kursiTerisi} kuota={event.kuota} />
          <div className="flex flex-col gap-3 border-t border-garis pt-5 text-[15px]">
            <p className="flex items-center gap-3">
              <CalendarDays
                aria-hidden
                strokeWidth={1.8}
                className="size-4.5 shrink-0 text-aksen"
              />
              {formatTanggal(event.mulai)} · {formatJam(event.mulai)}–
              {formatJam(event.selesai)}
            </p>
            <p className="flex items-center gap-3">
              <MapPin
                aria-hidden
                strokeWidth={1.8}
                className="size-4.5 shrink-0 text-aksen"
              />
              {event.venue.nama}, {event.venue.kota}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
