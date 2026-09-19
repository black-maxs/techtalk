import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import { IkonInstagram } from "@/components/ui/IkonSosial";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { event, kontak } from "@/data/event";
import { waLink } from "@/lib/utils";

const saluran = [
  { label: "Email", nilai: kontak.email, href: `mailto:${kontak.email}`, Ikon: Mail },
  {
    label: "WhatsApp",
    nilai: kontak.whatsappTampil,
    href: waLink(kontak.whatsapp, kontak.pesanWhatsApp),
    Ikon: MessageCircle,
  },
  {
    label: "Instagram",
    nilai: `@${kontak.instagram}`,
    href: `https://instagram.com/${kontak.instagram}`,
    Ikon: IkonInstagram,
  },
];

export default function Kontak() {
  return (
    <section id="kontak" className="border-t border-garis py-24 lg:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            nomor="06"
            label="Kontak"
            judul="Sampai jumpa di lokasi"
            deskripsi="Ada pertanyaan soal tiket, pembayaran, atau acara? Hubungi panitia lewat salah satu saluran berikut."
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="flex h-full flex-col gap-6 rounded-xl border border-garis-kuat bg-panel p-7 sm:p-9">
              <span className="font-mono text-xs tracking-wider text-aksen">{"// LOKASI"}</span>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold tracking-[-0.02em]">{event.venue.nama}</h3>
                <p className="leading-relaxed text-redup">{event.venue.alamat}</p>
              </div>
              <a
                href={event.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex w-fit items-center gap-2 font-semibold text-aksen transition-colors hover:text-aksen-terang"
              >
                Buka di Google Maps
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            <ul className="flex h-full flex-col divide-y divide-garis rounded-xl border border-garis-kuat bg-panel">
              {saluran.map(({ label, nilai, href, Ikon }) => (
                <li key={label} className="flex-1">
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group flex h-full items-center gap-5 p-6 transition-colors hover:bg-teks/3 sm:px-8"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-garis-kuat text-aksen">
                      <Ikon className="size-5" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm text-redup">{label}</span>
                      <span className="truncate text-lg font-medium">{nilai}</span>
                    </span>
                    <ArrowUpRight className="ml-auto size-4 shrink-0 text-redup transition-colors group-hover:text-aksen" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}