import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="h-8 w-8" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-bold tracking-tight text-white">
          BOW
        </span>
        <span className="font-display text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
          Sports Capital
        </span>
      </span>
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="bsc-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="bsc-mark-inner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#bsc-mark)" />
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="9.5"
        stroke="white"
        strokeOpacity="0.22"
      />
      <path
        d="M12 27V13h6.4c2.5 0 4 1.3 4 3.4 0 1.5-.8 2.6-2.2 3v.1c1.7.3 2.8 1.5 2.8 3.3 0 2.3-1.7 3.6-4.4 3.6H12zm3.1-8.2h2.7c1 0 1.6-.5 1.6-1.4 0-.8-.6-1.3-1.6-1.3h-2.7v2.7zm0 5.9h3c1.2 0 1.9-.5 1.9-1.5s-.7-1.6-1.9-1.6h-3V24.7z"
        fill="url(#bsc-mark-inner)"
      />
      <circle cx="29.5" cy="14.5" r="2" fill="#e0f2fe" />
    </svg>
  );
}
