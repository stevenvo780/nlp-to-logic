import type { MetadataRoute } from "next";

const BASE = "https://organon.stevenvallejo.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE + "/",
      lastModified: new Date("2026-06-15"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: BASE + "/casos",
      lastModified: new Date("2026-06-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: BASE + "/docs",
      lastModified: new Date("2026-06-15"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
