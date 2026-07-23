import CustomLink from "@/app/_components/Link";
import { getAllBlogContents } from "@/lib/blog";

export const dynamicParams = false;

export default async function Page() {
  const contents = await getAllBlogContents();

  if (contents.length === 0) {
    return (
      <p className="not-prose text-muted-foreground">
        아직 작성된 포스팅이 없습니다.
      </p>
    );
  }

  return (
    <div className="not-prose flex flex-col gap-7">
      {contents.map(({ metadata, slug }) => (
        <CustomLink
          className="hover:opacity-85"
          key={slug}
          href={`/blog/${slug}`}
        >
          <p className="wrap-break-word font-semibold text-base text-heading-1 md:text-lg">
            {metadata.title}
          </p>

          <time className="block opacity-50">
            {metadata.publishedAt.toISOString().split("T")[0]}
          </time>
        </CustomLink>
      ))}
    </div>
  );
}
