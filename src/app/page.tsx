import { connection } from "next/server";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Faq from "@/components/sections/Faq";
import Hero from "@/components/sections/Hero";
import Kontak from "@/components/sections/Kontak";
import Rundown from "@/components/sections/Rundown";
import Speaker from "@/components/sections/Speaker";
import Tentang from "@/components/sections/Tentang";
import Tiket from "@/components/sections/Tiket";
import CtaMelayang from "@/components/ui/CtaMelayang";
import { daftarTiket, hargaTermurah } from "@/lib/tiket";

// Sementara: angka dummy. Di Tahap 4 diambil dari database (jumlah pesanan lunas).
const KURSI_TERISI = 58;

export default async function Home() {
  // Render ulang untuk setiap pengunjung, supaya status tiket (Early Bird) selalu sesuai waktu sekarang
  await connection();
  const semuaTiket = daftarTiket();

  return (
    <>
      <Navbar />
      <main>
        <Hero kursiTerisi={KURSI_TERISI} />
        <Tentang />
        <Speaker />
        <Rundown />
        <Tiket daftar={semuaTiket} />
        <Faq />
        <Kontak />
      </main>
      <Footer />
      <CtaMelayang hargaTermurah={hargaTermurah(semuaTiket)} />
    </>
  );
}
