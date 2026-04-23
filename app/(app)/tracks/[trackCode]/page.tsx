import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Gamepad2,
  Headphones,
  Layers,
  Presentation,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAllLessons,
  getLessonProgress,
  getLessonsForModule,
  getModulesForTrack,
  getProfile,
  getTrackByCode,
} from "@/lib/data";
import type { TrackCode } from "@/lib/data/types";
import { pct } from "@/lib/utils";

type Params = Promise<{ trackCode: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { trackCode } = await params;
  return { title: `Track ${trackCode}` };
}

export default async function TrackPage({ params }: { params: Params }) {
  const { trackCode } = await params;
  if (!["101", "201", "301"].includes(trackCode)) return notFound();

  const track = await getTrackByCode(trackCode as TrackCode);
  if (!track) return notFound();

  const modules = await getModulesForTrack(track.id);
  const allLessons = await getAllLessons();
  const profile = await getProfile();
  const progress = await getLessonProgress(profile.userId);
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));

  const moduleData = await Promise.all(
    modules.map(async (m) => {
      const lessons = await getLessonsForModule(m.id);
      return { ...m, lessons };
    }),
  );

  // Header stats
  const totalModules = modules.length;
  const allTrackLessons = allLessons.filter((l) =>
    modules.some((m) => m.id === l.moduleId),
  );
  const totalLessons = allTrackLessons.length;
  const sumXp = allTrackLessons.reduce((s, l) => s + l.xpValue, 0);

  // Continue: first uncompleted lesson in this track (in module/lesson sort order)
  const nextLesson = allTrackLessons.find((l) => !completedIds.has(l.id)) ?? null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-8 md:px-10">
        {/* Accent glow */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-15 blur-3xl"
          style={{ background: track.accentColor }}
        />

        <div className="relative">
          <Link href="/tracks" className="text-xs text-white/40 transition-colors hover:text-white/70">
            ← All tracks
          </Link>

          <div className="mt-3 flex items-center gap-3">
            <Badge variant="outline" className="font-display tracking-widest">
              TRACK {track.code}
            </Badge>
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: track.accentColor,
                boxShadow: `0 0 14px ${track.accentColor}`,
              }}
            />
          </div>

          <h1
            className="mt-3 font-display text-4xl font-bold md:text-5xl"
            style={{
              background: `linear-gradient(135deg, #ffffff 40%, ${track.accentColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {track.name}
          </h1>
          <p className="mt-2 max-w-3xl text-white/60">{track.description}</p>

          {/* Stat chips */}
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="stat-chip">
              <Layers className="h-3.5 w-3.5" style={{ color: track.accentColor }} />
              <span className="number-tabular font-semibold text-white">{totalModules}</span>
              <span className="text-white/50">modules</span>
            </span>
            <span className="stat-chip">
              <BookOpen className="h-3.5 w-3.5" style={{ color: track.accentColor }} />
              <span className="number-tabular font-semibold text-white">{totalLessons}</span>
              <span className="text-white/50">lessons</span>
            </span>
            <span className="stat-chip">
              <Zap className="h-3.5 w-3.5 text-bsc-gold" />
              <span className="number-tabular font-semibold text-white">{sumXp.toLocaleString()}</span>
              <span className="text-white/50">XP available</span>
            </span>
          </div>

          {/* Continue button */}
          {nextLesson && (
            <div className="mt-6">
              <Button asChild className="btn-gradient border-0 text-white">
                <Link href={`/lesson/${nextLesson.code}`}>
                  Continue — {nextLesson.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Modules list */}
      <div className="space-y-5">
        {moduleData.map((m, moduleIdx) => {
          const completedCount = m.lessons.filter((l) => completedIds.has(l.id)).length;
          const progressPct = pct(completedCount, m.lessons.length);

          const moduleStatus: "COMPLETE" | "IN_PROGRESS" | "NOT_STARTED" =
            completedCount === m.lessons.length && m.lessons.length > 0
              ? "COMPLETE"
              : completedCount > 0
                ? "IN_PROGRESS"
                : "NOT_STARTED";

          const ringStyle =
            moduleStatus === "COMPLETE"
              ? { boxShadow: "0 0 0 1px rgba(52,211,153,0.35)" }
              : moduleStatus === "IN_PROGRESS"
                ? { boxShadow: `0 0 0 1px ${track.accentColor}40` }
                : {};

          return (
            <Card key={m.id} style={ringStyle}>
              {/* Module header */}
              <div className="flex flex-col gap-4 pb-5 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
                      Module {moduleIdx + 1} · {m.code}
                    </span>
                    {moduleStatus === "COMPLETE" && (
                      <Badge variant="success" className="text-[10px]">
                        COMPLETE
                      </Badge>
                    )}
                    {moduleStatus === "IN_PROGRESS" && (
                      <Badge variant="default" className="text-[10px]">
                        IN PROGRESS
                      </Badge>
                    )}
                    {moduleStatus === "NOT_STARTED" && (
                      <Badge variant="secondary" className="text-[10px]">
                        NOT STARTED
                      </Badge>
                    )}
                  </div>
                  <h2 className="mt-1.5 font-display text-xl font-bold text-white md:text-2xl">
                    {m.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/55">{m.description}</p>
                </div>

                {/* Progress mini-bar */}
                <div className="shrink-0 md:w-48">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span className="number-tabular">
                      {completedCount}/{m.lessons.length} lessons
                    </span>
                    <span className="number-tabular">{progressPct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPct}%`,
                        background:
                          moduleStatus === "COMPLETE"
                            ? "linear-gradient(90deg, #34d399, #6ee7b7)"
                            : `linear-gradient(90deg, ${track.accentColor}, ${track.accentColor}80)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Lessons list */}
              <div className="grid gap-1.5">
                {m.lessons.map((lesson) => {
                  const done = completedIds.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.code}`}
                      className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 transition-all hover:border-white/10 hover:bg-white/[0.05]"
                    >
                      {/* Completion circle */}
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-white/25" />
                      )}

                      {/* Main content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] text-white/35">{lesson.code}</span>
                          {lesson.difficulty ? (
                            <Badge
                              variant={
                                lesson.difficulty === "Hard"
                                  ? "warning"
                                  : lesson.difficulty === "Medium"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-[10px]"
                            >
                              {lesson.difficulty}
                            </Badge>
                          ) : null}
                        </div>
                        <div className="mt-0.5 font-medium text-white/90 group-hover:text-white">
                          {lesson.title}
                        </div>
                        <div className="mt-0.5 text-xs text-white/45 leading-snug">{lesson.summary}</div>
                      </div>

                      {/* Content-type chips */}
                      <div className="hidden shrink-0 items-center gap-1.5 text-white/35 md:flex">
                        {lesson.slidePdfUrl ? (
                          <Presentation className="h-3.5 w-3.5" aria-label="Slides" />
                        ) : null}
                        {lesson.spotifyEpisodeUrl ? (
                          <Headphones className="h-3.5 w-3.5" aria-label="Podcast" />
                        ) : null}
                        {lesson.activityUrl ? (
                          <Gamepad2 className="h-3.5 w-3.5" aria-label="Activity" />
                        ) : null}
                      </div>

                      {/* XP badge */}
                      <Badge variant="outline" className="number-tabular shrink-0 text-[11px]">
                        +{lesson.xpValue} XP
                      </Badge>

                      {/* Arrow + hover hint */}
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="hidden text-[11px] text-white/0 transition-colors duration-150 group-hover:text-white/50 md:inline">
                          Start lesson
                        </span>
                        <ArrowRight className="h-4 w-4 text-white/30 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-white/60" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
