import type { MetadataRoute } from "next";
import { ROUTES } from "@/constants";
import { getAllBlogContents } from "@/lib/blog";
import { siteMetadata } from "@/site-meta-data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogContents();
  const siteUrl = siteMetadata.siteUrl;

  const routes = [ROUTES.HOME, ROUTES.BLOG].map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: new Date().toISOString(),
  }));

  const blogRoutes = posts.map(({ metadata, slug }) => {
    return {
      url: new URL(ROUTES.BLOG_POST(slug), siteUrl).toString(),
      lastModified: metadata.publishedAt.toISOString(),
    };
  });

  return [...routes, ...blogRoutes];
}
