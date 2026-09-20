import { ImageResponse } from "next/og";
import { event } from "@/data/event";
import { formatJam, formatTanggal } from "@/lib/utils";

export const alt = `${event.nama} ${event.tahun} — ${event.tema}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Teks dirakit di sini supaya tiap <div> hanya berisi SATU anak
  const waktu = `${formatTanggal(event.mulai)} · ${formatJam(event.mulai)}–${formatJam(event.selesai)} WIB`;
  const lokasi = `${event.venue.nama}, ${event.venue.kota}`;
  const ajakan = `Daftar di ${new URL(event.url).host}`;
  const logo = `TECHTALK/${String(event.tahun).slice(2)}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0c10",
        color: "#e8eaf0",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "28px",
          color: "#5ce1d6",
        }}
      >
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "999px",
            background: "#5ce1d6",
          }}
        />
        <div style={{ display: "flex" }}>{logo}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            fontSize: "76px",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          {event.tema}
        </div>
        <div style={{ display: "flex", fontSize: "32px", color: "#9aa0ad" }}>
          {waktu}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "26px",
          color: "#9aa0ad",
        }}
      >
        <div style={{ display: "flex" }}>{lokasi}</div>
        <div style={{ display: "flex", color: "#5ce1d6" }}>{ajakan}</div>
      </div>
    </div>,
    size,
  );
}
