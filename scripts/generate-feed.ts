import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { mdProcessor } from "../src/lib/md-processor";
import { MetadataSchema } from "../src/lib/schema";
import { siteMetadata } from "../src/site-meta-data";

const contentPath = path.join(process.cwd(), "content", "blog");
const feedPath = path.join(process.cwd(), "public", "feed.xml");

const escapeXml = (value: string) => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
};

const wrapCdata = (value: string) => {
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
};

const posts = await Promise.all(
  fs
    .readdirSync(contentPath)
    .filter((file) => path.extname(file) === ".md")
    .map(async (file) => {
      const markdown = fs.readFileSync(path.join(contentPath, file), "utf8");
      const { data, content } = matter(markdown);
      const metadata = MetadataSchema.parse(data);
      const slug = path.basename(file, path.extname(file));
      const processedContent = await mdProcessor.process(content);

      return {
        htmlContent: `<h1>${metadata.title}</h1>${processedContent.toString()}`,
        metadata,
        slug,
      };
    }),
);

const publicPosts = posts
  .filter(({ metadata }) => metadata.public)
  .sort((a, b) => {
    const dateCompare =
      b.metadata.publishedAt.getTime() - a.metadata.publishedAt.getTime();

    if (dateCompare === 0) {
      return b.slug.localeCompare(a.slug);
    }

    return dateCompare;
  });

const siteUrl = siteMetadata.siteUrl;
const feedUrl = new URL("/feed.xml", siteUrl).toString();
const latestPostDate = publicPosts.at(0)?.metadata.publishedAt ?? new Date();

const items = publicPosts.map(({ htmlContent, metadata, slug }) => {
  const url = new URL(`/blog/${slug}`, siteUrl).toString();

  return `
    <item>
      <title>${escapeXml(metadata.title)}</title>
      <link>${escapeXml(url)}</link>
      <description>${escapeXml(metadata.title)}</description>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${metadata.publishedAt.toUTCString()}</pubDate>
      <content:encoded>${wrapCdata(htmlContent)}</content:encoded>
    </item>`;
});

const rss = `
<?xml version="1.0" encoding="UTF-8" ?>

<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>ko</language>

    <lastBuildDate>${latestPostDate.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />

    ${items.join("")}
  </channel>
</rss>
`.trim();

fs.writeFileSync(feedPath, rss);
console.log(`Generated ${path.relative(process.cwd(), feedPath)}`);
