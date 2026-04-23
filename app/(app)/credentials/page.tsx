import Link from "next/link";
import { ExternalLink, Medal, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PassCard } from "@/components/passes/PassCard";
import { getBadges, getCredentials, getProfile, getUserBadges } from "@/lib/data";

export const metadata = { title: "Credentials" };

export default async function CredentialsPage() {
  const profile = await getProfile();
  const credentials = await getCredentials(profile.userId);
  const badges = await getBadges();
  const userBadges = await getUserBadges(profile.userId);
  const earnedIds = new Set(userBadges.map((b) => b.badgeId));

  return (
    <div className="space-y-10 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
          <Medal className="h-3.5 w-3.5 text-amber-300" /> Credentials & badges
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Credentials</h1>
        <p className="mt-2 max-w-2xl text-white/60">
          Every credential is verifiable. Share the link — anyone can confirm it's real.
        </p>
      </header>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Passes</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {credentials.map((c) => (
            <div key={c.id} className="space-y-3">
              <PassCard
                passId={c.passId}
                displayName={profile.displayName}
                level={c.levelName}
                track={c.track}
                issuedAt={c.issuedAt}
              />
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/verify/${c.passId}`}>
                  <ShieldCheck className="h-3.5 w-3.5" /> Verify publicly <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ))}
          {credentials.length === 0 ? (
            <Card className="col-span-full text-center">
              <div className="py-10">
                <Medal className="mx-auto h-10 w-10 text-white/30" />
                <p className="mt-3 text-sm text-white/60">
                  Finish a module to earn your first credential.
                </p>
              </div>
            </Card>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-white">Badges</h2>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {badges.map((b) => {
            const earned = earnedIds.has(b.id);
            return (
              <Card
                key={b.id}
                className={earned ? "" : "opacity-40 saturate-50"}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      earned
                        ? "bg-gradient-to-br from-bsc-sky/30 to-bsc-blue/30 text-white ring-1 ring-white/10"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    <Medal className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-display font-semibold text-white">
                        {b.name}
                      </span>
                      <Badge
                        variant={
                          b.rarity === "legendary"
                            ? "gold"
                            : b.rarity === "epic"
                              ? "default"
                              : b.rarity === "rare"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {b.rarity}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-white/50">{b.description}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
