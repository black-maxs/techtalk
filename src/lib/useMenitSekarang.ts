import { useSyncExternalStore } from "react";

function langganMenit(beriTahu: () => void) {
  const id = setInterval(beriTahu, 30_000);
  return () => clearInterval(id);
}

/** Waktu sekarang dalam satuan menit (epoch). null saat dirender di server. */
export function useMenitSekarang(): number | null {
  return useSyncExternalStore(
    langganMenit,
    () => Math.floor(Date.now() / 60_000),
    () => null,
  );
}
