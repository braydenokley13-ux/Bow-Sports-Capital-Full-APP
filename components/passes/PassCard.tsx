import { ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import type { TrackCode } from "@/lib/data/types";

interface PassCardProps {
  passId: string;
  displayName: string;
  level: string;
  track: TrackCode;
  issuedAt: string;
  compact?: boolean;
}

const TRACK_STYLES: Record<TrackCode, { accent: string; from: string; to: string; label: string }> = {
  "101": { accent: "#22c55e", from: "#064e3b", to: "#0f766e", label: "Rookie GM Foundations" },
  "201": { accent: "#2563eb", from: "#0b1a4a", to: "#1d4ed8", label: "Front Office" },
  "301": { accent: "#f59e0b", from: "#78350f", to: "#b45309", label: "Owner's Suite" },
};

export function PassCard({ passId, displayName, level, track, issuedAt, compact }: PassCardProps) {
  const s = TRACK_STYLES[track];
  const issued = new Date(issuedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 p-5 shadow-glow"
      style={{
        background: `linear-gradient(140deg, ${s.from} 0%, ${s.to} 100%)`,
      }}
    >
      {/* Gloss */}
      <div className="pointer-events-none absolute -top-24 left-0 right-0 h-40 bg-gradient-to-b from-white/20 to-transparent" />
      {/* Accent band */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: s.accent }}
      />
      <div className="relative flex items-center justify-between">
        <LogoMark className="h-9 w-9" />
        <div
          className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest text-white"
          style={{ background: s.accent + "30", border: `1px solid ${s.accent}60` }}
        >
          TRACK {track}
        </div>
      </div>
      <div className="relative mt-6">
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/60">{s.label}</div>
        <div className="mt-1 font-display text-xl font-black leading-tight text-white">
          {level}
        </div>
      </div>
      <div className="relative mt-6 flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/60">Holder</div>
          <div className="mt-0.5 font-display text-base font-bold text-white">{displayName}</div>
        </div>
        {compact ? null : (
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-white/60">Issued</div>
            <div className="mt-0.5 text-sm font-medium text-white">{issued}</div>
          </div>
        )}
      </div>
      <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/70">
          <ShieldCheck className="h-3.5 w-3.5" /> Verified credential
        </span>
        <span className="font-mono text-[11px] text-white/60">{passId}</span>
      </div>
    </div>
  );
}
