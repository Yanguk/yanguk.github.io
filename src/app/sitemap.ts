import type { MetadataRoute } from "next";
import { getAllBlogContents } from "@/lib/blog";
import { siteMetadata } from "@/site-meta-data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogContents();
  const siteUrl = siteMetadata.siteUrl;

  const routes = ["/", "/blog"].map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: new Date().toISOString(),
  }));

  const blogRoutes = posts
    .map(({ metadata, slug }) => {
      return {
        url: new URL(`/blog/${slug}`, siteUrl).toString(),
        lastModified: metadata.publishedAt.toISOString(),
      };
    });

  return [...routes, ...blogRoutes];
}
