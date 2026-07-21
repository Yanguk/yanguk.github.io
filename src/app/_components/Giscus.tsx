"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export const GiscusWrapper = ({ className }: { className?: string }) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <div className={className}>
      <Giscus
        id="comments"
        repo="Yanguk/yanguk.github.io"
        repoId="R_kgDOP3Wgvg"
        category="Announcements"
        categoryId="DIC_kwDOP3Wgvs4C1swo"
        mapping="pathname"
        strict="0"
        reactions-enabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
};
