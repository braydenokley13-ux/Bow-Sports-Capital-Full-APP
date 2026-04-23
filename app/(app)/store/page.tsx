import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BFCWallet } from "@/components/xp/XPBar";
import { getProfile, getStoreItems } from "@/lib/data";
import { cn, formatNumber } from "@/lib/utils";

export const metadata = { title: "Store" };

const CATEGORY_LABEL: Record<string, string> = {
  GM_CARD: "Cards",
  AVATAR: "Avatar",
  TITLE: "Titles",
  CONTENT: "Content",
  COSMETIC: "Cosmetic",
};

export default async function StorePage() {
  const profile = await getProfile();
  const items = await getStoreItems();

  const grouped = items.reduce<Record<string, typeof items>>((acc, it) => {
    (acc[it.category] ||= []).push(it);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
            <ShoppingBag className="h-3.5 w-3.5 text-amber-300" /> BFC store
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold text-white">Store</h1>
          <p className="mt-1 text-white/60">Spend your BFC on cards, titles, avatars, and more.</p>
        </div>
        <BFCWallet bfc={profile.bfc} />
      </header>

      {Object.entries(grouped).map(([cat, group]) => (
        <section key={cat}>
          <h2 className="mb-3 font-display text-lg font-semibold text-white">
            {CATEGORY_LABEL[cat] ?? cat}
          </h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {group.map((item) => {
              const canAfford = profile.bfc >= item.priceBfc;
              return (
                <Card
                  key={item.id}
                  className={cn(
                    "flex flex-col",
                    item.rarity === "legendary" && "shadow-[0_0_0_1px_rgba(245,158,11,0.25),0_20px_60px_-20px_rgba(245,158,11,0.35)]",
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-bsc-deep to-bsc-navy2 ring-1 ring-white/5">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-white/20" />
                    </div>
                    {item.rarity ? (
                      <Badge
                        variant={
                          item.rarity === "legendary"
                            ? "gold"
                            : item.rarity === "epic"
                              ? "default"
                              : "secondary"
                        }
                        className="absolute left-2 top-2"
                      >
                        {item.rarity}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-3 flex-1">
                    <div className="font-display font-semibold text-white">{item.name}</div>
                    <div className="mt-1 text-xs text-white/60">{item.description}</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-300 number-tabular">
                      <span className="text-[10px]">BFC</span> {formatNumber(item.priceBfc)}
                    </div>
                    <Button
                      size="sm"
                      disabled={!canAfford}
                      variant={canAfford ? "default" : "outline"}
                    >
                      {canAfford ? "Buy" : "Not enough"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
