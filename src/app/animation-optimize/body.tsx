import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

export default function Body({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("p-2 w-full h-[calc(100%-2.5rem)]", className)}>
      {children}
    </div>
  );
}
