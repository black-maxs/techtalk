import { event, speakers, tiket } from "@/data/event";
import { formatRupiah } from "@/lib/utils";

export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <p className="text-sm tracking-widest text-neutral-500 uppercase">{event.tema}</p>
        <h1 className="mt-2 text-4xl font-bold">
          {event.nama} {event.tahun}
        </h1>
        <p className="mt-4 text-neutral-600">
          {speakers.length} speaker · {tiket.length} jenis tiket · mulai {formatRupiah(tiket[0].harga)}
        </p>
      </div>
    </main>
  );
}