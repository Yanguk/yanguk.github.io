import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>환영 합니다.</h1>

      <div className="flex flex-col w-64 space-y-4">
        <Button asChild>
          <Link href="/snap-tweak/poc">go To pixi</Link>
        </Button>
        <Button asChild>
          <Link href="/animation-optimize">go To anime</Link>
        </Button>

        <Button asChild>
          <Link href="/context">go To context</Link>
        </Button>

        <Button asChild>
          <Link href="/custom-context">go To custom-context</Link>
        </Button>
      </div>
    </div>
  );
}
