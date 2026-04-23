import { Crown, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPods } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export const metadata = { title: "Pods" };

export default async function PodsPage() {
  const pods = await getPods();

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
            <Users className="h-3.5 w-3.5 text-primary" /> Pods
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-white">Pods</h1>
          <p className="mt-1 text-white/60">
            Small teams competing for the season pod title. XP pools, weekly standings.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Create pod
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pods.map((p, idx) => (
          <Card key={p.id} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl ring-1 ring-white/10">
                  {p.emoji ?? "🏆"}
                </div>
                <div>
                  <div className="font-display text-lg font-semibold text-white">{p.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-white/60">
                    <Users className="h-3 w-3" /> {p.memberCount} members
                  </div>
                </div>
              </div>
              {idx === 0 ? (
                <Badge variant="gold">
                  <Crown className="h-3 w-3" /> #1
                </Badge>
              ) : (
                <Badge variant="outline">#{p.ranking ?? idx + 1}</Badge>
              )}
            </div>
            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="text-xs uppercase tracking-wide text-white/50">Total pod XP</div>
              <div className="mt-1 font-display text-2xl font-bold text-white number-tabular">
                {formatNumber(p.totalXp)}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View pod
              </Button>
              <Button size="sm" className="flex-1">
                Join
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
