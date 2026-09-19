"use client";

import { AnimatePresence, motion } from "motion/react";
import Tombol from "@/components/ui/Tombol";
import { formatRupiah } from "@/lib/utils";
import { useSedangTerlihat, useSudahMelewati } from "@/lib/useSudahMelewati";

type Props = {
  hargaTermurah: number;
};

export default function CtaMelayang({ hargaTermurah }: Props) {
  const lewatHero = useSudahMelewati("hero", 0);
  const tiketTerlihat = useSedangTerlihat("tiket");
  const tampil = lewatHero && !tiketTerlihat;

  return (
    <AnimatePresence>
      {tampil && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-garis bg-latar/85 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-redup">Tiket mulai</span>
              <span className="font-mono text-lg font-medium">{formatRupiah(hargaTermurah)}</span>
            </div>
            <Tombol href="#tiket" panah>
              Daftar
            </Tombol>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}