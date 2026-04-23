import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-bsc-navy/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/#program" className="text-sm font-medium text-white/70 hover:text-white">
              Program
            </Link>
            <Link href="/#tracks" className="text-sm font-medium text-white/70 hover:text-white">
              Tracks
            </Link>
            <Link href="/#podcast" className="text-sm font-medium text-white/70 hover:text-white">
              Podcast
            </Link>
            <Link href="/#parents" className="text-sm font-medium text-white/70 hover:text-white">
              For parents
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/5 bg-bsc-navy/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center">
          <div>
            <Logo />
            <p className="mt-3 max-w-md text-sm text-white/60">
              A sports-business education brand for the next generation of front-office thinkers.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-white/60 md:flex-row md:gap-8">
            <Link href="/sign-up" className="hover:text-white">Create account</Link>
            <Link href="/sign-in" className="hover:text-white">Sign in</Link>
            <Link href="/#podcast" className="hover:text-white">Podcast</Link>
            <a href="mailto:bowsportscapitalpodcast@outlook.com" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Bow Sports Capital. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
