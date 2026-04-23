export function GradientOrbs({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className ?? ""}`} aria-hidden>
      <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-bsc-blue/30 blur-3xl animate-float-slow" />
      <div className="absolute right-10 top-1/3 h-[420px] w-[420px] rounded-full bg-bsc-sky/20 blur-3xl animate-float-slow [animation-delay:-3s]" />
      <div className="absolute bottom-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-bsc-deep/40 blur-3xl" />
      <div className="absolute inset-0 grid-lines" />
    </div>
  );
}
