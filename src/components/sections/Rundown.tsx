import BarisSesi from "@/components/ui/BarisSesi";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { event, rundown, speakers } from "@/data/event";
import type { JenisSesi } from "@/lib/types";
import { formatTanggal } from "@/lib/utils";

const labelJenis: Record<JenisSesi, string> = {
  registrasi: "Registrasi",
  pembukaan: "Pembukaan",
  sesi: "Sesi",
  istirahat: "Istirahat",
  diskusi: "Diskusi",
  networking: "Networking",
  penutupan: "Penutupan",
};

const jenisUtama: JenisSesi[] = ["sesi", "diskusi"];

/** "09:15" → "09.15" (format jam Indonesia) */
const jam = (waktu: string) => waktu.replace(":", ".");

export default function Rundown() {
  return (
    <section id="rundown" className="border-t border-garis py-24 lg:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            nomor="03"
            label="Rundown"
            judul="Susunan acara"
            deskripsi={`${formatTanggal(event.mulai)}. Semua waktu dalam WIB.`}
          />
        </Reveal>

        <Reveal>
          <ol className="flex flex-col border-t border-garis">
            {rundown.map((sesi) => {
              const speaker = speakers.find((s) => s.id === sesi.speakerId);
              const utama = jenisUtama.includes(sesi.jenis);

              return (
                <BarisSesi
                  key={sesi.mulai}
                  mulai={sesi.mulai}
                  selesai={sesi.selesai}
                  className="grid gap-3 border-b border-garis py-6 md:grid-cols-[10rem_8rem_minmax(0,1fr)] md:items-baseline md:gap-8 md:py-7"
                >
                  <div className="flex items-center gap-3 md:contents">
                    <span className="font-mono text-sm text-redup tabular-nums">
                      {jam(sesi.mulai)}–{jam(sesi.selesai)}
                    </span>
                    <span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase ${
                          utama ? "bg-aksen/10 text-aksen" : "border border-garis-kuat text-redup"
                        }`}
                      >
                        {labelJenis[sesi.jenis]}
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className={`text-lg leading-snug sm:text-xl ${utama ? "font-semibold" : "text-redup"}`}>
                      {sesi.judul}
                    </h3>
                    {speaker && (
                      <p className="text-[15px] text-redup">
                        {speaker.nama} — {speaker.jabatan}, {speaker.perusahaan}
                      </p>
                    )}
                    {sesi.deskripsi && <p className="text-[15px] text-redup">{sesi.deskripsi}</p>}
                  </div>
                </BarisSesi>
              );
            })}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}