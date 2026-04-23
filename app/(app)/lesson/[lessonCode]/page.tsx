import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LessonView } from "@/components/lesson/LessonView";
import { getAllLessons, getLessonByCode, getProfile } from "@/lib/data";

type Params = Promise<{ lessonCode: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { lessonCode } = await params;
  const lesson = await getLessonByCode(lessonCode);
  return { title: lesson?.title ?? lessonCode };
}

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
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Link
            href={`/tracks/${trackCode}`}
            className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Track {trackCode}
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {lesson.code}
            </Badge>
            {lesson.difficulty ? (
              <Badge variant={lesson.difficulty === "Hard" ? "warning" : "secondary"}>
                {lesson.difficulty}
              </Badge>
            ) : null}
            {lesson.estimatedMinutes ? (
              <Badge variant="secondary">{lesson.estimatedMinutes} min</Badge>
            ) : null}
          </div>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
            {lesson.title}
          </h1>
          <p className="max-w-3xl text-white/70">{lesson.summary}</p>
        </div>

        {nextLesson ? (
          <Link
            href={`/lesson/${nextLesson.code}`}
            className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs transition hover:bg-white/10 md:block"
          >
            <div className="text-white/50">Up next</div>
            <div className="mt-0.5 max-w-[220px] truncate font-medium text-white">
              {nextLesson.title}
            </div>
          </Link>
        ) : null}
      </header>

      <LessonView lesson={lesson} userEmail={profile.email} />
    </div>
  );
}
