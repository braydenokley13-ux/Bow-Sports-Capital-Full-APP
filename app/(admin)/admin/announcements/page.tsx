import { Megaphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAnnouncements } from "@/lib/data";

export const metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px] animate-fade-in">
      <div className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">Announcements</h1>
            <p className="mt-1 text-white/60">Post now or schedule.</p>
          </div>
          <Button>
            <Plus className="h-4 w-4" /> New
          </Button>
        </header>
        {announcements.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Megaphone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{a.title}</div>
                <div className="text-sm text-white/60">{a.body}</div>
                <div className="mt-2 text-xs text-white/40">
                  Showing since {new Date(a.showAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="h-fit">
        <h2 className="font-display text-lg font-semibold text-white">Compose</h2>
        <form className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Season 2 kickoff" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="body">Body</Label>
            <textarea
              id="body"
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-ring/30"
              placeholder="A short message for students…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="showAt">Show at</Label>
              <Input id="showAt" type="datetime-local" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hideAt">Auto-hide at</Label>
              <Input id="hideAt" type="datetime-local" />
            </div>
          </div>
          <Button className="w-full">Schedule</Button>
        </form>
      </Card>
    </div>
  );
}
