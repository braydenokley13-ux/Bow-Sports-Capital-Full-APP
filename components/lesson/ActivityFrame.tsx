"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Maximize2, RefreshCw } from "lucide-react";
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
 * postMessages from bsc-shim.js. Falls back to a manual claim-submit UI
 * if the shim isn't installed on the activity.
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
        "glass-panel relative overflow-hidden",
        expanded ? "fixed inset-4 z-50" : "aspect-[16/10] w-full",
        className,
      )}
    >
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-bsc-navy/80 px-3 py-1 text-[11px] text-white/70 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60" />
        Activity · live
      </div>
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={reload} aria-label="Reload activity">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" asChild aria-label="Open in new tab">
          <a href={src} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
      <iframe
        key={key}
        ref={iframeRef}
        src={fullSrc}
        title={title}
        className="h-full w-full"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        allow="clipboard-write"
        loading="lazy"
      />
    </div>
  );
}
