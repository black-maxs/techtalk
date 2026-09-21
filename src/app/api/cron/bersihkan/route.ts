import type { NextRequest } from "next/server";
import { bersihkanKedaluwarsa } from "@/lib/admin";

export async function GET(request: NextRequest) {
  // Vercel mengirim CRON_SECRET sebagai header Authorization saat memanggil cron
  const header = request.headers.get("authorization");
  const rahasia = process.env.CRON_SECRET;

  if (!rahasia || header !== `Bearer ${rahasia}`) {
    return new Response("Tidak diizinkan", { status: 401 });
  }

  const jumlah = await bersihkanKedaluwarsa();
  console.log(`Cron: ${jumlah} pesanan kedaluwarsa dibersihkan`);

  return Response.json({ dibersihkan: jumlah });
}
