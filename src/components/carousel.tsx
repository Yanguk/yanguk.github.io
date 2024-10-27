import { PropsWithChildren } from "react";

export function Root({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>;
}

export function Content({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function Item({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function Previous() {
  return null;
}

export function Next() {
  return null;
}
