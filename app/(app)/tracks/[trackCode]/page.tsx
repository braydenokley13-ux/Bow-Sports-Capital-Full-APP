import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Circle, Gamepad2, Headphones, Presentation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
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
  const profile = await getProfile();
  const progress = await getLessonProgress(profile.userId);
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));

  const moduleData = await Promise.all(
    modules.map(async (m) => {
      const lessons = await getLessonsForModule(m.id);
      return { ...m, lessons };
    }),
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <Link href="/tracks" className="text-xs text-white/50 hover:text-white">
          ← All tracks
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <Badge variant="outline" className="font-display tracking-widest">
            TRACK {track.code}
          </Badge>
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: track.accentColor, boxShadow: `0 0 14px ${track.accentColor}` }}
          />
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">{track.name}</h1>
        <p className="mt-2 max-w-3xl text-white/70">{track.description}</p>
      </header>

      <div className="space-y-5">
        {moduleData.map((m, moduleIdx) => {
          const completed = m.lessons.filter((l) => completedIds.has(l.id)).length;
          const progressPct = pct(completed, m.lessons.length);
          return (
            <Card key={m.id}>
              <div className="flex flex-col gap-1 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
                    Module {moduleIdx + 1} · {m.code}
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white">{m.title}</h2>
                  <p className="text-sm text-white/60">{m.description}</p>
                </div>
                <div className="flex items-center gap-2 md:w-56">
                  <div className="w-full">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="number-tabular">
                        {completed}/{m.lessons.length}
                      </span>
                      <span className="number-tabular">{progressPct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-bsc-sky to-bsc-blue"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                {m.lessons.map((lesson) => {
                  const done = completedIds.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.code}`}
                      className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-all hover:border-white/10 hover:bg-white/[0.04]"
                    >
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-white/30" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-white/40">{lesson.code}</span>
                          {lesson.difficulty ? (
                            <Badge
                              variant={
                                lesson.difficulty === "Hard"
                                  ? "warning"
                                  : lesson.difficulty === "Medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {lesson.difficulty}
                            </Badge>
                          ) : null}
                        </div>
                        <div className="mt-0.5 font-medium text-white group-hover:text-white">
                          {lesson.title}
                        </div>
                        <div className="mt-1 text-xs text-white/50">{lesson.summary}</div>
                      </div>
                      <div className="hidden items-center gap-1 text-[11px] text-white/40 md:flex">
                        {lesson.slidePdfUrl ? <Presentation className="h-3.5 w-3.5" /> : null}
                        {lesson.spotifyEpisodeUrl ? <Headphones className="h-3.5 w-3.5" /> : null}
                        {lesson.activityUrl ? <Gamepad2 className="h-3.5 w-3.5" /> : null}
                      </div>
                      <Badge variant="outline" className="number-tabular">
                        +{lesson.xpValue} XP
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1" />
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
