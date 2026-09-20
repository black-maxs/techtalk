import type { Metadata } from "next";
import { bersihkan } from "@/app/admin/actions";
import KartuRingkasan from "@/components/admin/KartuRingkasan";
import TabelPeserta from "@/components/admin/TabelPeserta";
import Container from "@/components/ui/Container";
import { daftarPeserta, ringkasanPeserta } from "@/lib/admin";
import type { StatusPesanan } from "@/lib/types";
import Link from "next/link";
import { Download, Eraser, ScanLine } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard Panitia — TechTalk 2026",
  robots: { index: false, follow: false },
};

const pilihanStatus: { nilai: string; label: string }[] = [
  { nilai: "semua", label: "Semua status" },
  { nilai: "paid", label: "Lunas" },
  { nilai: "pending", label: "Menunggu pembayaran" },
  { nilai: "expired", label: "Kedaluwarsa" },
  { nilai: "failed", label: "Gagal" },
];

type Props = {
  searchParams: Promise<{ status?: string; cari?: string }>;
};

export default async function HalamanAdmin({ searchParams }: Props) {
  const { status = "semua", cari = "" } = await searchParams;
  const statusValid = pilihanStatus.some((p) => p.nilai === status)
    ? status
    : "semua";

  const [ringkasan, peserta] = await Promise.all([
    ringkasanPeserta(),
    daftarPeserta({ status: statusValid as StatusPesanan | "semua", cari }),
  ]);

  return (
    <Container className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">
            Data Peserta
          </h1>
          <p className="text-sm text-redup">
            {peserta.length} baris ditampilkan
          </p>
        </div>

        <Link
          href="/admin/checkin"
          className="flex items-center gap-2 rounded-md border border-aksen/50 px-4 py-2.5 text-sm font-medium text-aksen transition-colors hover:border-aksen"
        >
          <ScanLine className="size-4" />
          Scanner check-in
        </Link>

        <div className="flex flex-wrap gap-2">
          <form action={bersihkan}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md border border-garis-kuat px-4 py-2.5 text-sm transition-colors hover:border-teks/40"
            >
              <Eraser className="size-4" />
              Bersihkan kedaluwarsa
            </button>
          </form>
          <a
            href="/admin/export"
            className="flex items-center gap-2 rounded-md bg-aksen px-4 py-2.5 text-sm font-semibold text-latar transition-colors hover:bg-aksen-terang"
          >
            <Download className="size-4" />
            Export CSV
          </a>
        </div>
      </div>

      {ringkasan ? (
        <KartuRingkasan data={ringkasan} />
      ) : (
        <p className="rounded-xl border border-bahaya/40 bg-bahaya/10 p-5 text-sm text-bahaya">
          Database tidak terhubung. Cek environment variable Supabase.
        </p>
      )}

      {/* Form biasa dengan method GET: filter tersimpan di URL, jadi bisa di-bookmark & di-refresh */}
      <form
        method="get"
        action="/admin"
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="search"
          name="cari"
          defaultValue={cari}
          placeholder="Cari nama, email, kode, atau instansi…"
          className="h-11 flex-1 rounded-md border border-garis-kuat bg-panel-2 px-4 text-sm transition-[border-color] duration-200 focus-visible:border-aksen"
        />
        <select
          name="status"
          defaultValue={statusValid}
          className="h-11 rounded-md border border-garis-kuat bg-panel-2 px-4 text-sm"
        >
          {pilihanStatus.map((p) => (
            <option key={p.nilai} value={p.nilai}>
              {p.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 rounded-md border border-garis-kuat px-5 text-sm font-medium transition-colors hover:border-teks/40"
        >
          Terapkan
        </button>
      </form>

      <TabelPeserta peserta={peserta} />
    </Container>
  );
}
