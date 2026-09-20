import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { terapkanNotifikasi } from "@/lib/pesanan";
import type { StatusPesanan } from "@/lib/types";

type Notifikasi = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
};

/** Terjemahkan istilah Midtrans ke status kita. null = tidak perlu diubah. */
function statusDari(
  transactionStatus?: string,
  fraudStatus?: string,
): StatusPesanan | null {
  switch (transactionStatus) {
    case "settlement":
      return "paid";
    case "capture":
      // Kartu kredit: hanya sah kalau lolos pemeriksaan penipuan
      return fraudStatus === "accept" ? "paid" : null;
    case "deny":
    case "cancel":
      return "failed";
    case "expire":
      return "expired";
    default:
      // "pending" dan status lain: biarkan apa adanya
      return null;
  }
}

export async function POST(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    console.error("Webhook: MIDTRANS_SERVER_KEY belum diisi");
    return NextResponse.json({ pesan: "Belum dikonfigurasi" }, { status: 500 });
  }

  let notifikasi: Notifikasi;
  try {
    notifikasi = await request.json();
  } catch {
    return NextResponse.json({ pesan: "Body bukan JSON" }, { status: 400 });
  }

  const { order_id, status_code, gross_amount, signature_key } = notifikasi;
  if (!order_id || !status_code || !gross_amount || !signature_key) {
    return NextResponse.json({ pesan: "Data tidak lengkap" }, { status: 400 });
  }

  // Verifikasi tanda tangan: SHA512(order_id + status_code + gross_amount + ServerKey)
  const tandaTangan = createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (tandaTangan !== signature_key) {
    console.warn("Webhook DITOLAK, tanda tangan tidak cocok:", order_id);
    return NextResponse.json(
      { pesan: "Tanda tangan tidak valid" },
      { status: 403 },
    );
  }

  const statusBaru = statusDari(
    notifikasi.transaction_status,
    notifikasi.fraud_status,
  );
  if (statusBaru) {
    await terapkanNotifikasi(order_id, statusBaru, Number(gross_amount));
  }

  // Selalu balas 200 untuk notifikasi yang sah, supaya Midtrans tidak mengirim ulang
  return NextResponse.json({ pesan: "OK" });
}
