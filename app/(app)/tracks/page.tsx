import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllLessons, getModulesForTrack, getTracks, getLessonProgress, getProfile } from "@/lib/data";
import { pct } from "@/lib/utils";

export const metadata = { title: "Tracks" };

export default async function TracksPage() {
  const tracks = await getTracks();
  const allLessons = await getAllLessons();
  const profile = await getProfile();
  const progress = await getLessonProgress(profile.userId);
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));

  // Determine which track was most recently active
  const recentCompletedLesson = progress
    .filter((p) => p.completed && p.submittedAt)
    .sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime())[0];

  const trackData = await Promise.all(
    tracks.map(async (t) => {
      const modules = await getModulesForTrack(t.id);
      const lessons = allLessons.filter((l) => modules.some((m) => m.id === l.moduleId));
      const completed = lessons.filter((l) => completedIds.has(l.id)).length;

      // Check if the most-recently-touched lesson belongs to this track
      const isCurrent = recentCompletedLesson
        ? lessons.some((l) => l.id === recentCompletedLesson.lessonId)
        : false;

      // Top 3 modules as a teaser
      const topModules = modules.slice(0, 3);

      return { ...t, modules, totalLessons: lessons.length, completed, isCurrent, topModules };
    }),
  );

  // Hero stats — totals across all tracks
  const totalLessons = trackData.reduce((s, t) => s + t.totalLessons, 0);
  const totalModules = trackData.reduce((s, t) => s + t.modules.length, 0);
  const totalXp = allLessons.reduce((s, l) => s + l.xpValue, 0);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero band */}
      <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-10 md:px-10 md:py-14">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #2563eb 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)" }}
        />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
            <BookOpen className="h-3.5 w-3.5" /> Curriculum
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
            Three ladders.{" "}
            <span className="text-gradient">One path to the front office.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-white/60">
            Each track builds on the last — foundations first, then strategy, then the suite.
            Complete all three and you&apos;ll think like an owner.
          </p>

          {/* Stat chips */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="stat-chip">
              <BookOpen className="h-3.5 w-3.5 text-bsc-sky" />
              <span className="number-tabular font-semibold text-white">{totalLessons}</span>
              <span className="text-white/50">lessons</span>
            </span>
            <span className="stat-chip">
              <Layers className="h-3.5 w-3.5 text-bsc-sky" />
              <span className="number-tabular font-semibold text-white">{totalModules}</span>
              <span className="text-white/50">modules</span>
            </span>
            <span className="stat-chip">
              <Zap className="h-3.5 w-3.5 text-bsc-gold" />
              <span className="number-tabular font-semibold text-white">{totalXp.toLocaleString()}</span>
              <span className="text-white/50">XP available</span>
            </span>
          </div>
        </div>
      </section>

      {/* Track grid */}
      <div className="grid gap-5 md:grid-cols-3">
        {trackData.map((t) => {
          const progressPct = pct(t.completed, t.totalLessons);
          return (
            <Link
              key={t.id}
              href={`/tracks/${t.code}`}
              className="group block transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-2xl"
            >
              <Card
                className="relative flex h-full flex-col overflow-hidden transition-shadow duration-200 group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_50px_-20px_rgba(0,0,0,0.9)]"
              >
                {/* Accent gradient strip at the top */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${t.accentColor}cc, ${t.accentColor}33)` }}
                />

                {/* Background glow */}
                <div
                  className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 opacity-10 blur-3xl transition-opacity duration-300 group-hover:opacity-20"
                  style={{ background: t.accentColor }}
                />

                <div className="relative flex flex-1 flex-col pt-2">
                  {/* Track code + "Currently in" badge */}
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="font-display tracking-widest">
                      TRACK {t.code}
                    </Badge>
                    {t.isCurrent && (
                      <Badge
                        className="shrink-0 text-[10px] font-semibold"
                        style={{
                          borderColor: `${t.accentColor}60`,
                          backgroundColor: `${t.accentColor}18`,
                          color: t.accentColor,
                        }}
                      >
                        Currently in
                      </Badge>
                    )}
                  </div>

                  <h2 className="mt-4 font-display text-2xl font-bold text-white">{t.name}</h2>
                  <p className="mt-2 flex-1 text-sm text-white/55">{t.description}</p>

                  {/* Module teaser list */}
                  <div className="mt-5 space-y-1.5">
                    {t.topModules.map((mod, i) => (
                      <div
                        key={mod.id}
                        className="flex items-center gap-2 text-xs text-white/45"
                      >
                        <span
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                          style={{ background: `${t.accentColor}25`, color: t.accentColor }}
                        >
                          {i + 1}
                        </span>
                        <span className="truncate">{mod.title}</span>
                      </div>
                    ))}
                    {t.modules.length > 3 && (
                      <div className="pl-6 text-xs text-white/30">
                        +{t.modules.length - 3} more modules
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <span
                        className="number-tabular text-2xl font-bold"
                        style={{ color: progressPct > 0 ? t.accentColor : "rgba(255,255,255,0.2)" }}
                      >
                        {progressPct}%
                      </span>
                      <span className="number-tabular text-xs text-white/40">
                        {t.completed}/{t.totalLessons} lessons
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progressPct}%`,
                          background: `linear-gradient(90deg, ${t.accentColor}, ${t.accentColor}80)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    asChild={false}
                    variant="outline"
                    className="pointer-events-none mt-5 w-full"
                    tabIndex={-1}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Open <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
