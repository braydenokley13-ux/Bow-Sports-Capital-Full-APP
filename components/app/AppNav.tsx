"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  Calendar,
  Gauge,
  LayoutDashboard,
  LogOut,
  Medal,
  Settings,
  ShoppingBag,
  Swords,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/brand/Logo";
import { XPBar, StreakFlame, BFCWallet } from "@/components/xp/XPBar";
import type { Profile } from "@/lib/data/types";
import { cn, initials } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/tracks", label: "Tracks", icon: BookOpen },
  { href: "/gauntlet", label: "Gauntlet", icon: Swords },
  { href: "/quests", label: "Quests", icon: Target },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/pods", label: "Pods", icon: Users },
  { href: "/store", label: "Store", icon: ShoppingBag },
  { href: "/credentials", label: "Credentials", icon: Medal },
];

export function AppNav({ profile, unreadCount }: { profile: Profile; unreadCount: number }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bsc-navy/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3">
        <Link href="/dashboard" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white/70 transition-colors",
                  active
                    ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <StreakFlame days={profile.streakDays} />
            <BFCWallet bfc={profile.bfc} />
          </div>

          <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/70" />
                <span className="relative h-2 w-2 rounded-full bg-primary" />
              </span>
            ) : null}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-full outline-none ring-ring/40 transition hover:ring-2"
                aria-label="Account menu"
              >
                <Avatar className="h-9 w-9 ring-1 ring-white/10">
                  <AvatarFallback>{initials(profile.displayName)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{initials(profile.displayName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">
                    {profile.displayName}
                  </div>
                  <div className="truncate text-xs text-white/60">{profile.email}</div>
                </div>
              </div>
              <div className="px-2 pb-2">
                <XPBar xp={profile.xp} />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/credentials">
                  <Medal className="mr-2 h-4 w-4" /> My credentials
                </Link>
              </DropdownMenuItem>
              {profile.role === "admin" || profile.role === "coach" ? (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Gauge className="mr-2 h-4 w-4" /> Admin
                  </Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/sign-out">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="lg:hidden overflow-x-auto scrollbar-thin border-t border-white/5">
        <nav className="flex gap-1 px-4 py-2">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-white/70",
                  active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 pb-3 pt-1 md:hidden">
        <StreakFlame days={profile.streakDays} />
        <BFCWallet bfc={profile.bfc} />
        <Badge variant="outline" className="ml-auto">
          <Zap className="h-3 w-3 text-primary" /> {profile.xp.toLocaleString()} XP
        </Badge>
      </div>
    </header>
  );
}
