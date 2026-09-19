import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container";

/** Header untuk halaman selain landing page (daftar, pesanan) */
export default function HeaderSederhana() {
  return (
    <header className="border-b border-garis">
      <Container className="flex h-18 items-center justify-between">
        <Link href="/" className="font-mono font-medium tracking-wide">
          TECHTALK<span className="text-aksen">/26</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-[15px] text-redup transition-colors hover:text-teks">
          <ArrowLeft className="size-4" />
          Kembali ke beranda
        </Link>
      </Container>
    </header>
  );
}
