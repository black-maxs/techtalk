import Container from "@/components/ui/Container";
import FotoSpeaker from "@/components/ui/FotoSpeaker";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { speakers } from "@/data/event";

export default function Speaker() {
  return (
    <section id="speaker" className="border-t border-garis py-24 lg:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            nomor="02"
            label="Speaker"
            judul="Belajar langsung dari praktisi"
            deskripsi="Tiga pembicara dari industri teknologi yang akan berbagi pengalaman dan pandangan mereka."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {speakers.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i * 0.1}
              className="group flex flex-col overflow-hidden rounded-xl border border-garis-kuat bg-panel transition-[border-color] duration-300 hover:border-aksen/50"
            >
              <FotoSpeaker nama={s.nama} foto={s.foto} />
              <div className="flex flex-1 flex-col gap-5 p-6 sm:p-7">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-semibold tracking-[-0.02em]">
                    {s.nama}
                  </h3>
                  <p className="text-redup">
                    {s.jabatan} · {s.perusahaan}
                  </p>
                </div>
                <div className="flex flex-col gap-2 border-t border-garis pt-5">
                  <span className="font-mono text-xs tracking-wider text-aksen">
                    {"// TOPIK"}
                  </span>
                  <p className="text-lg leading-snug font-medium text-pretty">
                    {s.topik}
                  </p>
                </div>
                <p className="text-[15px] leading-relaxed text-redup">
                  {s.bio}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
