"use client";

import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MermaidInit() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  useEffect(() => {
    const isDark = theme === "dark";

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      themeVariables: {
        fontFamily: "var(--font-mono)",
        primaryColor: isDark ? "#58a6ff" : "#4b83a9",
        background: "transparent",
        mainBkg: "transparent",
      },
    });
  }, [theme]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 페이지 변경시 실행
  useEffect(() => {
    mermaid.run({
      querySelector: ".mermaid",
    });
  }, [pathname, theme]);

  return null;
}
