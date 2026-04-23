"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LevelUpModal } from "@/components/xp/LevelUpModal";
import { XPGainToast } from "@/components/xp/XPToast";
import { toast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ClaimSubmitProps {
  lessonId: string;
  lessonCode: string;
  expectedXp: number;
  prefilledCode?: string | null;
  className?: string;
}

export function ClaimSubmit({
  lessonId,
  lessonCode,
  expectedXp,
  prefilledCode,
  className,
}: ClaimSubmitProps) {
  const router = useRouter();
  const [code, setCode] = useState(prefilledCode ?? "");
  const [busy, setBusy] = useState(false);
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [leveledUp, setLeveledUp] = useState<{ level: number; title: string; totalXp: number } | null>(
    null,
  );

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
      setXpGain(data.xp ?? expectedXp);
      setTimeout(() => setXpGain(null), 2200);
      if (data.leveledUp) {
        setLeveledUp({ level: data.newLevel, title: data.newLevelTitle, totalXp: data.totalXp });
      }
      toast({
        title: `+${data.xp} XP`,
        description: `Nice work — lesson ${lessonCode} complete.`,
      });
      setCode("");
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

  // Auto-submit if prefilled from postMessage
  if (prefilledCode && !busy && code === prefilledCode) {
    // Fire once then clear
    submit(prefilledCode);
  }

  return (
    <div className={cn("card-bsc", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="font-display font-semibold text-white">Submit your claim code</div>
            <div className="text-xs text-white/50">
              Earn +{expectedXp} XP when you complete this lesson.
            </div>
          </div>
        </div>
        <Badge variant="outline" className="font-mono">
          {lessonCode}
        </Badge>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(code);
        }}
        className="mt-4 flex flex-col gap-3 md:flex-row"
      >
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="claim-code" className="sr-only">
            Claim code
          </Label>
          <Input
            id="claim-code"
            placeholder={`e.g. ${lessonCode}-GMN`}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            autoComplete="off"
            spellCheck={false}
            className="font-mono uppercase tracking-widest"
          />
        </div>
        <Button type="submit" disabled={busy} className="md:w-44">
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" /> Claim XP
            </>
          )}
        </Button>
      </form>
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
