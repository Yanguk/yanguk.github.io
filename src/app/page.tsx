import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>환영 합니다.</h1>

      <div className="flex flex-col w-64 space-y-4">
        <Button>
          <Link href="/snap-tweak/poc">go To pixi</Link>
        </Button>
        <Button>
          <Link href="/animation-optimize">go To anime</Link>
        </Button>
      </div>
    </div>
  );
}
