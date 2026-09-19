import { MessagesSquare, Mic, Users, type LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { event, sorotan, speakers } from "@/data/event";
import type { Sorotan } from "@/lib/types";

const ikonSorotan: Record<Sorotan["ikon"], LucideIcon> = {
  seminar: Mic,
  "tanya-jawab": MessagesSquare,
  networking: Users,
};

const durasiJam =
  (new Date(event.selesai).getTime() - new Date(event.mulai).getTime()) /
  3_600_000;

const angka = [
  { nilai: speakers.length, label: "Speaker industri" },
  { nilai: event.kuota, label: "Kursi peserta" },
  { nilai: durasiJam, label: "Jam penuh materi" },
];

export default function Tentang() {
  return (
    <section id="tentang" className="border-t border-garis py-24 lg:py-32">
      <Container className="flex flex-col gap-14 lg:gap-20">
        <Reveal>
          <SectionHeading
            nomor="01"
            label="Tentang"
            judul="Apa itu TechTalk?"
          />
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal className="flex flex-col gap-10">
            <p className="text-2xl leading-snug font-medium tracking-[-0.01em] text-pretty sm:text-3xl">
              {event.deskripsi}
            </p>
            <dl className="grid grid-cols-3 gap-4 border-t border-garis pt-8">
              {angka.map((a) => (
                <div key={a.label} className="flex flex-col-reverse gap-1">
                  <dt className="text-sm text-redup">{a.label}</dt>
                  <dd className="font-mono text-4xl font-medium sm:text-5xl">
                    {a.nilai}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="flex flex-col">
            {sorotan.map((s, i) => {
              const Ikon = ikonSorotan[s.ikon];
              return (
                <Reveal
                  key={s.judul}
                  delay={i * 0.1}
                  className="flex gap-5 border-b border-garis py-7 first:pt-0 last:border-b-0"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-garis-kuat bg-panel text-aksen">
                    <Ikon aria-hidden strokeWidth={1.8} className="size-5" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">{s.judul}</h3>
                    <p className="leading-relaxed text-redup">{s.deskripsi}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
