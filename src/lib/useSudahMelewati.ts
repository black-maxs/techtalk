import { useSyncExternalStore } from "react";

function langganGulir(beriTahu: () => void) {
  window.addEventListener("scroll", beriTahu, { passive: true });
  window.addEventListener("resize", beriTahu);
  return () => {
    window.removeEventListener("scroll", beriTahu);
    window.removeEventListener("resize", beriTahu);
  };
}

/**
 * true jika halaman sudah digulir melewati titik tertentu.
 * - idElemen null → dibandingkan dengan window.scrollY
 * - idElemen diisi → true saat bagian bawah elemen itu sudah naik melewati atas layar
 */
export function useSudahMelewati(idElemen: string | null, jarak = 0): boolean {
  return useSyncExternalStore(
    langganGulir,
    () => {
      if (idElemen === null) return window.scrollY > jarak;
      const elemen = document.getElementById(idElemen);
      return elemen ? elemen.getBoundingClientRect().bottom < jarak : false;
    },
    () => false,
  );
}

/** true jika sebagian elemen sedang tampil di layar */
export function useSedangTerlihat(idElemen: string): boolean {
  return useSyncExternalStore(
    langganGulir,
    () => {
      const elemen = document.getElementById(idElemen);
      if (!elemen) return false;
      const kotak = elemen.getBoundingClientRect();
      return kotak.top < window.innerHeight && kotak.bottom > 0;
    },
    () => false,
  );
}

/**
 * id section yang sedang dibaca: section terakhir yang bagian atasnya
 * sudah melewati garis 40% tinggi layar. null jika masih di hero.
 */
export function useSectionAktif(daftarId: string[]): string | null {
  return useSyncExternalStore(
    langganGulir,
    () => {
      const batas = window.innerHeight * 0.4;
      let aktif: string | null = null;
      for (const id of daftarId) {
        const elemen = document.getElementById(id);
        if (elemen && elemen.getBoundingClientRect().top <= batas) aktif = id;
      }
      return aktif;
    },
    () => null,
  );
}
