import type { MetadataRoute } from "next";
import { event } from "@/data/event";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Halaman pribadi peserta & panitia tidak boleh masuk hasil pencarian
      disallow: ["/admin", "/login-panitia", "/pesanan/", "/tiket/", "/api/"],
    },
    sitemap: `${event.url}/sitemap.xml`,
  };
}
