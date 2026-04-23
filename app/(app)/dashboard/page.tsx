import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  Headphones,
  Presentation,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XPBar } from "@/components/xp/XPBar";
import { SpotifyPlayer } from "@/components/lesson/SpotifyPlayer";
import {
  getAnnouncements,
  getAllLessons,
  getLessonProgress,
  getModulesForTrack,
  getNextLesson,
  getProfile,
  getTracks,
} from "@/lib/data";
import { pct } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await getProfile();
  const next = await getNextLesson(profile.userId);
  const lessonProgress = await getLessonProgress(profile.userId);
  const announcements = await getAnnouncements();
  const tracks = await getTracks();
  const allLessons = await getAllLessons();

  const firstName = profile.displayName.split(" ")[0];
  const completedIds = new Set(lessonProgress.filter((p) => p.completed).map((p) => p.lessonId));
  const completedCount = completedIds.size;

  const trackData = await Promise.all(
    tracks.map(async (t) => {
      const modules = await getModulesForTrack(t.id);
      const lessons = allLessons.filter((l) => modules.some((m) => m.id === l.moduleId));
      const completed = lessons.filter((l) => completedIds.has(l.id)).length;
      return { ...t, totalLessons: lessons.length, completed };
    }),
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── Hero ──────────────────────────────────────────── */}
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
              Welcome to Bow Sports Capital — where you learn the business of sports from the
              front-office perspective.{" "}
              {completedCount > 0 ? (
                <>
                  You have completed{" "}
                  <span className="font-semibold text-white">{completedCount} lesson{completedCount !== 1 ? "s" : ""}</span>{" "}
                  and counting.
                </>
              ) : (
                <>Your first lesson is waiting below.</>
              )}
            </p>
            <div className="mt-6 max-w-xl">
              <XPBar xp={profile.xp} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {next ? (
                <Button asChild size="lg">
                  <Link href={`/lesson/${next.code}`}>
                    Resume: {next.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg">
                  <Link href="/tracks">
                    Browse tracks <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg">
                <Link href="/tracks">Browse tracks</Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* On Deck */}
        <OnDeckCard lesson={next} />
      </section>

      {/* ── Announcements ─────────────────────────────────── */}
      {announcements.length > 0 ? (
        <div className="glass-panel flex items-start gap-4 p-5">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">{announcements[0].title}</div>
            <div className="mt-0.5 text-sm text-white/70">{announcements[0].body}</div>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0">
            Got it
          </Button>
        </div>
      ) : null}

      {/* ── Your tracks ───────────────────────────────────── */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Your tracks</h2>
            <p className="mt-1 text-sm text-white/60">
              Three paths. One front office. Pick up where you left off.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/tracks">
              All tracks <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {trackData.map((t) => {
            const progressPct = pct(t.completed, t.totalLessons);
            return (
              <Card key={t.id} className="relative overflow-hidden">
                <div
                  className="pointer-events-none absolute -top-20 left-0 h-40 w-full opacity-25 blur-3xl"
                  style={{ background: t.accentColor }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-display tracking-widest">
                      TRACK {t.code}
                    </Badge>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: t.accentColor,
                        boxShadow: `0 0 10px ${t.accentColor}`,
                      }}
                    />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{t.name}</h3>
                  <p className="mt-2 text-sm text-white/60 line-clamp-2">{t.description}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="number-tabular">
                        {t.completed}/{t.totalLessons} lessons
                      </span>
                      <span className="number-tabular">{progressPct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPct}%`,
                          background: `linear-gradient(90deg, ${t.accentColor}, #ffffff50)`,
                        }}
                      />
                    </div>
                  </div>

                  <Button asChild variant="outline" className="mt-5 w-full">
                    <Link href={`/tracks/${t.code}`}>
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── The podcast ───────────────────────────────────── */}
      <section>
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#1db954]/20 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1db954]/20">
                  <Headphones className="h-4 w-4 text-[#1db954]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Podcast
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-white">
                The Bow Sports Capital Podcast
              </h2>
              <p className="mt-2 max-w-lg text-sm text-white/65">
                Listen as you learn. Every lesson is paired with an episode that breaks down the
                front-office concepts in conversation — perfect for your commute or warmup.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">
                  <BookOpen className="h-3.5 w-3.5" /> Open on Spotify
                </Link>
              </Button>
            </div>
            <div className="w-full lg:w-[340px]">
              <PodcastWidget />
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

// ── On Deck card ─────────────────────────────────────────────────────────────

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
            You have completed every published lesson. Check back soon for the next drop.
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
          {lesson.difficulty ? (
            <Badge variant={lesson.difficulty === "Hard" ? "warning" : "secondary"}>
              {lesson.difficulty}
            </Badge>
          ) : null}
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

// ── Podcast widget ────────────────────────────────────────────────────────────
// No show URL yet — render a placeholder. Swap the constant below for a real
// Spotify show URL (open.spotify.com/show/…) when available.

const SPOTIFY_SHOW_URL = "";

function PodcastWidget() {
  if (SPOTIFY_SHOW_URL) {
    return <SpotifyPlayer embedUrl={SPOTIFY_SHOW_URL} title="Bow Sports Capital Podcast" />;
  }
  return (
    <div className="glass-panel flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1db954]/10">
        <Headphones className="h-6 w-6 text-[#1db954]" />
      </div>
      <div className="text-sm font-semibold text-white">Coming soon</div>
      <p className="text-xs text-white/50">
        The show is in production. Episodes will appear here when published.
      </p>
    </div>
  );
}
