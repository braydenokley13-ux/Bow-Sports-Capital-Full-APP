"use client";

import { Download, FileText, Maximize2, Presentation } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideDeckProps {
  pdfUrl: string;
  title: string;
  className?: string;
}

export function SlideDeck({ pdfUrl, title, className }: SlideDeckProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden",
        expanded ? "fixed inset-4 z-50" : "aspect-[16/10] w-full",
        className,
      )}
    >
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-bsc-navy/80 px-3 py-1 text-[11px] text-white/70 backdrop-blur">
        <Presentation className="h-3 w-3 text-primary" />
        Slides
      </div>
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" asChild aria-label="Download slides">
          <a href={pdfUrl} download>
            <Download className="h-4 w-4" />
          </a>
        </Button>
      </div>
      <SlideEmbed pdfUrl={pdfUrl} title={title} />
    </div>
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
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <FileText className="h-10 w-10 text-white/40" />
        <div className="text-sm text-white/60">
          Your browser can't preview this deck inline.
        </div>
        <Button asChild>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Open slides
          </a>
        </Button>
      </div>
    </object>
  );
}
