"use client";

import { ChevronDown, ChevronUp, Headphones } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotifyPlayerProps {
  embedUrl: string;
  title?: string;
  className?: string;
}

export function SpotifyPlayer({
  embedUrl,
  title = "Spotify player",
  className,
}: SpotifyPlayerProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Accept either an episode URL (open.spotify.com/episode/…) or an embed URL.
  const normalized = embedUrl
    .replace("open.spotify.com/", "open.spotify.com/embed/")
    .replace("/embed/embed/", "/embed/");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[#1db954]/20 bg-[#121212] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      {/* Header / toggle bar */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/[0.04]"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand podcast player" : "Collapse podcast player"}
      >
        {/* Spotify icon */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1db954]/20">
          <Headphones className="h-3.5 w-3.5 text-[#1db954]" />
        </span>

        <span className="flex flex-1 items-center gap-2.5">
          <span className="text-sm font-semibold text-white/80">Podcast</span>
          <span className="rounded-full bg-[#1db954]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1db954]">
            Spotify
          </span>
        </span>

        <span className="text-[10px] font-medium text-white/30 mr-1">
          {collapsed ? "Expand" : "Minimize"}
        </span>

        {collapsed ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/35" />
        ) : (
          <ChevronUp className="h-3.5 w-3.5 shrink-0 text-white/35" />
        )}
      </button>

      {/* Spotify green line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#1db954]/30 to-transparent" />

      {/* Collapsible player */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <iframe
              src={normalized}
              title={title}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block border-0"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
