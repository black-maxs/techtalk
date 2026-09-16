type Props = {
  terisi: number;
  kuota: number;
};

export default function KuotaKursi({ terisi, kuota }: Props) {
  const sisa = Math.max(0, kuota - terisi);
  const persen = Math.min(100, Math.round((terisi / kuota) * 100));

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between text-sm">
        <span className="text-redup">Kursi tersisa</span>
        <span className="font-mono">
          {sisa} / {kuota}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Kursi terisi"
        aria-valuemin={0}
        aria-valuemax={kuota}
        aria-valuenow={terisi}
        className="h-1.5 rounded-full bg-trek"
      >
        <div className="h-full rounded-full bg-aksen" style={{ width: `${persen}%` }} />
      </div>
    </div>
  );
}