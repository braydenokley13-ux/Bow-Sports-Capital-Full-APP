"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ActivityFrame } from "./ActivityFrame";
import { ClaimSubmit } from "./ClaimSubmit";
import { SlideDeck } from "./SlideDeck";
import { SpotifyPlayer } from "./SpotifyPlayer";
import type { Lesson } from "@/lib/data/types";
import { BookOpen, Gamepad2, Trophy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonViewProps {
  lesson: Lesson;
  userEmail?: string;
  nextLesson?: { code: string; title: string } | null;
}

type TabId = "watch" | "play" | "claim";

const TAB_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export function LessonView({ lesson, userEmail, nextLesson }: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("watch");
  const [prefilledCode, setPrefilledCode] = useState<string | null>(null);
  const [visitedPlay, setVisitedPlay] = useState(false);
  const [visitedClaim, setVisitedClaim] = useState(false);
  const [claimComplete, setClaimComplete] = useState(false);

  const handleTabChange = useCallback((val: string) => {
    const tab = val as TabId;
    setActiveTab(tab);
    if (tab === "play") setVisitedPlay(true);
    if (tab === "claim") setVisitedClaim(true);
  }, []);

  const handleClaim = useCallback((code: string) => {
    setPrefilledCode(code);
    setVisitedPlay(true);
    setActiveTab("claim");
    setVisitedClaim(true);
  }, []);

  const handleClaimComplete = useCallback(() => {
    setClaimComplete(true);
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      {/* Tab navigation bar */}
      <div className="mb-5 flex items-center gap-3">
        <TabsList className="h-auto gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur">
          <LessonTabTrigger
            value="watch"
            label="Watch & Listen"
            icon={<BookOpen className="h-3.5 w-3.5" />}
            act="Act 1"
            visited
            active={activeTab === "watch"}
          />
          <LessonTabTrigger
            value="play"
            label="Play"
            icon={<Gamepad2 className="h-3.5 w-3.5" />}
            act="Act 2"
            visited={visitedPlay}
            active={activeTab === "play"}
          />
          <LessonTabTrigger
            value="claim"
            label="Claim"
            icon={claimComplete ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Trophy className="h-3.5 w-3.5" />}
            act="Act 3"
            visited={visitedClaim}
            unlockHint={!visitedPlay}
            active={activeTab === "claim"}
          />
        </TabsList>

        {/* XP badge in nav row */}
        <div className="ml-auto hidden items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary sm:flex">
          <span className="font-mono">+{lesson.xpValue} XP</span>
          <span className="text-primary/50">available</span>
        </div>
      </div>

      {/* Act 1 — Watch & Listen */}
      <TabsContent value="watch" className="mt-0">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "watch" && (
            <motion.div
              key="watch"
              variants={TAB_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-0"
            >
              <WatchListenLayout lesson={lesson} />
            </motion.div>
          )}
        </AnimatePresence>
      </TabsContent>

      {/* Act 2 — Play */}
      <TabsContent value="play" className="mt-0">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "play" && (
            <motion.div
              key="play"
              variants={TAB_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {lesson.activityUrl ? (
                <ActivityFrame
                  src={lesson.activityUrl}
                  title={lesson.title}
                  userEmail={userEmail}
                  onClaim={handleClaim}
                />
              ) : (
                <EmptyState label="No activity available for this lesson yet." />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </TabsContent>

      {/* Act 3 — Claim */}
      <TabsContent value="claim" className="mt-0">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "claim" && (
            <motion.div
              key="claim"
              variants={TAB_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <ClaimSubmit
                lessonId={lesson.id}
                lessonCode={lesson.code}
                expectedXp={lesson.xpValue}
                prefilledCode={prefilledCode}
                nextLesson={nextLesson}
                onComplete={handleClaimComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </TabsContent>
    </Tabs>
  );
}

/* ── Watch & Listen layout ───────────────────────────────────── */
function WatchListenLayout({ lesson }: { lesson: Lesson }) {
  return (
    <div className="relative">
      {/* Slides hero */}
      {lesson.slidePdfUrl ? (
        <SlideDeck
          pdfUrl={lesson.slidePdfUrl}
          title={`${lesson.code} slides`}
          lessonCode={lesson.code}
        />
      ) : (
        <EmptyState label="No slide deck available for this lesson yet." />
      )}

      {/* Spotify sticky mini-player below slides */}
      {lesson.spotifyEpisodeUrl ? (
        <div className="sticky bottom-4 z-20 mt-4">
          <SpotifyPlayer
            embedUrl={lesson.spotifyEpisodeUrl}
            title={`${lesson.code} podcast`}
          />
        </div>
      ) : null}
    </div>
  );
}

/* ── Tab trigger with act label + status badge ───────────────── */
interface LessonTabTriggerProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  act: string;
  visited?: boolean;
  active?: boolean;
  unlockHint?: boolean;
}

function LessonTabTrigger({
  value,
  label,
  icon,
  act,
  visited = false,
  active = false,
  unlockHint = false,
}: LessonTabTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all",
        "data-[state=active]:bg-bsc-deep data-[state=active]:text-white data-[state=active]:shadow-[0_0_0_1px_rgba(56,189,248,0.25)]",
        "data-[state=inactive]:text-white/50 data-[state=inactive]:hover:text-white/80",
      )}
    >
      <span className={cn("transition-colors", active ? "text-bsc-sky" : "text-white/40 group-hover:text-white/60")}>
        {icon}
      </span>

      <span className="hidden sm:inline">{label}</span>

      {/* Act label — hidden on smallest screens */}
      <span className={cn(
        "hidden rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider lg:inline",
        active ? "bg-bsc-sky/15 text-bsc-sky" : "bg-white/5 text-white/30",
      )}>
        {act}
      </span>

      {/* Status dot */}
      {visited && !active ? (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
      ) : unlockHint ? (
        <span className="h-1.5 w-1.5 rounded-full border border-white/20 bg-transparent" />
      ) : null}
    </TabsTrigger>
  );
}

/* ── Shared empty state ──────────────────────────────────────── */
function EmptyState({ label }: { label: string }) {
  return (
    <div className="glass-panel flex aspect-[16/10] w-full items-center justify-center text-sm text-white/50">
      {label}
    </div>
  );
}
