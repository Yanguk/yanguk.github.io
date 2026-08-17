export const ROUTES = {
  HOME: "/",
  BLOG: "/blog",
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  RSS: "/rss.xml",
} as const;
