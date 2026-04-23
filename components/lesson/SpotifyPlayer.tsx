"use client";

import { Headphones } from "lucide-react";

interface SpotifyPlayerProps {
  embedUrl: string;
  title?: string;
}

export function SpotifyPlayer({ embedUrl, title = "Spotify player" }: SpotifyPlayerProps) {
  // Accept either an episode URL (open.spotify.com/episode/…) or an embed URL.
  const normalized = embedUrl.replace("open.spotify.com/", "open.spotify.com/embed/").replace(
    "/embed/embed/",
    "/embed/",
  );

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white/60">
        <Headphones className="h-3.5 w-3.5 text-[#1db954]" />
        Podcast · Spotify
      </div>
      <iframe
        src={normalized}
        title={title}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="block border-0"
      />
    </div>
  );
}
