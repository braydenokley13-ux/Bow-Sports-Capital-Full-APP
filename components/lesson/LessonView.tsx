"use client";

import { useState } from "react";
import { ActivityFrame } from "./ActivityFrame";
import { ClaimSubmit } from "./ClaimSubmit";
import { SlideDeck } from "./SlideDeck";
import { SpotifyPlayer } from "./SpotifyPlayer";
import type { Lesson } from "@/lib/data/types";

interface LessonViewProps {
  lesson: Lesson;
  userEmail?: string;
}

export function LessonView({ lesson, userEmail }: LessonViewProps) {
  const [prefilledCode, setPrefilledCode] = useState<string | null>(null);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        {lesson.slidePdfUrl ? (
          <SlideDeck pdfUrl={lesson.slidePdfUrl} title={`${lesson.code} slides`} />
        ) : (
          <EmptyState label="No slide deck available for this lesson yet." />
        )}

        {lesson.activityUrl ? (
          <ActivityFrame
            src={lesson.activityUrl}
            title={lesson.title}
            userEmail={userEmail}
            onClaim={(code) => setPrefilledCode(code)}
          />
        ) : null}
      </div>

      <aside className="space-y-5">
        {lesson.spotifyEpisodeUrl ? (
          <SpotifyPlayer embedUrl={lesson.spotifyEpisodeUrl} title={`${lesson.code} podcast`} />
        ) : null}

        <ClaimSubmit
          lessonId={lesson.id}
          lessonCode={lesson.code}
          expectedXp={lesson.xpValue}
          prefilledCode={prefilledCode}
        />

        <div className="card-bsc">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Lesson details
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Code" value={lesson.code} />
            <Row label="XP" value={`+${lesson.xpValue}`} />
            {lesson.difficulty ? <Row label="Difficulty" value={lesson.difficulty} /> : null}
            {lesson.estimatedMinutes ? (
              <Row label="Time" value={`${lesson.estimatedMinutes} min`} />
            ) : null}
            {lesson.roleFocus ? <Row label="Role focus" value={lesson.roleFocus} /> : null}
          </dl>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-white/50">{label}</dt>
      <dd className="font-medium text-white">{value}</dd>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="glass-panel flex aspect-[16/10] w-full items-center justify-center text-sm text-white/50">
      {label}
    </div>
  );
}
