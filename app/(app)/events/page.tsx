import { CalendarClock, Clock, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentSeason, getUpcomingEvents } from "@/lib/data";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getUpcomingEvents();
  const season = await getCurrentSeason();
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
          <Trophy className="h-3.5 w-3.5 text-amber-300" /> {season.title}
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Live events</h1>
        <p className="mt-1 text-white/60">
          Timed sims, draft nights, and trade-deadline sprints. Show up, compete, earn big XP.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((e) => (
          <Card key={e.id}>
            <div className="flex items-center justify-between">
              <Badge variant={e.status === "LIVE" ? "success" : e.status === "UPCOMING" ? "default" : "secondary"}>
                {e.status}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-white/50">
                <CalendarClock className="h-3 w-3" />
                {new Date(e.openAt).toLocaleString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold text-white">{e.title}</h3>
            <p className="mt-2 text-sm text-white/60">{e.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60">
              {e.trackCode ? <Badge variant="outline">Track {e.trackCode}</Badge> : null}
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.round(
                  (new Date(e.closeAt).getTime() - new Date(e.openAt).getTime()) / (1000 * 60),
                )}{" "}
                min window
              </span>
              {e.participants ? (
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {e.participants} participants
                </span>
              ) : null}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Details
              </Button>
              <Button size="sm" className="flex-1">
                RSVP
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
