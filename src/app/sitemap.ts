import type { MetadataRoute } from "next";
import { event } from "@/data/event";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: event.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${event.url}/daftar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
