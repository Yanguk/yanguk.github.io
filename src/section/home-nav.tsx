"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HomeNavigationMenu({className}: {className?: string}) {
  return (
    <nav className={cn("flex-none w-full underline hover:opacity-70", className)}>
      <Link href="/blog" legacyBehavior passHref>
        blog
      </Link>
    </nav>
  );
}
