import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Flame, User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LessonView } from "@/components/lesson/LessonView";
import { getAllLessons, getLessonByCode, getProfile } from "@/lib/data";
import { cn } from "@/lib/utils";

type Params = Promise<{ lessonCode: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { lessonCode } = await params;
  const lesson = await getLessonByCode(lessonCode);
  return { title: lesson?.title ?? lessonCode };
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  Hard: "border-red-500/30 bg-red-500/10 text-red-400",
};

export default async function LessonPage({ params }: { params: Params }) {
  const { lessonCode } = await params;
  const lesson = await getLessonByCode(lessonCode);
  if (!lesson) return notFound();
  const profile = await getProfile();

  const allLessons = await getAllLessons();
  const [trackCode] = lesson.code.replace("T", "").split("-");

  const nextLesson = lesson.nextLessonId
    ? allLessons.find((l) => l.id === lesson.nextLessonId)
    : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Page header ───────────────────────────────────────── */}
      <header className="relative flex items-start justify-between gap-6">
        {/* Soft ambient glow behind header */}
        <div className="pointer-events-none absolute -left-8 -top-8 h-48 w-96 rounded-full bg-bsc-blue/10 blur-3xl" />

        <div className="relative space-y-3 min-w-0 flex-1">
          {/* Breadcrumb */}
          <Link
            href={`/tracks/${trackCode}`}
            className="inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white/70"
          >
            <ArrowLeft className="h-3 w-3" />
            Track {trackCode}
          </Link>

          {/* Chip row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-white/70">
              {lesson.code}
            </span>

            {lesson.difficulty ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                  DIFFICULTY_STYLES[lesson.difficulty] ?? "border-white/10 bg-white/5 text-white/60",
                )}
              >
                <Flame className="h-2.5 w-2.5" />
                {lesson.difficulty}
              </span>
            ) : null}

            {lesson.estimatedMinutes ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-white/50">
                <Clock className="h-2.5 w-2.5" />
                {lesson.estimatedMinutes} min
              </span>
            ) : null}

            {lesson.roleFocus ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-bsc-sky/25 bg-bsc-sky/10 px-2.5 py-0.5 text-[11px] font-medium text-bsc-sky">
                <User2 className="h-2.5 w-2.5" />
                {lesson.roleFocus}
              </span>
            ) : null}
          </div>

          {/* Title */}
          <div className="relative">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              {lesson.title}
            </h1>
            {/* Gradient underline accent */}
            <div className="mt-2 h-px w-24 rounded-full bg-gradient-to-r from-bsc-sky via-bsc-blue to-transparent" />
          </div>

          {/* Summary */}
          <p className="max-w-2xl text-sm leading-relaxed text-white/60">{lesson.summary}</p>
        </div>

        {/* Up-next card */}
        {nextLesson ? (
          <Link
            href={`/lesson/${nextLesson.code}`}
            className="group hidden shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-right transition hover:border-white/20 hover:bg-white/[0.06] md:block"
          >
            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
              Up next
            </div>
            <div className="mt-1 max-w-[220px] truncate font-medium text-white/80 group-hover:text-white">
              {nextLesson.title}
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-white/30">{nextLesson.code}</div>
          </Link>
        ) : null}
      </header>

      {/* ── Three-act lesson view ──────────────────────────────── */}
      <LessonView
        lesson={lesson}
        userEmail={profile.email}
        nextLesson={nextLesson ?? null}
      />
    </div>
  );
}
