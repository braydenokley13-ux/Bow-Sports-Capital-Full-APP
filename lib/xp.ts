export interface LevelTitle {
  level: number;
  xpRequired: number;
  title: string;
}

// Level ladder — each level requires ~20% more XP than the last, capped at 50
export const LEVEL_TITLES: LevelTitle[] = [
  { level: 1, xpRequired: 0, title: "Intern" },
  { level: 2, xpRequired: 100, title: "Scout" },
  { level: 3, xpRequired: 250, title: "Scout II" },
  { level: 4, xpRequired: 450, title: "Junior Analyst" },
  { level: 5, xpRequired: 700, title: "Analyst" },
  { level: 6, xpRequired: 1000, title: "Analyst II" },
  { level: 7, xpRequired: 1400, title: "Senior Analyst" },
  { level: 8, xpRequired: 1900, title: "Associate" },
  { level: 9, xpRequired: 2500, title: "Associate II" },
  { level: 10, xpRequired: 3200, title: "Senior Associate" },
  { level: 11, xpRequired: 4000, title: "Deputy Director" },
  { level: 12, xpRequired: 5000, title: "Director of Analytics" },
  { level: 13, xpRequired: 6200, title: "Director of Operations" },
  { level: 14, xpRequired: 7600, title: "VP, Strategy" },
  { level: 15, xpRequired: 9200, title: "VP, Basketball Ops" },
  { level: 16, xpRequired: 11000, title: "SVP, Front Office" },
  { level: 17, xpRequired: 13000, title: "Assistant GM" },
  { level: 18, xpRequired: 15500, title: "General Manager" },
  { level: 19, xpRequired: 18500, title: "President of Ops" },
  { level: 20, xpRequired: 22000, title: "Franchise Architect" },
  { level: 21, xpRequired: 26000, title: "Championship Caliber" },
  { level: 22, xpRequired: 30500, title: "Dynasty Builder" },
  { level: 23, xpRequired: 35500, title: "League MVP of Thought" },
  { level: 24, xpRequired: 41000, title: "Owner" },
  { level: 25, xpRequired: 47000, title: "Hall of Fame" },
];

export function levelFromXp(xp: number): { level: number; title: string; nextAtXp: number; progressPct: number } {
  let current = LEVEL_TITLES[0];
  let next = LEVEL_TITLES[1] ?? LEVEL_TITLES[0];
  for (let i = 0; i < LEVEL_TITLES.length; i += 1) {
    const l = LEVEL_TITLES[i];
    if (xp >= l.xpRequired) {
      current = l;
      next = LEVEL_TITLES[i + 1] ?? l;
    } else {
      break;
    }
  }
  const span = Math.max(1, next.xpRequired - current.xpRequired);
  const progressPct = Math.round(((xp - current.xpRequired) / span) * 100);
  return {
    level: current.level,
    title: current.title,
    nextAtXp: next.xpRequired,
    progressPct: Math.max(0, Math.min(100, progressPct)),
  };
}

export const GAUNTLET_XP: Record<number, { BRONZE: number; SILVER: number; GOLD: number }> = {
  1: { BRONZE: 50, SILVER: 75, GOLD: 100 },
  2: { BRONZE: 60, SILVER: 100, GOLD: 150 },
  3: { BRONZE: 75, SILVER: 125, GOLD: 200 },
};

export const TIER_RANK: Record<"BRONZE" | "SILVER" | "GOLD", number> = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
};

export interface PassLadder {
  track: "101" | "201" | "301";
  ladder: string[];
  accentColor: string;
  name: string;
}

export const PASS_LADDERS: PassLadder[] = [
  { track: "101", name: "Rookie GM Foundations", accentColor: "#22c55e", ladder: ["Scout", "Analyst", "Associate", "Director"] },
  { track: "201", name: "Front Office", accentColor: "#2563eb", ladder: ["Analyst", "Associate", "Senior Associate", "Director"] },
  { track: "301", name: "Owner's Suite", accentColor: "#f59e0b", ladder: ["Associate", "Director", "VP", "President"] },
];

export function passFromModulesCompleted(
  track: "101" | "201" | "301",
  modulesCompleted: number,
  trackComplete: boolean,
): string | null {
  const ladder = PASS_LADDERS.find((l) => l.track === track)?.ladder ?? [];
  if (trackComplete) return ladder[ladder.length - 1] ?? null;
  if (modulesCompleted >= 3) return ladder[2] ?? null;
  if (modulesCompleted >= 2) return ladder[1] ?? null;
  if (modulesCompleted >= 1) return ladder[0] ?? null;
  return null;
}

export function normalizeTier(t: unknown): "BRONZE" | "SILVER" | "GOLD" | null {
  if (typeof t !== "string") return null;
  const up = t.trim().toUpperCase();
  if (up === "BRONZE" || up === "SILVER" || up === "GOLD") return up;
  return null;
}

export function xpColor(xp: number) {
  if (xp >= 10000) return "#f59e0b";
  if (xp >= 3000) return "#38bdf8";
  return "#2563eb";
}
