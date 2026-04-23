import { AppNav } from "@/components/app/AppNav";
import { getNotifications, getProfile } from "@/lib/data";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  const notifications = await getNotifications(profile.userId);
  const unread = notifications.filter((n) => n.status === "UNREAD").length;

  return (
    <div className="min-h-screen">
      <AppNav profile={profile} unreadCount={unread} />
      <main className="mx-auto max-w-[1500px] px-4 py-8">{children}</main>
    </div>
  );
}
