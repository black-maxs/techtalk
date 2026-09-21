import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Scanner from "@/components/admin/Scanner";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Check-in Peserta",
  robots: { index: false, follow: false },
};

export default function HalamanCheckIn() {
  return (
    <Container className="flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin"
          className="flex w-fit items-center gap-2 text-sm text-redup transition-colors hover:text-teks"
        >
          <ArrowLeft className="size-4" />
          Kembali ke dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">
          Check-in Peserta
        </h1>
        <p className="text-sm leading-relaxed text-redup">
          Pindai QR code di e-tiket peserta. Satu tiket hanya bisa check-in
          sekali.
        </p>
      </div>

      <Scanner />
    </Container>
  );
}
