"use client";

import type { ReactNode } from "react";
import { statusSesi } from "@/lib/rundown";
import { useMenitSekarang } from "@/lib/useMenitSekarang";

type Props = {
  mulai: string;
  selesai: string;
  className: string;
  children: ReactNode;
};

export default function BarisSesi({ mulai, selesai, className, children }: Props) {
  const menit = useMenitSekarang();
  const status = menit === null ? "akan" : statusSesi(mulai, selesai, menit * 60_000);

  return (
    <li
      aria-current={status === "berlangsung" ? "time" : undefined}
      className={`${className} transition-opacity duration-500 ${status === "selesai" ? "opacity-45" : ""}`}
    >
      {status === "berlangsung" && (
        <span className="flex items-center gap-2 font-mono text-xs tracking-wider text-aksen md:col-span-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-aksen opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-aksen" />
          </span>
          SEDANG BERLANGSUNG
        </span>
      )}
      {children}
    </li>
  );
}
