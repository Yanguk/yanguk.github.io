import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ROUTES } from "@/constants";
import { mdProcessor } from "@/lib/md-processor";
import { MetadataSchema } from "@/lib/schema";
import { siteMetadata } from "@/site-meta-data";

export const dynamic = "force-static";

const contentPath = path.join(process.cwd(), "content", "blog");

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

const resolveImageUrls = (html: string, siteUrl: string) => {
  return html.replace(
    /(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi,
    (_, prefix, src, suffix) => {
      if (
        src.startsWith("http://") ||
        src.startsWith("https://") ||
        src.startsWith("data:")
      ) {
        return `${prefix}${src}${suffix}`;
      }

      const absoluteUrl = new URL(src, siteUrl).toString();

      return `${prefix}${absoluteUrl}${suffix}`;
    },
  );
};

export async function GET() {
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

  const entries = publicPosts.map(({ htmlContent, metadata, slug }) => {
    const url = new URL(ROUTES.BLOG_POST(slug), siteUrl).toString();
    const updatedAt = metadata.publishedAt.toISOString();

    const atomContent = resolveImageUrls(htmlContent, siteUrl);

    return `
      <entry>
        <title>${escapeXml(metadata.title)}</title>

        <link
          href="${escapeXml(url)}"
          rel="alternate"
          type="text/html"
        />

        <id>${escapeXml(url)}</id>

        <published>${updatedAt}</published>
        <updated>${updatedAt}</updated>

        <content type="html">${wrapCdata(atomContent)}</content>
      </entry>
    `.trim();
  });

  const atom = `
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteMetadata.title)}</title>

  <link
    href="${escapeXml(siteUrl)}"
    rel="alternate"
    type="text/html"
  />

  <link
    href="${escapeXml(feedUrl)}"
    rel="self"
    type="application/atom+xml"
  />

  <id>${escapeXml(siteUrl)}</id>

  <updated>${latestPostDate.toISOString()}</updated>

  <subtitle>${escapeXml(siteMetadata.description)}</subtitle>
  <lang>ko</lang>

  ${entries.join("\n")}
</feed>
`.trim();

  return new Response(atom, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
