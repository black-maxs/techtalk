import type { Ringkasan } from "@/lib/admin";
import { formatRupiah } from "@/lib/utils";

export default function KartuRingkasan({ data }: { data: Ringkasan }) {
  const kartu = [
    { label: "Peserta lunas", nilai: String(data.lunas), aksen: true },
    { label: "Pendapatan", nilai: formatRupiah(data.pendapatan) },
    { label: "Menunggu bayar", nilai: String(data.pending) },
    { label: "Sisa kuota", nilai: String(data.sisaKuota) },
    { label: "Sudah check-in", nilai: `${data.checkIn} / ${data.lunas}` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {kartu.map((k) => (
        <div
          key={k.label}
          className="flex flex-col gap-1 rounded-xl border border-garis-kuat bg-panel p-5"
        >
          <span className="text-xs text-redup">{k.label}</span>
          <span
            className={`font-mono text-2xl font-medium ${k.aksen ? "text-aksen" : ""}`}
          >
            {k.nilai}
          </span>
        </div>
      ))}
    </div>
  );
}
