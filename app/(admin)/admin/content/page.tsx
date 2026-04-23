import { Plus, NotebookPen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllLessons, getTracks } from "@/lib/data";

export const metadata = { title: "Content" };

export default async function ContentPage() {
  const tracks = await getTracks();
  const lessons = await getAllLessons();

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-white">Content</h1>
          <p className="mt-1 text-white/60">Programs → Modules → Lessons → Activities.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> New lesson
        </Button>
      </header>

      {tracks.map((t) => {
        const trackLessons = lessons.filter((l) => l.code.startsWith("T" + t.code));
        return (
          <section key={t.id}>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline" className="font-display tracking-widest">
                TRACK {t.code}
              </Badge>
              <h2 className="font-display text-lg font-semibold text-white">{t.name}</h2>
              <span className="text-xs text-white/50">{trackLessons.length} lessons</span>
            </div>
            <Card className="!p-0">
              <div className="divide-y divide-white/5">
                {trackLessons.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02]"
                  >
                    <NotebookPen className="h-4 w-4 text-white/40" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-white/40">{l.code}</span>
                        <Badge variant={l.enabled ? "success" : "outline"}>
                          {l.enabled ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-white">{l.title}</div>
                    </div>
                    <Badge variant="secondary" className="number-tabular">
                      +{l.xpValue} XP
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        );
      })}
    </div>
  );
}
