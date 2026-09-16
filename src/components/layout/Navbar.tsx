"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Tombol from "@/components/ui/Tombol";
import { navigasi } from "@/data/event";
import { useSudahMelewati } from "@/lib/useSudahMelewati";

export default function Navbar() {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const sudahGulir = useSudahMelewati(null, 8);
  const tampilLatar = sudahGulir || menuTerbuka;
  const tutupMenu = () => setMenuTerbuka(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        tampilLatar ? "border-garis bg-latar/75 backdrop-blur-md" : "border-transparent"
      }`}
    >
      <Container className="flex h-18 items-center justify-between">
        <Link href="#hero" onClick={tutupMenu} className="font-mono font-medium tracking-wide">
          TECHTALK<span className="text-aksen">/26</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[15px] text-redup">
            {navigasi.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-teks">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Tombol href="#tiket" panah className="hidden sm:inline-flex">
            Daftar Sekarang
          </Tombol>
          <button
            type="button"
            onClick={() => setMenuTerbuka((buka) => !buka)}
            aria-expanded={menuTerbuka}
            aria-controls="menu-mobile"
            aria-label={menuTerbuka ? "Tutup menu" : "Buka menu"}
            className="grid size-11 place-items-center rounded-md border border-garis-kuat md:hidden"
          >
            {menuTerbuka ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuTerbuka && (
          <motion.nav
            id="menu-mobile"
            aria-label="Navigasi mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-garis md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navigasi.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={tutupMenu}
                  className="rounded-md px-3 py-3 text-lg text-redup hover:bg-teks/5 hover:text-teks"
                >
                  {item.label}
                </Link>
              ))}
              <Tombol href="#tiket" ukuran="besar" panah onClick={tutupMenu} className="mt-3 sm:hidden">
                Daftar Sekarang
              </Tombol>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}