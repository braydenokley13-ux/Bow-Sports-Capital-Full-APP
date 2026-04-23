import Link from "next/link";
import { ArrowRight, BookOpen, Dot } from "lucide-react";
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

  const trackData = await Promise.all(
    tracks.map(async (t) => {
      const modules = await getModulesForTrack(t.id);
      const lessons = allLessons.filter((l) => modules.some((m) => m.id === l.moduleId));
      const completed = lessons.filter((l) => completedIds.has(l.id)).length;
      return { ...t, modules, totalLessons: lessons.length, completed };
    }),
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
          <BookOpen className="h-3.5 w-3.5" /> Three ladders
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Tracks</h1>
        <p className="mt-2 max-w-2xl text-white/70">
          Each track is a self-contained path through the front office. Complete modules to earn
          credentials that stack across the platform.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        {trackData.map((t) => {
          const progressPct = pct(t.completed, t.totalLessons);
          return (
            <Card key={t.id} className="relative overflow-hidden">
              <div
                className="pointer-events-none absolute -top-24 left-0 h-48 w-full opacity-30 blur-3xl"
                style={{ background: t.accentColor }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-display tracking-widest">
                    TRACK {t.code}
                  </Badge>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: t.accentColor, boxShadow: `0 0 14px ${t.accentColor}` }}
                  />
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-white">{t.name}</h2>
                <p className="mt-2 text-sm text-white/60">{t.description}</p>

                <div className="mt-5 flex items-center gap-2 text-xs text-white/50">
                  <span>{t.modules.length} modules</span>
                  <Dot className="h-3 w-3" />
                  <span>{t.totalLessons} lessons</span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="number-tabular">
                      {t.completed}/{t.totalLessons} complete
                    </span>
                    <span className="number-tabular">{progressPct}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full"
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
    </div>
  );
}
