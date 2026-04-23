import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="glass-panel p-8">
      <h1 className="font-display text-3xl font-bold text-white">Welcome back.</h1>
      <p className="mt-2 text-sm text-white/60">
        Sign in to continue building your front office.
      </p>

      <form action="/dashboard" className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@school.edu" required />
        </div>
        <Button type="submit" className="w-full">
          <Mail className="h-4 w-4" /> Send magic link
        </Button>
      </form>

      <div className="relative my-6 flex items-center">
        <span className="flex-1 border-t border-white/10" />
        <span className="mx-3 text-xs uppercase tracking-wide text-white/40">or</span>
        <span className="flex-1 border-t border-white/10" />
      </div>

      <Button variant="outline" className="w-full" asChild>
        <Link href="/dashboard">
          <GoogleMark /> Continue with Google
        </Link>
      </Button>

      <p className="mt-6 text-center text-sm text-white/60">
        New here?{" "}
        <Link href="/sign-up" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>

      <p className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center text-xs text-white/50">
        Demo mode: click any button to enter as a test student.
      </p>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <path
        fill="currentColor"
        d="M19.3 10.2c0-.7-.1-1.3-.2-1.9h-9v3.6h5.2c-.2 1.2-.9 2.2-1.9 2.9v2.4h3c1.8-1.6 2.9-4.1 2.9-7z"
      />
      <path
        fill="currentColor"
        opacity={0.8}
        d="M10.1 19.5c2.6 0 4.7-.9 6.3-2.3l-3-2.4c-.9.6-1.9 1-3.3 1-2.5 0-4.7-1.7-5.4-4H1.5v2.5c1.6 3.1 4.9 5.2 8.6 5.2z"
      />
      <path
        fill="currentColor"
        opacity={0.5}
        d="M4.6 11.8A6 6 0 0 1 4.3 10c0-.6.1-1.2.3-1.8V5.7H1.5A10 10 0 0 0 0 10c0 1.6.4 3.1 1 4.3l3.6-2.5z"
      />
      <path
        fill="currentColor"
        opacity={0.3}
        d="M10.1 4c1.4 0 2.7.5 3.7 1.4l2.7-2.7A10 10 0 0 0 10.1 0 10 10 0 0 0 1.5 5.7l3.6 2.5c.7-2.3 2.8-4 5.4-4z"
      />
    </svg>
  );
}
