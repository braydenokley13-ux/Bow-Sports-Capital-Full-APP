import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getRoster } from "@/lib/data";
import { formatNumber, initials, relativeTime } from "@/lib/utils";

export const metadata = { title: "Students" };

export default async function StudentsPage() {
  const roster = await getRoster();

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-display text-4xl font-bold text-white">Students</h1>
        <p className="mt-1 text-white/60">{roster.length} enrolled · sorted by lifetime XP.</p>
      </header>

      <Card className="!p-0">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] border-b border-white/5 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-white/50">
          <div>Student</div>
          <div>XP</div>
          <div>Level</div>
          <div>Streak</div>
          <div>Last active</div>
        </div>
        <div className="divide-y divide-white/5">
          {roster.map((r) => (
            <div
              key={r.userId}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center gap-2 px-4 py-3 hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-bsc-deep to-bsc-blue text-xs font-semibold text-white">
                  {initials(r.displayName)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{r.displayName}</div>
                  <div className="truncate text-xs text-white/50">{r.email}</div>
                </div>
                {r.risk === "high" ? (
                  <Badge variant="danger">At risk</Badge>
                ) : r.risk === "medium" ? (
                  <Badge variant="warning">Watch</Badge>
                ) : null}
              </div>
              <div className="text-sm font-semibold text-white number-tabular">
                {formatNumber(r.xp)}
              </div>
              <div className="text-sm text-white/70 number-tabular">Lv {r.level}</div>
              <div className="text-sm text-white/70 number-tabular">{r.streakDays}d</div>
              <div className="text-xs text-white/50">{relativeTime(r.lastActive)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
