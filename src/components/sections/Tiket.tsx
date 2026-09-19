import { Check, Info } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Tombol from "@/components/ui/Tombol";
import type { TiketDenganStatus } from "@/lib/tiket";
import { formatRupiah, formatTanggalSingkat } from "@/lib/utils";

const gayaBadge = "rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wider whitespace-nowrap uppercase";

function Badge({ t }: { t: TiketDenganStatus }) {
  if (!t.tersedia) {
    return (
      <span className={`${gayaBadge} border border-garis-kuat text-redup`}>
        {t.alasan === "habis" ? "Habis" : "Berakhir"}
      </span>
    );
  }
  if (t.unggulan) return <span className={`${gayaBadge} bg-aksen text-latar`}>Paling diminati</span>;
  if (t.berlakuSampai) {
    return (
      <span className={`${gayaBadge} border border-amber/40 text-amber`}>
        s.d. {formatTanggalSingkat(t.berlakuSampai)}
      </span>
    );
  }
  return null;
}

type Props = {
  daftar: TiketDenganStatus[];
};

export default function Tiket({ daftar }: Props) {
  return (
    <section id="tiket" className="border-t border-garis bg-latar/70 py-24 lg:py-32">
      <Container className="flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            nomor="04"
            label="Tiket"
            judul="Pilih tiketmu"
            deskripsi="Semua tiket mendapat akses penuh. Bayar online, e-tiket ber-QR langsung dikirim ke email."
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {daftar.map((t, i) => {
            const sorot = t.unggulan && t.tersedia;
            return (
              <Reveal key={t.id} delay={i * 0.1} className="h-full">
                <div
                  className={`flex h-full flex-col gap-7 rounded-xl border bg-panel p-7 sm:p-9 ${
                    sorot ? "border-aksen shadow-sorot" : "border-garis-kuat"
                  } ${t.tersedia ? "" : "opacity-60"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold">{t.nama}</h3>
                    <Badge t={t} />
                  </div>

                  <p
                    className={`font-mono text-4xl font-medium tracking-tight sm:text-[2.75rem] ${
                      t.tersedia ? "" : "text-redup line-through"
                    }`}
                  >
                    {formatRupiah(t.harga)}
                  </p>

                  <p className="leading-relaxed text-redup">{t.deskripsi}</p>

                  <ul className="flex flex-1 flex-col gap-3 text-[15px]">
                    {t.fitur.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <Check strokeWidth={2.4} className="size-4 shrink-0 text-aksen" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {t.syarat && (
                    <p className="flex gap-2.5 rounded-lg bg-panel-2 p-3.5 text-sm leading-relaxed text-redup">
                      <Info className="mt-0.5 size-4 shrink-0 text-amber" />
                      {t.syarat}
                    </p>
                  )}

                  {t.tersedia ? (
                    <Tombol
                      href={`/daftar?tiket=${t.id}`}
                      varian={sorot ? "utama" : "garis"}
                      ukuran="besar"
                      className="w-full"
                    >
                      Pilih {t.nama}
                    </Tombol>
                  ) : (
                    <span className="rounded-md border border-garis py-4 text-center font-semibold text-redup">
                      Tidak tersedia
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}