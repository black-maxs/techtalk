import "server-only";
import { tiket } from "@/data/event";
import type { Pesanan } from "@/lib/types";

/**
 * Lingkungan ditentukan EKSPLISIT lewat env, bukan ditebak dari bentuk kunci.
 * Kunci sandbox Midtrans tidak selalu berawalan "SB-".
 * Default-nya sandbox: kalau env lupa diisi, yang terjadi paling buruk hanyalah
 * transaksi uji, bukan transaksi uang sungguhan.
 */
export const MIDTRANS_PRODUKSI =
  process.env.NEXT_PUBLIC_MIDTRANS_PRODUKSI === "true";

function alamatDasar(): string {
  return MIDTRANS_PRODUKSI
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";
}

/** Sisa waktu bayar dalam menit, minimal 1 */
function sisaMenit(kedaluwarsaPada: string): number {
  const selisih = new Date(kedaluwarsaPada).getTime() - Date.now();
  return Math.max(1, Math.ceil(selisih / 60_000));
}

/**
 * Minta Snap token ke Midtrans. Token ini yang dipakai browser untuk membuka popup.
 * null jika kunci belum diisi atau Midtrans menolak.
 */
export async function buatTokenSnap(
  pesanan: Pesanan,
  urlSelesai: string,
): Promise<string | null> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    console.error("MIDTRANS_SERVER_KEY belum diisi di .env.local");
    return null;
  }

  const namaTiket =
    tiket.find((t) => t.id === pesanan.jenis_tiket)?.nama ??
    pesanan.jenis_tiket;
  const [namaDepan, ...sisaNama] = pesanan.nama.split(" ");

  const res = await fetch(`${alamatDasar()}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Basic auth: username = server key, password kosong
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: pesanan.kode, // kode tiket kita = order_id Midtrans
        gross_amount: pesanan.harga,
      },
      item_details: [
        {
          id: pesanan.jenis_tiket,
          price: pesanan.harga,
          quantity: 1,
          name: `Tiket ${namaTiket} TechTalk`,
        },
      ],
      customer_details: {
        first_name: namaDepan,
        last_name: sisaNama.join(" "),
        email: pesanan.email,
        phone: `+${pesanan.whatsapp}`,
      },
      // Batas bayar di Midtrans disamakan dengan kedaluwarsa_pada di database kita
      expiry: { unit: "minute", duration: sisaMenit(pesanan.kedaluwarsa_pada) },
      callbacks: { finish: urlSelesai },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(
      "Midtrans menolak permintaan:",
      res.status,
      JSON.stringify(data),
    );
    return null;
  }

  return data.token as string;
}
