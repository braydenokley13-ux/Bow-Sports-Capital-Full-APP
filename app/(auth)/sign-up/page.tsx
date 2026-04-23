import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <div className="glass-panel p-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Free to start
      </div>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">Start your first season.</h1>
      <p className="mt-2 text-sm text-white/60">
        Create an account to earn XP, track progress, and claim credentials.
      </p>

      <form action="/dashboard" className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" name="name" placeholder="e.g. Rafael M." required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@school.edu" required />
        </div>
        <Button type="submit" className="w-full">
          <Mail className="h-4 w-4" /> Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/60">
        Already here?{" "}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>

      <p className="mt-6 text-center text-[11px] text-white/40">
        By continuing, you agree to the Bow Sports Capital terms and acknowledge our privacy policy.
      </p>
    </div>
  );
}
