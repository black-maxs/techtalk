import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";
import { event, speakers } from "@/data/event";
import { formatTanggal } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const judul = `${event.nama} ${event.tahun} — ${event.tema}`;
const deskripsi = `Seminar teknologi bersama ${speakers.length} praktisi industri, ${formatTanggal(event.mulai)} di ${event.venue.kota}. Daftar online dan amankan kursimu.`;

export const metadata: Metadata = {
  // Dipakai sebagai dasar semua URL relatif di metadata (OG image, canonical, dll.)
  metadataBase: new URL(event.url),
  title: {
    default: judul,
    template: `%s — ${event.nama} ${event.tahun}`,
  },
  description: deskripsi,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: `${event.nama} ${event.tahun}`,
    title: judul,
    description: deskripsi,
  },
  twitter: {
    card: "summary_large_image",
    title: judul,
    description: deskripsi,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="latar-grid">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-60 focus:rounded-md focus:bg-aksen focus:px-4 focus:py-3 focus:font-semibold focus:text-latar"
        >
          Lewati ke konten utama
        </a>
        <MotionProvider>
          <div id="konten">{children}</div>
        </MotionProvider>
      </body>
    </html>
  );
}
