"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivityFrameProps {
  src: string;
  title: string;
  userEmail?: string;
  onClaim?: (code: string, payload?: Record<string, unknown>) => void;
  className?: string;
}

/**
 * ActivityFrame — iframes a GitHub Pages activity and listens for claim
 * postMessages from bsc-shim.js. Auto-calls onClaim when the shim fires.
 */
export function ActivityFrame({ src, title, userEmail, onClaim, className }: ActivityFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [key, setKey] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Pre-fill email via URL param so activities can skip asking
  const fullSrc = (() => {
    try {
      const u = new URL(src);
      if (userEmail) u.searchParams.set("studentEmail", userEmail);
      u.searchParams.set("bsc", "1");
      return u.toString();
    } catch {
      return src;
    }
  })();

  const reload = useCallback(() => setKey((k) => k + 1), []);

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      const data = ev.data;
      if (!data || typeof data !== "object") return;
      if (data.type !== "BSC_CLAIM") return;
      const code = typeof data.code === "string" ? data.code : null;
      if (!code) return;
      onClaim?.(code, data.payload);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onClaim]);

  return (
    <div
      className={cn(
        "glass-panel relative flex flex-col overflow-hidden",
        expanded ? "fixed inset-4 z-50" : "w-full",
        className,
      )}
    >
      {/* Hint banner */}
      <div className="relative flex items-center gap-2.5 border-b border-white/[0.06] bg-bsc-deep/50 px-4 py-2.5 text-xs text-white/55 backdrop-blur-sm">
        <PulsingDot />
        <span>
          Finish the simulation to generate your claim code. It will auto-submit when you are done.
        </span>

        {/* Act label */}
        <span className="ml-2 hidden shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/30 sm:inline">
          Act 2 of 3
        </span>

        {/* Controls */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={reload}
            aria-label="Reload activity"
            className="h-7 w-7 border-white/10 bg-transparent hover:bg-white/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Exit fullscreen" : "Enter fullscreen"}
            className="h-7 w-7 border-white/10 bg-transparent hover:bg-white/10"
          >
            {expanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            asChild
            aria-label="Open in new tab"
            className="h-7 w-7 border-white/10 bg-transparent hover:bg-white/10"
          >
            <a href={src} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Live status badge */}
      <div className="pointer-events-none absolute left-3 top-[calc(2.5rem+1px)] z-10 flex items-center gap-2 rounded-full border border-white/10 bg-bsc-navy/80 px-3 py-1 text-[11px] text-white/60 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
        Activity — live
      </div>

      {/* iframe */}
      <motion.div
        className={cn("relative", expanded ? "flex-1" : "aspect-[16/9] sm:aspect-[16/9]")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <iframe
          key={key}
          ref={iframeRef}
          src={fullSrc}
          title={title}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allow="clipboard-write"
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}

function PulsingDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
  );
}
