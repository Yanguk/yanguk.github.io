import { HomeNavigationMenu } from "@/section/home-nav";

export default function Home() {
  return (
    <main className="m-auto max-w-lg flex flex-col min-h-screen py-10">
      <HomeNavigationMenu className="mb-4" />

      <h1 className="font-bold text-lg mb-4">Yanguk</h1>

      <div className='space-y-2'>
        <section>
          <p>Full-stack Web Developer</p>
        </section>

        <section>
          <p>준비중 입니다...</p>
        </section>
      </div>
    </main>
  );
}
