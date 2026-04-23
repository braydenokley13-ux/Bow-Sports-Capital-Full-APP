"use client";

import { Download, FileText, Maximize2, Minimize2, Presentation } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideDeckProps {
  pdfUrl: string;
  title: string;
  lessonCode?: string;
  className?: string;
}

export function SlideDeck({ pdfUrl, title, lessonCode, className }: SlideDeckProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        key={expanded ? "fullscreen" : "inline"}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={cn(
          "glass-panel relative overflow-hidden",
          // Taller aspect ratio in inline mode for a more hero feel
          expanded ? "fixed inset-4 z-50" : "aspect-[16/10] w-full md:aspect-[16/9]",
          className,
        )}
      >
        {/* Top chrome bar */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/5 bg-bsc-navy/70 px-4 py-2 backdrop-blur-sm">
          {/* Left: act label + lesson code */}
          <div className="flex items-center gap-2 text-[11px]">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/50">
              <Presentation className="h-3 w-3 text-primary" />
              <span className="text-white/35 font-medium">Act 1 of 3</span>
              <span className="mx-0.5 text-white/15">·</span>
              <span className="font-semibold text-white/60">Slides</span>
            </span>
            {lessonCode ? (
              <span className="font-mono text-[10px] font-semibold tracking-wider text-white/30">
                {lessonCode}
              </span>
            ) : null}
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-1">
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
              aria-label="Download slides"
              className="h-7 w-7 border-white/10 bg-transparent hover:bg-white/10"
            >
              <a href={pdfUrl} download>
                <Download className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Sky glow accent at the very top edge */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bsc-sky/40 to-transparent" />

        {/* PDF embed — padded top to clear the chrome bar */}
        <div className="absolute inset-0 top-[41px]">
          <SlideEmbed pdfUrl={pdfUrl} title={title} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SlideEmbed({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const isPdf = /\.pdf($|\?)/i.test(pdfUrl);
  if (!isPdf) {
    return (
      <iframe src={pdfUrl} title={title} className="h-full w-full border-0" loading="lazy" />
    );
  }
  return (
    <object
      data={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
      type="application/pdf"
      className="h-full w-full"
    >
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <FileText className="h-12 w-12 text-white/25" />
        <div className="text-sm text-white/50">
          Your browser cannot preview this deck inline.
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Open slides
          </a>
        </Button>
      </div>
    </object>
  );
}
