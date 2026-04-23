import Link from "next/link";
import {
  Gauge,
  Megaphone,
  NotebookPen,
  PanelLeftClose,
  PanelRight,
  Users,
} from "lucide-react";
import { AppNav } from "@/components/app/AppNav";
import { getNotifications, getProfile } from "@/lib/data";

const adminNav = [
  { href: "/admin", label: "Overview", icon: Gauge },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/content", label: "Content", icon: NotebookPen },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  const notifs = await getNotifications(profile.userId);
  const unread = notifs.filter((n) => n.status === "UNREAD").length;

  return (
    <div className="min-h-screen">
      <AppNav profile={profile} unreadCount={unread} />
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              <PanelLeftClose className="h-3 w-3" /> Admin
            </div>
            <nav className="flex flex-col gap-1">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 rounded-xl border border-primary/25 bg-primary/10 p-3 text-xs text-white/70">
              <PanelRight className="mb-1 h-3 w-3 text-primary" />
              Coach view. Actions apply across the program.
            </div>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
