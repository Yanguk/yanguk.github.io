import type { MetadataRoute } from "next";
import { siteMetadata } from "@/site-meta-data";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = siteMetadata.siteUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl,
  };
}
