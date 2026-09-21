import { LoaderCircle } from "lucide-react";

export default function Memuat() {
  return (
    <div className="grid place-items-center py-24">
      <LoaderCircle className="size-6 animate-spin text-aksen" />
      <span className="sr-only">Memuat data…</span>
    </div>
  );
}
