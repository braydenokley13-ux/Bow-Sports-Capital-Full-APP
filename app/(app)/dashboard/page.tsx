import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Circle,
  Flame,
  Gamepad2,
  Headphones,
  Presentation,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XPBar } from "@/components/xp/XPBar";
import {
  getAnnouncements,
  getCurrentSeason,
  getLeaderboard,
  getLessonProgress,
  getNextLesson,
  getProfile,
  getQuests,
  getUpcomingEvents,
  recentClaims,
} from "@/lib/data";
import { formatNumber, relativeTime } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await getProfile();
  const next = await getNextLesson(profile.userId);
  const quests = await getQuests(profile.userId);
  const season = await getCurrentSeason();
  const events = await getUpcomingEvents();
  const leaderboard = await getLeaderboard();
  const lessonProgress = await getLessonProgress(profile.userId);
  const announcements = await getAnnouncements();
  const claims = await recentClaims(profile.userId);

  const firstName = profile.displayName.split(" ")[0];
  const completed = lessonProgress.filter((p) => p.completed).length;

  const seasonStart = new Date(season.startsAt).getTime();
  const seasonEnd = new Date(season.endsAt).getTime();
  const now = Date.now();
  const seasonPct = Math.max(
    0,
    Math.min(100, Math.round(((now - seasonStart) / (seasonEnd - seasonStart)) * 100)),
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero strip */}
      <section className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card className="relative overflow-hidden p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-bsc-blue/30 blur-3xl" />
          <div className="relative">
            <Badge variant="outline">
              <Sparkles className="h-3.5 w-3.5" /> Welcome back
            </Badge>
            <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
              Good to see you, {firstName}.
            </h1>
            <p className="mt-2 max-w-xl text-white/70">
              You've completed{" "}
              <span className="font-semibold text-white">{completed} lessons</span> and you're{" "}
              <span className="font-semibold text-white">{profile.levelTitle}</span>.
              Keep climbing.
            </p>
            <div className="mt-6 max-w-xl">
              <XPBar xp={profile.xp} />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {next ? (
                <Button asChild>
                  <Link href={`/lesson/${next.code}`}>
                    Resume: {next.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline">
                <Link href="/tracks">Browse tracks</Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* On Deck */}
        <OnDeckCard lesson={next} />
      </section>

      {/* Announcements */}
      {announcements.length > 0 ? (
        <div className="glass-panel flex items-start gap-4 p-5">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">{announcements[0].title}</div>
            <div className="text-sm text-white/70">{announcements[0].body}</div>
          </div>
          <Button variant="ghost" size="sm">
            Got it
          </Button>
        </div>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-3">
        {/* Daily quests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Daily quests
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/quests">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {quests.slice(0, 4).map((q) => (
              <div
                key={q.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                {q.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-white/30" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white">{q.title}</div>
                  <div className="text-xs text-white/50">{q.description}</div>
                </div>
                <Badge variant={q.completed ? "success" : "outline"}>+{q.rewardPoints} XP</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Streak + Season */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" /> Streak & season
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-xl border border-orange-400/20 bg-orange-400/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-3xl font-bold text-white number-tabular">
                    {profile.streakDays}
                  </div>
                  <div className="text-xs text-white/60">day streak</div>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-8 w-8 text-orange-400" />
                  {profile.streakShields > 0 ? (
                    <Badge variant="warning">
                      🛡 {profile.streakShields} shield{profile.streakShields > 1 ? "s" : ""}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">{season.title}</span>
                <span className="text-white/50 number-tabular">{seasonPct}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-bsc-sky to-bsc-blue"
                  style={{ width: `${seasonPct}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-white/40 number-tabular">
                <span>{new Date(season.startsAt).toLocaleDateString()}</span>
                <span>{new Date(season.endsAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-300" /> Leaderboard
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/leaderboard">
                Full <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboard.slice(0, 6).map((row) => (
              <div
                key={row.userId}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                  row.userId === profile.userId
                    ? "bg-primary/10 ring-1 ring-primary/30"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="w-6 text-xs font-bold text-white/60 number-tabular">
                  #{row.rank}
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                  {row.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">{row.displayName}</div>
                  <div className="text-xs text-white/50">Lv {row.level} · {row.levelTitle}</div>
                </div>
                <div className="text-sm font-semibold text-white number-tabular">
                  {formatNumber(row.xp)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Events + Recent XP */}
      <section className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" /> Upcoming events
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/events">
                All events <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {events.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <Badge variant={e.status === "LIVE" ? "success" : "outline"}>{e.status}</Badge>
                  <span className="text-xs text-white/50">
                    {new Date(e.openAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="mt-3 font-display text-lg font-semibold text-white">{e.title}</div>
                <div className="mt-1 text-sm text-white/60">{e.description}</div>
                {e.participants ? (
                  <div className="mt-3 text-xs text-white/50">
                    {e.participants} students signed up
                  </div>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Recent XP
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {claims.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white/80">
                    Lesson {c.lessonId.replace("l_", "").toUpperCase()}
                  </div>
                  <div className="text-[11px] text-white/40">{relativeTime(c.submittedAt)}</div>
                </div>
                <Badge variant="success" className="number-tabular">
                  +{c.xpAwarded}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function OnDeckCard({
  lesson,
}: {
  lesson: Awaited<ReturnType<typeof getNextLesson>>;
}) {
  if (!lesson) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All caught up</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/60">
            You've completed every published lesson. Watch the Events feed for the next drop.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -inset-24 bg-bsc-blue/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-display tracking-widest">
            ON DECK
          </Badge>
          <Badge variant={lesson.difficulty === "Hard" ? "warning" : "secondary"}>
            {lesson.difficulty}
          </Badge>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-white">{lesson.title}</h3>
        <p className="mt-2 text-sm text-white/60">{lesson.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/50">
          {lesson.slidePdfUrl ? (
            <span className="stat-chip">
              <Presentation className="h-3 w-3" /> Slides
            </span>
          ) : null}
          {lesson.spotifyEpisodeUrl ? (
            <span className="stat-chip">
              <Headphones className="h-3 w-3" /> Podcast
            </span>
          ) : null}
          {lesson.activityUrl ? (
            <span className="stat-chip">
              <Gamepad2 className="h-3 w-3" /> Activity
            </span>
          ) : null}
          {lesson.estimatedMinutes ? (
            <span className="stat-chip">{lesson.estimatedMinutes} min</span>
          ) : null}
        </div>
        <Button asChild className="mt-6 w-full">
          <Link href={`/lesson/${lesson.code}`}>
            Start lesson <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
