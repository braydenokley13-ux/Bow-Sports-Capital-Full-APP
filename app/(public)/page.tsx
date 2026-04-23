import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  DollarSign,
  Gamepad2,
  Headphones,
  Presentation,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientOrbs } from "@/components/brand/GradientOrbs";
import { mockTracks } from "@/lib/data/mock";

export default function MarketingPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <GradientOrbs />
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mx-auto">
              <Sparkles className="h-3.5 w-3.5" /> Sports-business academy · for students
            </Badge>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-7xl">
              Learn economics through the{" "}
              <span className="text-gradient">business of sports.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
              Bow Sports Capital teaches middle schoolers to think like front-office executives —
              contracts, salary caps, trades, drafts, ownership, and the decisions that shape
              championships. It's not a textbook. It's a front-office war room.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/sign-up">
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="#program">See how it works</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8">
              <Stat value="200+" label="Lessons" />
              <Stat value="3" label="Tracks" />
              <Stat value="1-on-1" label="Coaching" />
            </div>
          </div>

          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="glass-panel shadow-glow-lg ring-1 ring-white/5">
              <div className="grid gap-0 md:grid-cols-3">
                <HeroPanel
                  title="Slides"
                  description="Front-office lessons, interactive and visual."
                  icon={Presentation}
                />
                <HeroPanel
                  title="Podcasts"
                  description="Weekly episodes on Spotify, paired to every lesson."
                  icon={Headphones}
                />
                <HeroPanel
                  title="Activities"
                  description="Real sims. Real decisions. Real XP."
                  icon={Gamepad2}
                />
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-x-10 top-1/3 -z-10 h-64 bg-bsc-blue/20 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Program pillars */}
      <section id="program" className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader
          eyebrow="The program"
          title="Front-office thinking, one decision at a time."
          description="Each lesson pairs a slide deck, a podcast episode, and a sim so students don't just read about economics — they live it. Finish an activity, claim your code, earn XP, unlock the next rung."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <Pillar
            icon={DollarSign}
            title="Contracts & cap sheets"
            description="Students learn to read a cap sheet the way a GM does — every line item has a story."
          />
          <Pillar
            icon={TrendingUp}
            title="Trade value math"
            description="Understand why stars move, why rebuilds happen, and what 'future assets' actually means."
          />
          <Pillar
            icon={BarChart3}
            title="Data-driven scouting"
            description="Plus/minus, true shooting, usage rate — tools front offices use, taught simply."
          />
          <Pillar
            icon={Briefcase}
            title="Ownership & media deals"
            description="Learn how teams actually make money — and how league policy shapes every franchise."
          />
          <Pillar
            icon={ShieldCheck}
            title="Risk & incentives"
            description="The universal lessons: how money shapes behavior, and why tradeoffs define champions."
          />
          <Pillar
            icon={Rocket}
            title="Strategic thinking"
            description="The skill that transfers. Students graduate thinking in decisions, not opinions."
          />
        </div>
      </section>

      {/* Tracks */}
      <section id="tracks" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Tracks"
            title="Three ladders. One front office."
            description="Each track is a series of modules with lessons, simulations, and a capstone. Finish a track and earn a credential that stacks on your player card."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {mockTracks.map((track) => (
              <TrackCard
                key={track.id}
                code={track.code}
                name={track.name}
                description={track.description}
                accent={track.accentColor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader
          eyebrow="Gamified end to end"
          title="The greatest XP system ever, wrapped around real learning."
          description="Level up, earn credentials, fight through the Gauntlet for Bronze / Silver / Gold, spend BFC in the store, and climb the global leaderboard."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <MiniFeature icon={Zap} label="XP + Levels" />
          <MiniFeature icon={Trophy} label="Leaderboards" />
          <MiniFeature icon={Sparkles} label="Gauntlet Tiers" />
          <MiniFeature icon={Users} label="Pods & Seasons" />
        </div>
      </section>

      {/* Podcast */}
      <section id="podcast" className="mx-auto max-w-7xl px-6 py-24">
        <div className="glass-panel p-10 md:p-16">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Badge variant="outline">
                <Headphones className="h-3.5 w-3.5" /> The podcast
              </Badge>
              <h2 className="mt-5 font-display text-3xl font-bold text-white md:text-4xl">
                Every lesson has an episode.
              </h2>
              <p className="mt-4 max-w-xl text-white/70">
                Hit play while you study the slides. The podcast pairs to the lesson you're on, so
                the audio and visuals move together — like a halftime breakdown.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">
                    Listen on Spotify
                  </a>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Start the program</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-8 rounded-[40px] bg-bsc-blue/20 blur-2xl" />
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-1 shadow-glow">
                <div className="rounded-[20px] bg-black p-3">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-bsc-blue to-bsc-sky" />
                    <div>
                      <div className="text-sm font-semibold text-white">Ep. 18 · Luxury Tax 101</div>
                      <div className="text-xs text-white/60">Bow Sports Capital Podcast</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                      ▶
                    </div>
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-white/10">
                        <div className="h-1.5 w-1/3 rounded-full bg-primary" />
                      </div>
                      <div className="mt-2 flex justify-between text-[11px] text-white/50 number-tabular">
                        <span>07:22</span>
                        <span>22:04</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parents */}
      <section id="parents" className="mx-auto max-w-5xl px-6 pb-24">
        <div className="glass-panel p-10 text-center md:p-16">
          <Badge variant="secondary" className="mx-auto">For parents</Badge>
          <h2 className="mt-5 font-display text-3xl font-bold text-white md:text-4xl">
            Real skills. Real engagement. Zero textbooks.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Your student won't notice they're learning economics, finance, and decision-making —
            because they'll be too busy running a franchise. Parent dashboards, progress emails, and
            credentials that stack.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/sign-up">Create your student's account</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-bold text-gradient">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-white/50">{label}</div>
    </div>
  );
}

function HeroPanel({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="relative flex flex-col gap-3 p-8 md:border-r md:border-white/5 md:last:border-r-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-bsc-blue/40 to-bsc-sky/30 ring-1 ring-white/10">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="font-display text-lg font-semibold text-white">{title}</div>
      <div className="text-sm text-white/60">{description}</div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </div>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-white/70">{description}</p> : null}
    </div>
  );
}

function Pillar({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="card-bsc transition-all hover:border-white/10 hover:shadow-glow">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-bsc-blue/30 to-bsc-sky/20 ring-1 ring-white/10">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{description}</p>
    </div>
  );
}

function TrackCard({
  code,
  name,
  description,
  accent,
}: {
  code: string;
  name: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="card-bsc group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: accent }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-display tracking-widest">
            TRACK {code}
          </Badge>
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accent, boxShadow: `0 0 16px ${accent}` }}
          />
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-white">{name}</h3>
        <p className="mt-3 text-sm text-white/70">{description}</p>
        <div className="mt-6 flex items-center justify-between text-xs text-white/50">
          <span>Modules · Lessons · Sims</span>
          <span className="inline-flex items-center gap-1 text-white">
            Explore <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniFeature({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="card-bsc flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-display font-semibold text-white">{label}</div>
    </div>
  );
}
