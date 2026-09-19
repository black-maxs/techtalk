import Link from "next/link";
import { Plus } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { faq } from "@/data/event";

export default function Faq() {
  return (
    <section id="faq" className="border-t border-garis py-24 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
        <Reveal className="flex flex-col gap-8">
          <SectionHeading nomor="05" label="FAQ" judul="Pertanyaan yang sering ditanyakan" />
          <p className="text-redup">
            Belum menemukan jawabannya?{" "}
            <Link href="#kontak" className="text-aksen underline-offset-4 hover:underline">
              Hubungi panitia
            </Link>
            .
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col border-t border-garis">
            {faq.map((item) => (
              <details key={item.pertanyaan} className="group border-b border-garis">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium transition-colors hover:text-aksen-terang [&::-webkit-details-marker]:hidden">
                  {item.pertanyaan}
                  <Plus className="size-5 shrink-0 text-aksen transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="max-w-2xl pb-6 leading-relaxed text-redup">{item.jawaban}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}