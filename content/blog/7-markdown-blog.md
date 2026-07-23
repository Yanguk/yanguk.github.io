---
title: markdown 블로그 개발하기
publishedAt: 2026-01-21
public: true
---

지금 블로그는 nextjs의 mdx지원 기능을 이용해서 구현되었고, vercel로 호스팅중 이다.
블로그 리모델링할 겸 해서 개선하고 싶은 점이 있어서 구조좀 변경 할려고 한다.
그런데 오랜만에 할라니까 어떤 구조인지 기억이 안나서 포스팅을 해본다.

## Netxjs로 블로그 만들기

[nextjs문서](https://nextjs.org/docs/app/guides/mdx)

### Feature 항목

- mdx 파싱하여 html으로 변환 해서 페이지로 만들기
  - `remark`[^1], `rehypo`[^2] 를 사용해서 변환 과정을 거친다.
    > mdx -> remark -> rehype -> html
  - 마크다운의 코드 블럭 스타일 처리 (`prism` 사용)

[^1]: 마크다운을 AST로 파싱하고, 내용을 가공하거나 변형하는 데 사용

[^2]: HTML를 AST로 만들고, 내용을 가공하거나 변형하는 데 사용

- sitemap[^3] 만들기
  - SEO를 위해 필요함

[^3]: 검색 엔진용 사이트맵

- RSS Feed 설정

### 구현 하기

1. mdx 파싱해서 -> 페이지 만들기

nextjs에서 turbo pack를 사용해서 할려면은 next.config.ts에서 설정해 줘야 한다.

```tsx
// next.config.ts
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-breaks",
      "remark-gfm",
      ["remark-toc", { heading: "목차" }],
    ],
    rehypePlugins: [
      ["rehype-slug"],
      [
        "rehype-autolink-headings",
        {
          behavior: "append",
        },
      ],
      ["rehype-katex", { strict: true, throwOnError: true }],
      "rehype-plugin-image-native-lazy-loading",
      ["rehype-prism-plus", { defaultLanguage: "js", ignoreMissing: true }],
    ],
  },
});

export default withMDX(nextConfig);
```

mdx파일 수집해서 페이지로 만들기

```tsx
// mdx파일들 읽어서 객체화하기
export function getBlogSlugs() {
  const dir = path.join(process.cwd(), "src", "content", "blog");

  return fs
    .readdirSync(dir)
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => path.basename(file, path.extname(file)));
}

export async function importBlogContent(slug: string): Promise<ContentModule> {
  const module = await import(`@/content/blog/${slug}.mdx`);

  return {
    ...module,
    metadata: MetadataSchema.parse(module.metadata),
  };
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

  contents.sort((a, b) =>
    b.metadata.publishedAt.localeCompare(a.metadata.publishedAt),
  );

  return contents.filter(({ metadata }) => !metadata.public);
}
```

```tsx
// app/blog/[slug]/page.tsx
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

  const { default: Content, metadata } = await importBlogContent(slug);

  if (metadata.public) {
    return notFound(); // Render 404 page
  }

  return <Content />;
}
```

2. sitemap 구성하기

```tsx
// app/sitemap.ts
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
```
