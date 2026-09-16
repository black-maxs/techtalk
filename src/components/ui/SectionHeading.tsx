type Props = {
  nomor: string;
  label: string;
  judul: string;
  deskripsi?: string;
};

export default function SectionHeading({ nomor, label, judul, deskripsi }: Props) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-sm tracking-wider text-aksen uppercase">
          {"// "}
          {nomor} — {label}
        </p>
        <h2 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] md:text-5xl lg:text-[3.5rem]">
          {judul}
        </h2>
      </div>
      {deskripsi && <p className="max-w-sm leading-relaxed text-redup">{deskripsi}</p>}
    </div>
  );
}