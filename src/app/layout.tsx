import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechTalk 2026 — The Future of Technology & Digital Innovation",
  description:
    "Seminar teknologi bersama praktisi industri. 25 Oktober 2026. Daftar sekarang dan amankan kursimu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}