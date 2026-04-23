import { CheckCircle2, Circle, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile, getQuests } from "@/lib/data";
import type { Quest } from "@/lib/data/types";
import { pct } from "@/lib/utils";

export const metadata = { title: "Quests" };

export default async function QuestsPage() {
  const profile = await getProfile();
  const quests = await getQuests(profile.userId);

  const daily = quests.filter((q) => q.cadence === "DAILY");
  const weekly = quests.filter((q) => q.cadence === "WEEKLY");
  const lifetime = quests.filter((q) => q.cadence === "ONE_TIME");

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
          <Target className="h-3.5 w-3.5 text-primary" /> Daily + weekly objectives
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Quests</h1>
        <p className="mt-1 text-white/60">
          Stack XP fast by knocking out quests. Resets every day and every Monday.
        </p>
      </header>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <QuestList quests={daily} />
        </TabsContent>
        <TabsContent value="weekly">
          <QuestList quests={weekly} />
        </TabsContent>
        <TabsContent value="lifetime">
          <QuestList quests={lifetime} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuestList({ quests }: { quests: Quest[] }) {
  if (quests.length === 0)
    return (
      <Card className="text-center">
        <p className="py-8 text-sm text-white/50">No quests in this category yet.</p>
      </Card>
    );
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {quests.map((q) => {
        const progressPct = pct(q.progress ?? 0, q.goal ?? 1);
        return (
          <Card key={q.id}>
            <div className="flex items-start gap-3">
              {q.completed ? (
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <Circle className="mt-1 h-5 w-5 shrink-0 text-white/30" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-white">{q.title}</span>
                  <Badge variant={q.difficulty === "Hard" ? "warning" : "secondary"}>
                    {q.difficulty}
                  </Badge>
                </div>
                <div className="mt-1 text-sm text-white/60">{q.description}</div>
                {q.goal && q.goal > 1 ? (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span className="number-tabular">
                        {q.progress ?? 0}/{q.goal}
                      </span>
                      <span className="number-tabular">{progressPct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-bsc-sky to-bsc-blue"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <Badge variant={q.completed ? "success" : "default"} className="number-tabular">
                +{q.rewardPoints} XP
              </Badge>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
