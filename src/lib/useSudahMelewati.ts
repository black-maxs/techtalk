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
