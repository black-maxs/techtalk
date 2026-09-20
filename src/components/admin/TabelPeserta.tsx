import { CircleCheck } from "lucide-react";
import { labelStatus, statusSaatIni } from "@/lib/statusPesanan";
import type { Pesanan, StatusPesanan } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

const gayaStatus: Record<StatusPesanan, string> = {
  paid: "bg-aksen/15 text-aksen",
  pending: "bg-amber/15 text-amber",
  expired: "bg-teks/10 text-redup",
  failed: "bg-bahaya/15 text-bahaya",
};

/** "2026-09-20T13:32:03Z" → "20 Sep, 20.32" (WIB) */
function waktuSingkat(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export default function TabelPeserta({ peserta }: { peserta: Pesanan[] }) {
  if (peserta.length === 0) {
    return (
      <p className="rounded-xl border border-garis-kuat bg-panel p-8 text-center text-redup">
        Tidak ada peserta yang cocok dengan filter ini.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-garis-kuat bg-panel">
      <table className="w-full min-w-56rem text-left text-sm">
        <thead className="border-b border-garis text-xs tracking-wider text-redup uppercase">
          <tr>
            <th className="p-4 font-medium">Kode</th>
            <th className="p-4 font-medium">Peserta</th>
            <th className="p-4 font-medium">Kontak</th>
            <th className="p-4 font-medium">Tiket</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Daftar</th>
            <th className="p-4 font-medium">Check-in</th>
          </tr>
        </thead>
        <tbody>
          {peserta.map((p) => {
            const status = statusSaatIni(p);
            return (
              <tr
                key={p.kode}
                className="border-b border-garis last:border-b-0"
              >
                <td className="p-4 font-mono text-xs whitespace-nowrap">
                  {p.kode}
                </td>
                <td className="p-4">
                  <span className="font-medium">{p.nama}</span>
                  <br />
                  <span className="text-xs text-redup">{p.instansi}</span>
                </td>
                <td className="p-4">
                  <span className="text-xs">{p.email}</span>
                  <br />
                  <span className="font-mono text-xs text-redup">
                    {p.whatsapp}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="capitalize">
                    {p.jenis_tiket.replace("-", " ")}
                  </span>
                  <br />
                  <span className="font-mono text-xs text-redup">
                    {formatRupiah(p.harga)}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[11px] whitespace-nowrap ${gayaStatus[status]}`}
                  >
                    {labelStatus[status]}
                  </span>
                </td>
                <td className="p-4 text-xs whitespace-nowrap text-redup">
                  {waktuSingkat(p.dibuat_pada)}
                </td>
                <td className="p-4 text-xs whitespace-nowrap">
                  {p.check_in_pada ? (
                    <span className="flex items-center gap-1.5 text-aksen">
                      <CircleCheck className="size-4" />
                      {waktuSingkat(p.check_in_pada)}
                    </span>
                  ) : (
                    <span className="text-redup">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
