import { CalendarIcon, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getUpcomingEvents } from "@/lib/data";

export const metadata = { title: "Calendar" };

export default async function CalendarPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
          <CalendarIcon className="h-3.5 w-3.5 text-primary" /> Upcoming sessions
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Calendar</h1>
        <p className="mt-1 text-white/60">
          Live coaching sessions, draft nights, and the Gauntlet windows.
        </p>
      </header>
      <div className="space-y-3">
        {events.map((e) => (
          <Card key={e.id} className="!py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <DateChip iso={e.openAt} />
                <div>
                  <div className="font-display text-lg font-semibold text-white">{e.title}</div>
                  <div className="text-sm text-white/60">{e.description}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                <Badge variant={e.status === "LIVE" ? "success" : "outline"}>{e.status}</Badge>
                <span className="inline-flex items-center gap-1">
                  <Video className="h-3 w-3" /> Live
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Online
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DateChip({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-center">
      <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
        {d.toLocaleDateString(undefined, { month: "short" })}
      </div>
      <div className="font-display text-lg font-black text-white number-tabular">{d.getDate()}</div>
    </div>
  );
}
