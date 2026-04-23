import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { GradientOrbs } from "@/components/brand/GradientOrbs";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <GradientOrbs />
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/">
          <Logo />
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          ← Back to home
        </Link>
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}
