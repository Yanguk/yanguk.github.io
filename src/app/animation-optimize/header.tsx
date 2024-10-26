"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function Header() {
  const pathname = usePathname();

  const paths = pathname.split("/");
  const page = parseInt(paths.pop() ?? "0");
  const curPath = paths.join("/");

  const nextPage = `${curPath}/${page + 1}`;
  const prevPage = page === 1 ? curPath.slice(0, -5) : `${curPath}/${page - 1}`;

  return (
    <div className="flex flex-row justify-between w-full items-center border-b-black border">
      <Button asChild>
        <Link href={prevPage}>{"<"}</Link>
      </Button>
      <h1>title</h1>
      <Button asChild>
        <Link href={nextPage}>{">"}</Link>
      </Button>
    </div>
  );
}
