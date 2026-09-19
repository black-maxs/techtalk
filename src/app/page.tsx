import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Rundown from "@/components/sections/Rundown";
import Speaker from "@/components/sections/Speaker";
import Tentang from "@/components/sections/Tentang";
import CtaMelayang from "@/components/ui/CtaMelayang";

// Sementara: angka dummy. Di Tahap 4 diambil dari database (jumlah pesanan lunas).
const KURSI_TERISI = 58;

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero kursiTerisi={KURSI_TERISI} />
        <Tentang />
        <Speaker />
        <Rundown />
      </main>
      <CtaMelayang />
    </>
  );
}