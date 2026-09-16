"use client";

import { pecahDetik, useSisaDetik } from "@/lib/useSisaDetik";

type Props = {
  target: string;
};

export default function Countdown({ target }: Props) {
  const sisa = useSisaDetik(target);

  if (sisa === 0) {
    return (
      <p className="rounded-lg bg-panel-2 py-6 text-center font-mono text-aksen">
        Acara sudah dimulai
      </p>
    );
  }

  const bagian = sisa === null ? null : pecahDetik(sisa);
  const kotak = [
    { label: "Hari", nilai: bagian?.hari },
    { label: "Jam", nilai: bagian?.jam },
    { label: "Menit", nilai: bagian?.menit },
    { label: "Detik", nilai: bagian?.detik },
  ];

  return (
    <div
      role="timer"
      aria-label="Hitung mundur menuju acara"
      className="grid grid-cols-4 gap-2.5"
    >
      {kotak.map((k, i) => (
        <div
          key={k.label}
          className="flex flex-col items-center gap-1.5 rounded-lg bg-panel-2 py-4"
        >
          <span
            className={`font-mono text-3xl font-medium tabular-nums sm:text-4xl ${i === 3 ? "text-aksen" : ""}`}
          >
            {k.nilai === undefined ? "--" : String(k.nilai).padStart(2, "0")}
          </span>
          <span className="text-xs text-redup">{k.label}</span>
        </div>
      ))}
    </div>
  );
}
