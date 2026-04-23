"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Loader2, Trophy, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LevelUpModal } from "@/components/xp/LevelUpModal";
import { XPGainToast } from "@/components/xp/XPToast";
import { toast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ClaimSubmitProps {
  lessonId: string;
  lessonCode: string;
  expectedXp: number;
  prefilledCode?: string | null;
  nextLesson?: { code: string; title: string } | null;
  onComplete?: () => void;
  className?: string;
}

export function ClaimSubmit({
  lessonId,
  lessonCode,
  expectedXp,
  prefilledCode,
  nextLesson,
  onComplete,
  className,
}: ClaimSubmitProps) {
  const router = useRouter();
  const [code, setCode] = useState(prefilledCode ?? "");
  const [busy, setBusy] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimedXp, setClaimedXp] = useState(0);
  const [claimedLevel, setClaimedLevel] = useState<number | null>(null);
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [leveledUp, setLeveledUp] = useState<{
    level: number;
    title: string;
    totalXp: number;
  } | null>(null);
  const autoSubmitFired = useRef(false);

  async function submit(rawCode: string) {
    const trimmed = rawCode.trim().toUpperCase();
    if (!trimmed) {
      toast({ title: "Enter a code", description: "Paste the claim code you earned." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: trimmed, lessonId, source: "MANUAL" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast({
          title: data?.code ?? "Could not verify code",
          description: data?.message ?? "Try again or contact support.",
        });
        return;
      }
      const earnedXp = data.xp ?? expectedXp;
      setClaimedXp(earnedXp);
      setXpGain(earnedXp);
      setTimeout(() => setXpGain(null), 2200);
      if (data.leveledUp) {
        setLeveledUp({ level: data.newLevel, title: data.newLevelTitle, totalXp: data.totalXp });
        setClaimedLevel(data.newLevel);
      }
      toast({
        title: `+${earnedXp} XP`,
        description: `Nice work — lesson ${lessonCode} complete.`,
      });
      setClaimed(true);
      setCode("");
      onComplete?.();
      router.refresh();
    } catch (err) {
      toast({
        title: "Network error",
        description: (err as Error)?.message ?? "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  // Auto-submit once when prefilled code arrives
  useEffect(() => {
    if (prefilledCode && !autoSubmitFired.current && !busy && !claimed) {
      autoSubmitFired.current = true;
      setCode(prefilledCode);
      submit(prefilledCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledCode]);

  return (
    <div className={cn("mx-auto w-full max-w-2xl space-y-4", className)}>
      <AnimatePresence mode="wait">
        {claimed ? (
          /* ── Success hero ──────────────────────────────────────── */
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="card-bsc relative overflow-hidden py-10 text-center"
          >
            {/* Ambient radial glow */}
            <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)]" />

            {/* Check icon */}
            <div className="relative mb-5 inline-flex items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full bg-primary/10 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-bsc-sky/30 to-primary/30 shadow-glow">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
            </div>

            {/* XP number */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              className="font-display text-6xl font-bold text-gradient leading-none"
            >
              +{claimedXp} XP
            </motion.div>

            <div className="mt-3 flex items-center justify-center gap-2 text-lg font-semibold text-white">
              Lesson complete
              {claimedLevel ? (
                <span className="rounded-full border border-primary/30 bg-primary/15 px-3 py-0.5 text-sm text-primary">
                  Level {claimedLevel}
                </span>
              ) : null}
            </div>

            <p className="mt-2 text-sm text-white/45">
              {lessonCode} is in the books. Keep the momentum going.
            </p>

            {/* Act 3 complete badge */}
            <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
              <Trophy className="h-3 w-3" />
              Act 3 complete
            </div>
          </motion.div>
        ) : (
          /* ── Claim form ────────────────────────────────────────── */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="card-bsc relative overflow-hidden"
          >
            {/* Top glow line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bsc-sky/25 to-transparent" />

            {/* Act label */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                <Trophy className="h-3 w-3" />
                Act 3 of 3 — Claim
              </span>
            </div>

            {/* XP hero callout */}
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2 font-display leading-none">
                  <span className="text-5xl font-bold text-gradient">+{expectedXp}</span>
                  <span className="text-3xl font-semibold text-white/40">XP</span>
                </div>
                <div className="mt-2 text-sm text-white/45">
                  Submit your code below to lock in this reward.
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/20 shadow-[0_0_24px_-6px_rgba(37,99,235,0.5)]"
              >
                <Zap className="h-7 w-7 text-primary" />
              </motion.div>
            </div>

            {/* Code input + submit */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(code);
              }}
              className="space-y-3"
            >
              <div className="space-y-1.5">
                <Label
                  htmlFor="claim-code"
                  className="text-xs font-semibold uppercase tracking-wider text-white/40"
                >
                  Claim Code
                </Label>
                <Input
                  id="claim-code"
                  placeholder={`e.g. ${lessonCode}-GMN`}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-12 font-mono text-base uppercase tracking-[0.25em] placeholder:tracking-[0.1em] placeholder:normal-case"
                />
              </div>

              <Button
                type="submit"
                disabled={busy}
                className={cn(
                  "btn-gradient h-12 w-full gap-2 text-sm font-semibold",
                  busy && "pointer-events-none opacity-70",
                )}
              >
                {busy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying code
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Claim {expectedXp} XP
                  </>
                )}
              </Button>

              <p className="text-center text-[11px] text-white/25">
                Format: {lessonCode}-XXX — generated by the activity simulation
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next lesson card */}
      {nextLesson ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <Link
            href={`/lesson/${nextLesson.code}`}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                Up next
              </div>
              <div className="mt-1 truncate font-medium text-white/75 transition group-hover:text-white">
                {nextLesson.title}
              </div>
              <div className="mt-0.5 font-mono text-[11px] text-white/30">{nextLesson.code}</div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/55" />
          </Link>
        </motion.div>
      ) : null}

      <XPGainToast amount={xpGain ?? 0} show={xpGain !== null} />
      <LevelUpModal
        open={leveledUp !== null}
        onOpenChange={(o) => !o && setLeveledUp(null)}
        level={leveledUp?.level ?? 1}
        title={leveledUp?.title ?? ""}
        totalXp={leveledUp?.totalXp ?? 0}
      />
    </div>
  );
}
