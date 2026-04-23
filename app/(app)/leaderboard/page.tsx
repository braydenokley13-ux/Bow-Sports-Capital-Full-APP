import { Flame, Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLeaderboard, getProfile } from "@/lib/data";
import { cn, formatNumber, initials } from "@/lib/utils";

export const metadata = { title: "Leaderboard" };

export default async function LeaderboardPage() {
  const profile = await getProfile();
  const rows = await getLeaderboard();

  const myRow = rows.find((r) => r.userId === profile.userId);

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
            <Trophy className="h-3.5 w-3.5 text-amber-300" /> Global leaderboard
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-white">Leaderboard</h1>
          <p className="mt-1 text-white/60">Top 50 updates live. Climb the ladder.</p>
        </div>
        {myRow ? (
          <Card className="hidden w-64 !p-4 md:block">
            <div className="text-xs uppercase tracking-wide text-white/50">Your rank</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-gradient number-tabular">
                #{myRow.rank}
              </span>
              <span className="text-xs text-white/50">of {rows.length}</span>
            </div>
          </Card>
        ) : null}
      </header>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All tracks</TabsTrigger>
          <TabsTrigger value="101">101</TabsTrigger>
          <TabsTrigger value="201">201</TabsTrigger>
          <TabsTrigger value="301">301</TabsTrigger>
          <TabsTrigger value="season">This season</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <LeaderboardTable rows={rows} currentUserId={profile.userId} />
        </TabsContent>
        <TabsContent value="101">
          <LeaderboardTable rows={rows} currentUserId={profile.userId} />
        </TabsContent>
        <TabsContent value="201">
          <LeaderboardTable rows={rows} currentUserId={profile.userId} />
        </TabsContent>
        <TabsContent value="301">
          <LeaderboardTable rows={rows} currentUserId={profile.userId} />
        </TabsContent>
        <TabsContent value="season">
          <LeaderboardTable rows={rows} currentUserId={profile.userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeaderboardTable({
  rows,
  currentUserId,
}: {
  rows: Awaited<ReturnType<typeof getLeaderboard>>;
  currentUserId: string;
}) {
  const [top3, rest] = [rows.slice(0, 3), rows.slice(3)];
  const podium = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        {podium.map((r, idx) => {
          const place = r.rank;
          const color =
            place === 1
              ? "from-amber-300 to-amber-500"
              : place === 2
                ? "from-slate-300 to-slate-500"
                : "from-orange-500 to-orange-700";
          return (
            <Card key={r.userId} className={cn("relative overflow-hidden", idx === 1 && "md:scale-105")}>
              <div
                className={`pointer-events-none absolute -inset-x-10 -top-20 h-40 bg-gradient-to-b ${color} opacity-20 blur-3xl`}
              />
              <div className="relative flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-lg font-black text-white shadow-glow`}
                >
                  {place}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-lg font-semibold text-white">
                    {r.displayName}
                  </div>
                  <div className="text-xs text-white/60">
                    Lv {r.level} · {r.levelTitle}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl font-bold text-white number-tabular">
                    {formatNumber(r.xp)}
                  </div>
                  <div className="text-[11px] text-white/50">XP</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="!p-0">
        <div className="divide-y divide-white/5">
          {rest.map((r) => (
            <div
              key={r.userId}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]",
                r.userId === currentUserId && "bg-primary/10 hover:bg-primary/10",
              )}
            >
              <div className="w-10 text-center text-sm font-bold text-white/60 number-tabular">
                #{r.rank}
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-bsc-deep to-bsc-blue text-xs font-semibold text-white">
                {initials(r.displayName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{r.displayName}</div>
                <div className="text-xs text-white/50">
                  Lv {r.level} · {r.levelTitle}
                </div>
              </div>
              <Badge variant="outline" className="hidden md:inline-flex">
                <Flame className="h-3 w-3 text-orange-400" />
                <span className="number-tabular">{r.streakDays}</span>
              </Badge>
              <div className="flex items-center gap-1 text-sm font-semibold text-white number-tabular">
                <Zap className="h-3.5 w-3.5 text-primary" />
                {formatNumber(r.xp)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
