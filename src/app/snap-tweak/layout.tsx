import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="m-auto size-full max-w-screen-md relative">{children}</div>
  );
}
