import Link from "next/link";
import { ArrowRight, Swords } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllLessons } from "@/lib/data";
import { GAUNTLET_XP } from "@/lib/xp";

export const metadata = { title: "The Gauntlet" };

export default async function GauntletPage() {
  const lessons = await getAllLessons();
  const levels = lessons.filter((l) => l.code.includes("M4-G"));

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
          <Swords className="h-3.5 w-3.5 text-primary" /> Mastery layer
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">The Gauntlet</h1>
        <p className="mt-2 max-w-2xl text-white/70">
          Three levels. Three tiers each: <span className="font-semibold text-amber-400">Bronze</span>,{" "}
          <span className="font-semibold text-slate-200">Silver</span>,{" "}
          <span className="font-semibold text-amber-300">Gold</span>. Only the biggest decisions
          unlock Gold.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {levels.map((l, idx) => {
          const n = idx + 1;
          const xp = GAUNTLET_XP[n];
          return (
            <Card key={l.id} className="relative overflow-hidden">
              <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="relative">
                <Badge variant="gold" className="font-display tracking-widest">
                  LEVEL {n}
                </Badge>
                <h2 className="mt-3 font-display text-2xl font-bold text-white">{l.title}</h2>
                <p className="mt-2 text-sm text-white/60">{l.summary}</p>
                {xp ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <TierChip label="Bronze" value={xp.BRONZE} variant="bronze" />
                    <TierChip label="Silver" value={xp.SILVER} variant="silver" />
                    <TierChip label="Gold" value={xp.GOLD} variant="gold" />
                  </div>
                ) : null}
                <Button asChild className="mt-5 w-full">
                  <Link href={`/lesson/${l.code}`}>
                    Enter <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TierChip({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "bronze" | "silver" | "gold";
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 text-center">
      <Badge variant={variant} className="w-full justify-center">
        {label}
      </Badge>
      <div className="mt-1 font-display text-sm font-bold text-white number-tabular">+{value}</div>
    </div>
  );
}
