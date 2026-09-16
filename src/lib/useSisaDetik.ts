import { useSyncExternalStore } from "react";

function langganDetik(beriTahu: () => void) {
  const id = setInterval(beriTahu, 1000);
  return () => clearInterval(id);
}

/** Sisa detik menuju waktu target. null saat dirender di server. */
export function useSisaDetik(targetIso: string): number | null {
  const target = new Date(targetIso).getTime();
  return useSyncExternalStore(
    langganDetik,
    () => Math.max(0, Math.floor((target - Date.now()) / 1000)),
    () => null,
  );
}

export function pecahDetik(total: number) {
  return {
    hari: Math.floor(total / 86400),
    jam: Math.floor((total % 86400) / 3600),
    menit: Math.floor((total % 3600) / 60),
    detik: total % 60,
  };
}