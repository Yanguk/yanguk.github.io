import { notFound } from "next/navigation";
import { GiscusWrapper } from "@/app/_components/Giscus";
import { MdxHtml } from "@/app/_components/MdxLayout";
import { getBlogSlugs, importBlogContent } from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { htmlContent, metadata } = await importBlogContent(slug);

  if (!metadata.public) {
    return notFound(); // Render 404 page
  }

  return (
    <>
      <MdxHtml html={htmlContent} />

      <GiscusWrapper className="mt-15 border-border/60 border-t-4 border-double pt-10" />
    </>
  );
}
