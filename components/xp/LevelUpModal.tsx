"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LevelUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: number;
  title: string;
  totalXp: number;
}

export function LevelUpModal({ open, onOpenChange, level, title, totalXp }: LevelUpModalProps) {
  useEffect(() => {
    if (!open) return;
    const duration = 1800;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ["#2563eb", "#38bdf8", "#f59e0b", "#ffffff"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ["#2563eb", "#38bdf8", "#f59e0b", "#ffffff"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-primary/30 blur-2xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-bsc-sky to-bsc-blue shadow-glow-lg">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </div>
          <DialogTitle className="mt-4 text-2xl">Level {level} unlocked</DialogTitle>
          <DialogDescription className="text-base text-white/80">
            You're now a <span className="font-semibold text-white">{title}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 number-tabular">
          <div className="text-xs uppercase tracking-wide text-white/50">Total XP</div>
          <div className="mt-1 font-display text-3xl font-bold text-gradient">
            {totalXp.toLocaleString()}
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Let's go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
