import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  varian?: "utama" | "garis";
  ukuran?: "sedang" | "besar";
  panah?: boolean;
  className?: string;
  onClick?: () => void;
};

const gayaVarian = {
  utama: "bg-aksen text-latar hover:bg-aksen-terang",
  garis: "border border-teks/20 text-teks hover:border-teks/40 hover:bg-teks/5",
};

const gayaUkuran = {
  sedang: "px-5 py-3 text-[15px]",
  besar: "px-7 py-4 text-[17px]",
};

export default function Tombol({
  href,
  children,
  varian = "utama",
  ukuran = "sedang",
  panah = false,
  className = "",
  onClick,
}: Props) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-md font-semibold transition-[background-color,border-color] duration-200 ${gayaVarian[varian]} ${gayaUkuran[ukuran]} ${className}`}
    >
      {children}
      {panah && (
        <ArrowRight
          aria-hidden
          strokeWidth={2.2}
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      )}
    </Link>
  );
}
