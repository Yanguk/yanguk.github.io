export const ROUTES = {
  HOME: "/",
  BLOG: "/blog",
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  FEED: "/feed.xml",
} as const;
