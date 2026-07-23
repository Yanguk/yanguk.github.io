"use client";

import { usePathname } from "next/navigation";
import CustomLink from "@/app/_components/Link";
import { ThemeToggle } from "@/app/_components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { siteMetadata } from "@/site-meta-data";

export default function Header() {
  const pathname = usePathname();
  const curNav = pathname.slice(1).split("/").shift();

  const menus = [
    { href: "/", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div
      id="header"
      className="flex flex-col gap-5 border-border/60 border-b pb-2 md:border-r md:border-b-0 md:pr-8"
    >
      <Avatar
        className="mb-3 size-10 after:border-none"
        render={
          <CustomLink href="/" aria-label={siteMetadata.headerTitle}>
            <AvatarFallback className="bg-foreground font-backyard text-background">
              YU
            </AvatarFallback>
          </CustomLink>
        }
      ></Avatar>

      <div className="flex items-center justify-between gap-5 md:w-12 md:flex-col md:items-start">
        <div className="flex gap-5 md:flex-col">
          {menus.map((item) => (
            <CustomLink
              key={item.href}
              href={item.href}
              className={cn(
                "font-medium text-foreground hover:text-highlight hover:opacity-80",
                curNav === item.href.slice(1) && "font-bold text-highlight",
              )}
            >
              {item.label}
            </CustomLink>
          ))}
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
}
