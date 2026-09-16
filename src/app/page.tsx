import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import CtaMelayang from "@/components/ui/CtaMelayang";

// Sementara: angka dummy. Di Tahap 4 diambil dari database (jumlah pesanan lunas).
const KURSI_TERISI = 58;

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero kursiTerisi={KURSI_TERISI} />
        {/* Sementara: ruang kosong untuk menguji navbar & CTA saat digulir. Dihapus di 3B. */}
        <div className="h-[150vh]" />
      </main>
      <CtaMelayang />
    </>
  );
}
