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
import { event } from "@/data/event";
import { hitungKursiTerisi } from "@/lib/pesanan";
import { daftarTiket, hargaTermurah } from "@/lib/tiket";
import { dataEvent } from "@/lib/jsonLd";

export default async function Home() {
  // Render ulang untuk setiap pengunjung, supaya status tiket (Early Bird)
  // dan jumlah kursi terisi selalu sesuai kondisi saat ini
  await connection();
  const kursiTerisi = await hitungKursiTerisi();
  const semuaTiket = daftarTiket({
    penuh: kursiTerisi !== null && kursiTerisi >= event.kuota,
  });
  const termurah = hargaTermurah(semuaTiket);

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        // \u003c mencegah teks data menutup tag <script> lebih awal (celah XSS klasik)
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dataEvent()).replace(/</g, "\\u003c"),
        }}
      />
      <main>
        <Hero kursiTerisi={kursiTerisi} />
        <Tentang />
        <Speaker />
        <Rundown />
        <Tiket daftar={semuaTiket} />
        <Faq />
        <Kontak />
      </main>
      <Footer />
      {termurah !== null && <CtaMelayang hargaTermurah={termurah} />}
    </>
  );
}
