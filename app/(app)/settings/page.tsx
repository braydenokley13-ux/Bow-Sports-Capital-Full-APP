import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfile } from "@/lib/data";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await getProfile();
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
          <SettingsIcon className="h-3.5 w-3.5 text-primary" /> Account
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Settings</h1>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-white">Profile</h2>
          <p className="text-sm text-white/60">How you appear on leaderboards and credentials.</p>
          <form className="mt-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Display name</Label>
                <Input id="name" defaultValue={profile.displayName} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={profile.email} disabled />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Favorite role</Label>
              <Input id="role" placeholder="GM, Scout, Analyst…" defaultValue={profile.favoriteRole} />
            </div>
            <div className="pt-2">
              <Button>Save changes</Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold text-white">Notifications</h2>
          <p className="text-sm text-white/60">Email + in-app.</p>
          <div className="mt-4 space-y-3 text-sm">
            {["Lesson completions", "Level ups", "New credentials", "Events", "Pod activity"].map((label) => (
              <label
                key={label}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
              >
                <span className="text-white/80">{label}</span>
                <input type="checkbox" defaultChecked className="accent-primary" />
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
