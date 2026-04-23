"use client";

import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn, formatNumber } from "@/lib/utils";
import { levelFromXp } from "@/lib/xp";

interface XPBarProps {
  xp: number;
  compact?: boolean;
  className?: string;
}

export function XPBar({ xp, compact, className }: XPBarProps) {
  const info = levelFromXp(xp);
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">
            {info.level}
          </span>
          {!compact && (
            <span className="font-display text-sm font-medium text-white">{info.title}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-white/60 number-tabular">
          <Zap className="h-3 w-3 text-primary" />
          {formatNumber(xp)} / {formatNumber(info.nextAtXp)} XP
        </div>
      </div>
      <div className="mt-1.5 relative">
        <Progress value={info.progressPct} />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-white/20 blur-sm"
          animate={{ width: `${info.progressPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function StreakFlame({ days }: { days: number }) {
  if (days <= 0) {
    return (
      <div className="stat-chip">
        <Flame className="h-3.5 w-3.5 text-white/40" />
        <span>0 days</span>
      </div>
    );
  }
  return (
    <div className="stat-chip border-orange-400/30 bg-orange-400/10 text-orange-200">
      <Flame className="h-3.5 w-3.5 text-orange-300" />
      <span className="number-tabular">{days} day streak</span>
    </div>
  );
}

export function BFCWallet({ bfc }: { bfc: number }) {
  return (
    <div className="stat-chip border-amber-400/30 bg-amber-400/10 text-amber-200">
      <span className="text-[10px] font-bold">BFC</span>
      <span className="number-tabular font-semibold">{formatNumber(bfc)}</span>
    </div>
  );
}
