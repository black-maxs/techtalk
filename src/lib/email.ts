import "server-only";
import QRCode from "qrcode";
import { event, tiket } from "@/data/event";
import type { Pesanan } from "@/lib/types";
import { formatJam, formatRupiah, formatTanggal } from "@/lib/utils";

const PENGIRIM =
  process.env.EMAIL_PENGIRIM ?? "TechTalk 2026 <onboarding@resend.dev>";

function htmlEmail(pesanan: Pesanan, urlTiket: string): string {
  const namaTiket =
    tiket.find((t) => t.id === pesanan.jenis_tiket)?.nama ??
    pesanan.jenis_tiket;
  const baris = [
    ["Kode tiket", pesanan.kode],
    ["Nama", pesanan.nama],
    ["Jenis tiket", namaTiket],
    ["Total dibayar", formatRupiah(pesanan.harga)],
    [
      "Tanggal",
      `${formatTanggal(event.mulai)}, ${formatJam(event.mulai)}–${formatJam(event.selesai)} WIB`,
    ],
    ["Lokasi", `${event.venue.nama}, ${event.venue.alamat}`],
  ];

  // Email dibaca di banyak aplikasi yang membuang <style>, jadi semua gaya ditulis inline
  return `
<div style="font-family:Helvetica,Arial,sans-serif;background:#f4f5f7;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
    <div style="background:#0a0c10;padding:28px 32px;">
      <p style="margin:0;color:#5ce1d6;font-size:13px;letter-spacing:2px;">TECHTALK/${String(event.tahun).slice(2)}</p>
      <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;">Pembayaranmu berhasil 🎟️</h1>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 20px;color:#333;font-size:15px;line-height:1.6;">
        Halo ${pesanan.nama}, tiketmu sudah aktif. Tunjukkan QR code di lampiran email ini
        (atau buka halaman e-tiket) kepada panitia saat check-in.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333;">
        ${baris
          .map(
            ([label, nilai]) =>
              `<tr><td style="padding:8px 0;color:#777;width:38%;">${label}</td><td style="padding:8px 0;font-weight:600;">${nilai}</td></tr>`,
          )
          .join("")}
      </table>
      <a href="${urlTiket}" style="display:block;margin:28px 0 0;background:#0a0c10;color:#5ce1d6;text-align:center;padding:16px;border-radius:8px;text-decoration:none;font-weight:bold;">
        Buka E-Tiket
      </a>
      <p style="margin:20px 0 0;color:#888;font-size:13px;line-height:1.6;">
        Simpan email ini. Kalau ada pertanyaan, balas saja email ini atau hubungi panitia.
      </p>
    </div>
  </div>
</div>`;
}

/** Kirim e-tiket ke email peserta. true kalau berhasil. */
export async function kirimEmailTiket(pesanan: Pesanan): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY belum diisi, pengiriman email dilewati");
    return false;
  }

  const urlTiket = `${event.url}/tiket/${pesanan.kode}`;
  const qrPng = await QRCode.toBuffer(pesanan.kode, {
    type: "png",
    width: 600,
    margin: 2,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: PENGIRIM,
      to: pesanan.email,
      subject: `E-tiket ${event.nama} ${event.tahun} — ${pesanan.kode}`,
      html: htmlEmail(pesanan, urlTiket),
      text: `Pembayaranmu berhasil. Kode tiket: ${pesanan.kode}. Buka e-tiket: ${urlTiket}`,
      attachments: [
        {
          filename: `tiket-${pesanan.kode}.png`,
          content: qrPng.toString("base64"),
        },
      ],
    }),
  });

  if (!res.ok) {
    console.error("Resend menolak pengiriman:", res.status, await res.text());
    return false;
  }
  return true;
}
