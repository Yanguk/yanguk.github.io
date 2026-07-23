import type { MetadataRoute } from "next";
import { getAllBlogContents } from "@/lib/blog";
import { siteMetadata } from "@/site-meta-data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogContents();

  const routes = ["", "blog"].map((route) => ({
    url: `${siteMetadata.siteUrl}/${route}`,
    lastModified: new Date().toISOString(),
  }));

  const blogRoutes = posts
    .filter(({ metadata }) => !metadata.public)
    .map(({ metadata, slug }) => {
      const date = new Date(metadata.publishedAt);
      const hours = date.getHours();

      return {
        url: `${siteMetadata.siteUrl}/blog/${slug}`,
        lastModified: new Date(date.setHours(hours - 9)).toISOString(),
      };
    });

  return [...routes, ...blogRoutes];
}
