import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { mdProcessor } from "@/lib/md-processor";
import { type ContentModule, MetadataSchema } from "@/lib/schema";

const contentPath = path.join(process.cwd(), "content");

export function getBlogSlugs() {
  const dir = path.join(contentPath, "blog");

  return fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === ".md")
    .map((file) => path.basename(file, path.extname(file)));
}

const importContent = async (filePath: string): Promise<ContentModule> => {
  const markdown = fs.readFileSync(filePath, "utf-8");

  const { data, content } = matter(markdown);
  const metadata = MetadataSchema.parse(data);

  const processedContent = await mdProcessor.process(content);
  const htmlContent: string = processedContent.toString();

  const htmlContentWithTitle = `<h1>${metadata.title}</h1>${htmlContent}`;

  return {
    htmlContent: htmlContentWithTitle,
    metadata,
  };
};

export async function importBlogContent(slug: string): Promise<ContentModule> {
  return await importContent(path.join(contentPath, "blog", `${slug}.md`));
}

export async function importAboutContent(): Promise<ContentModule> {
  return await importContent(path.join(contentPath, "about.md"));
}

export async function getAllBlogContents() {
  const contents = await Promise.all(
    getBlogSlugs().map(async (slug) => {
      const { metadata } = await importBlogContent(slug);

      return {
        metadata,
        slug,
      };
    }),
  );

  contents.sort((a, b) => {
    const dateCompare =
      b.metadata.publishedAt.getTime() - a.metadata.publishedAt.getTime();

    if (dateCompare === 0) {
      return b.slug.localeCompare(a.slug);
    }

    return dateCompare;
  });

  return contents.filter(({ metadata }) => metadata.public);
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
