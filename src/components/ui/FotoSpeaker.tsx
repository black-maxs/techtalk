import Image from "next/image";
import { inisial } from "@/lib/utils";

type Props = {
  nama: string;
  foto?: string;
};

export default function FotoSpeaker({ nama, foto }: Props) {
  return (
    <div className="relative aspect-4/3 overflow-hidden border-b border-garis lg:aspect-4/5">
      {foto ? (
        <Image
          src={foto}
          alt={`Foto ${nama}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover object-top grayscale transition-[filter] duration-500 group-hover:grayscale-0"
        />
      ) : (
        <div aria-hidden className="latar-grid absolute inset-0 grid place-items-center">
          <span className="font-mono text-7xl font-medium text-teks/15 transition-colors duration-500 group-hover:text-aksen/40">
            {inisial(nama)}
          </span>
          <span className="absolute bottom-4 left-4 font-mono text-[11px] tracking-wider text-redup">
            FOTO MENYUSUL
          </span>
        </div>
      )}
    </div>
  );
}