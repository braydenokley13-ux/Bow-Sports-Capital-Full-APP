import { ArrowUpRight, Flame, TrendingUp, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getLeaderboard, getRoster, getUpcomingEvents } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export const metadata = { title: "Admin overview" };

export default async function AdminOverview() {
  const roster = await getRoster();
  const leaderboard = await getLeaderboard();
  const events = await getUpcomingEvents();

  const activeStudents = roster.filter((r) => r.risk !== "high").length;
  const atRisk = roster.filter((r) => r.risk === "high").length;
  const totalXp = roster.reduce((a, r) => a + r.xp, 0);
  const avgXp = Math.round(totalXp / Math.max(1, roster.length));

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="font-display text-4xl font-bold text-white">Admin overview</h1>
        <p className="mt-1 text-white/60">Everything you need to run the program.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat icon={Users} label="Active students" value={activeStudents.toString()} delta="+4 this week" />
        <Stat icon={TrendingUp} label="Avg XP / student" value={formatNumber(avgXp)} delta="+12%" />
        <Stat icon={Zap} label="Total XP awarded" value={formatNumber(totalXp)} delta="+38k this week" />
        <Stat icon={Flame} label="At-risk students" value={atRisk.toString()} delta="-1 since last week" danger={atRisk > 0} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h2 className="font-display text-lg font-semibold text-white">Top 10 this season</h2>
          <div className="mt-4 divide-y divide-white/5">
            {leaderboard.slice(0, 10).map((r) => (
              <div key={r.userId} className="flex items-center gap-3 py-2">
                <div className="w-8 text-xs font-bold text-white/60 number-tabular">#{r.rank}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">{r.displayName}</div>
                  <div className="text-xs text-white/50">
                    Lv {r.level} · {r.levelTitle}
                  </div>
                </div>
                <div className="text-sm font-semibold text-white number-tabular">
                  {formatNumber(r.xp)}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-lg font-semibold text-white">Upcoming</h2>
          <div className="mt-4 space-y-3">
            {events.map((e) => (
              <div key={e.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="text-xs text-white/50">
                  {new Date(e.openAt).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="font-semibold text-white">{e.title}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  delta,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta?: string;
  danger?: boolean;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${danger ? "bg-rose-500/15 text-rose-300" : "bg-primary/15 text-primary"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
          <div className="font-display text-2xl font-bold text-white number-tabular">{value}</div>
        </div>
      </div>
      {delta ? (
        <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-white/60">
          <ArrowUpRight className="h-3 w-3" /> {delta}
        </div>
      ) : null}
    </Card>
  );
}
