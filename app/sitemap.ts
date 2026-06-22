import type { MetadataRoute } from "next";

const BASE = "https://organon.stevenvallejo.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE + "/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: BASE + "/casos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: BASE + "/docs",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
