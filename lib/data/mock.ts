import type {
  Announcement,
  Badge,
  Claim,
  ClaimCode,
  Credential,
  LeaderboardRow,
  Lesson,
  LessonProgress,
  LiveEvent,
  ModuleItem,
  NotificationItem,
  Pod,
  Profile,
  Quest,
  Season,
  StoreItem,
  Track,
  UserBadge,
  XpLedgerEntry,
} from "./types";

/*
 * Mock data layer. Realistic, demo-ready data so every page looks alive
 * without a Supabase project. Once DATABASE_URL is wired and
 * BSC_USE_MOCK_DATA=0, the app transparently reads from Postgres instead.
 */

export const mockProfile: Profile = {
  userId: "u_demo",
  email: "you@bowsportscapital.com",
  displayName: "You",
  avatarUrl: null,
  xp: 1840,
  level: 7,
  levelTitle: "Senior Analyst",
  streakDays: 6,
  streakShields: 1,
  bfc: 325,
  lastActiveAt: new Date().toISOString(),
  role: "student",
  favoriteRole: "GM",
  createdAt: "2025-11-02T14:22:00Z",
};

export const mockTracks: Track[] = [
  {
    id: "t_101",
    code: "101",
    name: "Rookie GM Foundations",
    description:
      "Your front-office boot camp. Learn contracts, salary caps, trade value, and how to think like a Scout.",
    accentColor: "#22c55e",
    sortOrder: 1,
    enabled: true,
  },
  {
    id: "t_201",
    code: "201",
    name: "Front Office",
    description:
      "Operate like an Analyst turned Associate. Build a championship roster under real constraints.",
    accentColor: "#2563eb",
    sortOrder: 2,
    enabled: true,
  },
  {
    id: "t_301",
    code: "301",
    name: "Owner's Suite",
    description:
      "Strategy at the top. Media rights, ownership economics, brand, and league-level decisions.",
    accentColor: "#f59e0b",
    sortOrder: 3,
    enabled: true,
  },
];

export const mockModules: ModuleItem[] = [
  // 101
  { id: "m_101_1", trackId: "t_101", code: "M1", title: "Meet the Front Office", description: "What a GM actually does day to day.", sortOrder: 1, enabled: true },
  { id: "m_101_2", trackId: "t_101", code: "M2", title: "Contracts 101", description: "Guaranteed vs team options, the basics of a deal.", sortOrder: 2, enabled: true },
  { id: "m_101_3", trackId: "t_101", code: "M3", title: "The Salary Cap", description: "Why one line item shapes every decision.", sortOrder: 3, enabled: true },
  { id: "m_101_4", trackId: "t_101", code: "M4", title: "Scouting & Value", description: "How to price a player beyond their box score.", sortOrder: 4, enabled: true },
  // 201
  { id: "m_201_1", trackId: "t_201", code: "M1", title: "Roster Construction", description: "Trades, free agency, extensions — the full kit.", sortOrder: 1, enabled: true },
  { id: "m_201_2", trackId: "t_201", code: "M2", title: "The Draft", description: "Asset value, trade pick optionality, best player available.", sortOrder: 2, enabled: true },
  { id: "m_201_3", trackId: "t_201", code: "M3", title: "Luxury Tax & Apron", description: "Second apron, repeater penalties, hard caps.", sortOrder: 3, enabled: true },
  { id: "m_201_4", trackId: "t_201", code: "M4", title: "The Gauntlet", description: "3 levels of mastery simulations. Earn Bronze, Silver, Gold.", sortOrder: 4, enabled: true },
  // 301
  { id: "m_301_1", trackId: "t_301", code: "M1", title: "Ownership Economics", description: "How a team actually makes money.", sortOrder: 1, enabled: true },
  { id: "m_301_2", trackId: "t_301", code: "M2", title: "Media Rights", description: "The biggest revenue lever in sports.", sortOrder: 2, enabled: true },
  { id: "m_301_3", trackId: "t_301", code: "M3", title: "League Strategy", description: "Expansion, relocation, CBAs.", sortOrder: 3, enabled: true },
];

export const mockLessons: Lesson[] = [
  // 101 M1
  { id: "l_101_1_1", moduleId: "m_101_1", code: "T101-M1-L1", title: "What is a Front Office?", summary: "The cast of characters that actually runs a franchise.", sortOrder: 1, slidePdfUrl: "/sample-slides/T101-M1-L1.pdf", spotifyEpisodeUrl: "https://open.spotify.com/embed/episode/3cUINFuESZjnJbFP9ubLAf", activityUrl: null, xpValue: 100, nextLessonId: "l_101_1_2", enabled: true, estimatedMinutes: 18, roleFocus: "Scout", difficulty: "Easy" },
  { id: "l_101_1_2", moduleId: "m_101_1", code: "T101-M1-L2", title: "A Day in the Life of a GM", summary: "Morning calls, cap-sheet math, scouting tape.", sortOrder: 2, slidePdfUrl: "/sample-slides/T101-M1-L2.pdf", spotifyEpisodeUrl: "https://open.spotify.com/embed/episode/7eSTeK1VzIbjiWztZPFjoj", activityUrl: null, xpValue: 100, nextLessonId: "l_101_2_1", enabled: true, estimatedMinutes: 22, roleFocus: "GM", difficulty: "Easy" },
  // 101 M2
  { id: "l_101_2_1", moduleId: "m_101_2", code: "T101-M2-L1", title: "The Anatomy of a Contract", summary: "Base salary, bonuses, trade kickers, no-trade clauses.", sortOrder: 1, slidePdfUrl: "/sample-slides/T101-M2-L1.pdf", spotifyEpisodeUrl: null, activityUrl: null, xpValue: 100, nextLessonId: "l_101_2_2", enabled: true, estimatedMinutes: 20, roleFocus: "Analyst", difficulty: "Easy" },
  { id: "l_101_2_2", moduleId: "m_101_2", code: "T101-M2-L2", title: "Options, Years, and Risk", summary: "Why a 3rd year option is worth more than you think.", sortOrder: 2, slidePdfUrl: "/sample-slides/T101-M2-L2.pdf", spotifyEpisodeUrl: null, activityUrl: null, xpValue: 100, nextLessonId: "l_101_3_1", enabled: true, estimatedMinutes: 24, roleFocus: "Analyst", difficulty: "Medium" },
  // 201 M1
  { id: "l_201_1_1", moduleId: "m_201_1", code: "T201-M1-L1", title: "Building the Roster", summary: "Role players, stars, and the 14th man on the bench.", sortOrder: 1, slidePdfUrl: "/sample-slides/T201-M1-L1.pdf", spotifyEpisodeUrl: null, activityUrl: null, xpValue: 150, nextLessonId: "l_201_1_2", enabled: true, estimatedMinutes: 26, roleFocus: "GM", difficulty: "Medium" },
  { id: "l_201_1_2", moduleId: "m_201_1", code: "T201-M1-L2", title: "NBA GM Crisis Manager", summary: "Interactive: pick a team, make 5 moves, hit your wins + cap targets.", sortOrder: 2, slidePdfUrl: "/sample-slides/T201-M1-L2.pdf", spotifyEpisodeUrl: null, activityUrl: "https://braydenokley13-ux.github.io/T201-M1-L2/", activityRepo: "braydenokley13-ux/T201-M1-L2", xpValue: 150, nextLessonId: "l_201_1_3", enabled: true, estimatedMinutes: 35, roleFocus: "GM", difficulty: "Hard" },
  { id: "l_201_1_3", moduleId: "m_201_1", code: "T201-M1-L3", title: "Trading for Value", summary: "BPA vs fit. When to pay up and when to walk.", sortOrder: 3, slidePdfUrl: "/sample-slides/T201-M1-L3.pdf", spotifyEpisodeUrl: null, activityUrl: null, xpValue: 150, nextLessonId: "l_201_2_1", enabled: true, estimatedMinutes: 22, roleFocus: "Associate", difficulty: "Medium" },
  // 201 M4 - Gauntlet
  { id: "l_201_4_1", moduleId: "m_201_4", code: "T201-M4-G1", title: "Gauntlet · Level 1", summary: "One team, one season, one shot. BRONZE / SILVER / GOLD.", sortOrder: 1, slidePdfUrl: null, spotifyEpisodeUrl: null, activityUrl: "https://braydenokley13-ux.github.io/gauntlet-l1/", xpValue: 100, nextLessonId: "l_201_4_2", enabled: true, estimatedMinutes: 40, roleFocus: "GM", difficulty: "Hard" },
  { id: "l_201_4_2", moduleId: "m_201_4", code: "T201-M4-G2", title: "Gauntlet · Level 2", summary: "Two teams, colliding rebuild timelines.", sortOrder: 2, slidePdfUrl: null, spotifyEpisodeUrl: null, activityUrl: "https://braydenokley13-ux.github.io/gauntlet-l2/", xpValue: 150, nextLessonId: "l_201_4_3", enabled: true, estimatedMinutes: 45, roleFocus: "GM", difficulty: "Hard" },
  { id: "l_201_4_3", moduleId: "m_201_4", code: "T201-M4-G3", title: "Gauntlet · Level 3", summary: "Championship leverage, under a hard cap.", sortOrder: 3, slidePdfUrl: null, spotifyEpisodeUrl: null, activityUrl: "https://braydenokley13-ux.github.io/gauntlet-l3/", xpValue: 200, nextLessonId: null, enabled: true, estimatedMinutes: 60, roleFocus: "President", difficulty: "Hard" },
];

export const mockLessonProgress: LessonProgress[] = [
  { lessonId: "l_101_1_1", completed: true, xpEarned: 100, submittedAt: "2025-12-12T17:00:00Z" },
  { lessonId: "l_101_1_2", completed: true, xpEarned: 100, submittedAt: "2025-12-15T19:05:00Z" },
  { lessonId: "l_101_2_1", completed: true, xpEarned: 100, submittedAt: "2026-01-04T20:11:00Z" },
  { lessonId: "l_101_2_2", completed: true, xpEarned: 100, submittedAt: "2026-01-08T18:33:00Z" },
  { lessonId: "l_201_1_1", completed: true, xpEarned: 150, submittedAt: "2026-01-28T21:40:00Z" },
  { lessonId: "l_201_1_2", completed: false, xpEarned: 0 },
];

export const mockClaimCodes: ClaimCode[] = [
  { code: "T201-M1-L2-GMN", lessonId: "l_201_1_2", xp: 150, completionType: "LESSON", theme: "bucks" },
  { code: "T201-M1-L2-SPR", lessonId: "l_201_1_2", xp: 150, completionType: "LESSON", theme: "spurs" },
  { code: "GAUNTLET-L1-GOLD-SAMPLE", lessonId: "l_201_4_1", xp: 100, tier: "GOLD", completionType: "GAUNTLET" },
];

export const mockClaims: Claim[] = mockLessonProgress
  .filter((p) => p.completed)
  .map((p, i) => ({
    id: `c_${i}`,
    userId: "u_demo",
    claimCode: `MOCK-${p.lessonId}`,
    lessonId: p.lessonId,
    xpAwarded: p.xpEarned,
    source: "AUTO" as const,
    submittedAt: p.submittedAt ?? new Date().toISOString(),
  }));

export const mockXpLedger: XpLedgerEntry[] = mockClaims.map((c, i) => ({
  id: `x_${i}`,
  userId: c.userId,
  delta: c.xpAwarded,
  balanceAfter: 100 * (i + 1),
  action: "CLAIM_CODE",
  refTable: "claims",
  refId: c.id,
  note: `Lesson ${c.lessonId}`,
  ts: c.submittedAt,
}));

export const mockCredentials: Credential[] = [
  { id: "cr_1", userId: "u_demo", track: "101", levelName: "Analyst", passId: "BOW-101-AN-4F8K2Q", issuedAt: "2026-01-08T18:33:00Z", status: "ACTIVE" },
  { id: "cr_2", userId: "u_demo", track: "201", levelName: "Analyst", passId: "BOW-201-AN-9M3LP1", issuedAt: "2026-01-28T21:40:00Z", status: "ACTIVE" },
];

export const mockBadges: Badge[] = [
  { id: "b_scout", code: "FIRST_CLAIM", name: "First Claim", description: "Submit your first claim code.", category: "milestone", rarity: "common" },
  { id: "b_streak5", code: "STREAK_5", name: "On Fire", description: "5-day login streak.", category: "streak", rarity: "common" },
  { id: "b_streak10", code: "STREAK_10", name: "Unstoppable", description: "10-day streak. Impressive.", category: "streak", rarity: "rare" },
  { id: "b_xp1k", code: "XP_1000", name: "1K Club", description: "Earn 1,000 lifetime XP.", category: "xp", rarity: "rare" },
  { id: "b_xp5k", code: "XP_5000", name: "5K Elite", description: "Earn 5,000 lifetime XP.", category: "xp", rarity: "epic" },
  { id: "b_gold1", code: "GAUNTLET_L1_GOLD", name: "Gauntlet L1 Gold", description: "Earn Gold on Gauntlet Level 1.", category: "gauntlet", rarity: "epic" },
  { id: "b_master", code: "GAUNTLET_MASTER", name: "Gauntlet Master", description: "Complete all 3 Gauntlet levels.", category: "gauntlet", rarity: "legendary" },
];

export const mockUserBadges: UserBadge[] = [
  { userId: "u_demo", badgeId: "b_scout", awardedAt: "2025-12-12T17:00:00Z" },
  { userId: "u_demo", badgeId: "b_streak5", awardedAt: "2026-01-05T08:15:00Z" },
  { userId: "u_demo", badgeId: "b_xp1k", awardedAt: "2026-01-28T21:40:00Z" },
];

export const mockStoreItems: StoreItem[] = [
  { id: "si_1", code: "CARD_SCOUT_HOLO", name: "Holo Scout Card", description: "A gleaming holographic version of your GM card.", category: "GM_CARD", priceBfc: 500, previewImage: null, enabled: true, rarity: "rare" },
  { id: "si_2", code: "TITLE_ARCHITECT", name: "Title: \"The Architect\"", description: "Equip a rare title beside your name across the platform.", category: "TITLE", priceBfc: 300, givesTitleId: "t_architect", enabled: true, rarity: "rare" },
  { id: "si_3", code: "AVATAR_FROST", name: "Frost Avatar Frame", description: "Icy blue avatar ring with animated glow.", category: "AVATAR", priceBfc: 150, enabled: true, rarity: "common" },
  { id: "si_4", code: "CONTENT_PLAYBOOK", name: "The Front Office Playbook (PDF)", description: "A 40-page deep dive. Unlocks a permanent download.", category: "CONTENT", priceBfc: 750, contentLink: "/unlocks/playbook.pdf", enabled: true, rarity: "epic" },
  { id: "si_5", code: "TITLE_DYNASTY", name: "Title: \"Dynasty Builder\"", description: "Only the best wear this.", category: "TITLE", priceBfc: 1200, enabled: true, rarity: "legendary" },
  { id: "si_6", code: "CARD_GOLD_LEAF", name: "Gold-Leaf GM Card", description: "24k treatment on your digital card.", category: "GM_CARD", priceBfc: 1500, enabled: true, rarity: "legendary" },
];

export const mockPods: Pod[] = [
  { id: "p_1", name: "Analytics Wolves", emoji: "🐺", status: "ACTIVE", memberCount: 8, totalXp: 14220, ranking: 1 },
  { id: "p_2", name: "Cap Masters", emoji: "💼", status: "ACTIVE", memberCount: 7, totalXp: 12810, ranking: 2 },
  { id: "p_3", name: "Draft Kings", emoji: "👑", status: "ACTIVE", memberCount: 6, totalXp: 11440, ranking: 3 },
  { id: "p_4", name: "Front-Office Rookies", emoji: "🎯", status: "ACTIVE", memberCount: 9, totalXp: 9820, ranking: 4 },
];

export const mockQuests: Quest[] = [
  { id: "q_1", code: "DAILY_CLAIM", title: "Earn XP today", description: "Submit any claim code today.", targetType: "CLAIM", rewardPoints: 25, difficulty: "Easy", cadence: "DAILY", enabled: true, progress: 1, goal: 1, completed: true },
  { id: "q_2", code: "DAILY_PODCAST", title: "Listen to a podcast", description: "Open any podcast episode.", targetType: "PODCAST_OPEN", rewardPoints: 15, difficulty: "Easy", cadence: "DAILY", enabled: true, progress: 0, goal: 1, completed: false },
  { id: "q_3", code: "WEEKLY_GAUNTLET", title: "Attempt the Gauntlet", description: "Complete one Gauntlet attempt this week.", targetType: "GAUNTLET_ATTEMPT", rewardPoints: 100, difficulty: "Hard", cadence: "WEEKLY", enabled: true, progress: 0, goal: 1, completed: false },
  { id: "q_4", code: "WEEKLY_THREE", title: "Triple threat", description: "Complete 3 lessons this week.", targetType: "LESSONS_COMPLETE", rewardPoints: 75, difficulty: "Medium", cadence: "WEEKLY", enabled: true, progress: 2, goal: 3, completed: false },
];

export const mockSeason: Season = {
  id: "s_winter_26",
  title: "Winter '26 Championship",
  startsAt: "2026-01-01T00:00:00Z",
  endsAt: "2026-06-30T23:59:59Z",
  status: "ACTIVE",
};

export const mockLiveEvents: LiveEvent[] = [
  { id: "e_1", seasonId: "s_winter_26", title: "Trade Deadline Sprint", description: "Live 1-hour trade-deadline sim. Top score wins 500 BFC.", trackCode: "201", openAt: "2026-05-02T19:00:00Z", closeAt: "2026-05-02T20:00:00Z", status: "UPCOMING", participants: 42 },
  { id: "e_2", seasonId: "s_winter_26", title: "Draft Night Challenge", description: "Build a draft board, earn XP for each correct BPA pick.", trackCode: "201", openAt: "2026-04-28T18:00:00Z", closeAt: "2026-04-28T21:00:00Z", status: "UPCOMING", participants: 61 },
];

export const mockNotifications: NotificationItem[] = [
  { id: "n_1", userId: "u_demo", title: "You earned 100 XP!", body: "Lesson T101-M2-L2 — great work.", kind: "xp", status: "UNREAD", createdAt: "2026-04-22T20:10:00Z" },
  { id: "n_2", userId: "u_demo", title: "Level up — Senior Analyst", body: "You've unlocked the Senior Analyst title.", kind: "levelup", status: "UNREAD", createdAt: "2026-04-21T16:05:00Z" },
  { id: "n_3", userId: "u_demo", title: "Gauntlet L1 is live", body: "3-day window opens tomorrow.", kind: "event", status: "READ", createdAt: "2026-04-18T12:00:00Z" },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "a_1",
    title: "Season 2 Kickoff",
    body: "Winter '26 Championship is live. Podcasts drop every Tuesday.",
    showAt: "2026-01-01T00:00:00Z",
    status: "ACTIVE",
  },
];

export const mockLeaderboard: LeaderboardRow[] = [
  { rank: 1, userId: "u_1", displayName: "Rafael M.", xp: 11420, level: 16, streakDays: 38, levelTitle: "SVP, Front Office" },
  { rank: 2, userId: "u_2", displayName: "Priya K.", xp: 9880, level: 15, streakDays: 22, levelTitle: "VP, Basketball Ops" },
  { rank: 3, userId: "u_3", displayName: "Dom A.", xp: 8420, level: 14, streakDays: 19, levelTitle: "VP, Strategy" },
  { rank: 4, userId: "u_4", displayName: "Avery W.", xp: 7300, level: 13, streakDays: 12, levelTitle: "Director of Operations" },
  { rank: 5, userId: "u_5", displayName: "Malik J.", xp: 5940, level: 12, streakDays: 8, levelTitle: "Director of Analytics" },
  { rank: 6, userId: "u_6", displayName: "Noor H.", xp: 4820, level: 11, streakDays: 17, levelTitle: "Deputy Director" },
  { rank: 7, userId: "u_7", displayName: "Casey D.", xp: 3810, level: 10, streakDays: 5, levelTitle: "Senior Associate" },
  { rank: 8, userId: "u_demo", displayName: "You", xp: 1840, level: 7, streakDays: 6, levelTitle: "Senior Analyst" },
  { rank: 9, userId: "u_9", displayName: "Sam R.", xp: 1620, level: 6, streakDays: 3, levelTitle: "Analyst II" },
  { rank: 10, userId: "u_10", displayName: "Juno S.", xp: 1280, level: 6, streakDays: 9, levelTitle: "Analyst II" },
];

export const mockRoster = [
  { userId: "u_1", displayName: "Rafael M.", email: "rafael.m@demo.com", xp: 11420, level: 16, streakDays: 38, lastActive: "2026-04-22T21:10:00Z", risk: "low" },
  { userId: "u_2", displayName: "Priya K.", email: "priya.k@demo.com", xp: 9880, level: 15, streakDays: 22, lastActive: "2026-04-22T18:45:00Z", risk: "low" },
  { userId: "u_3", displayName: "Dom A.", email: "dom.a@demo.com", xp: 8420, level: 14, streakDays: 19, lastActive: "2026-04-22T14:12:00Z", risk: "low" },
  { userId: "u_4", displayName: "Avery W.", email: "avery.w@demo.com", xp: 7300, level: 13, streakDays: 0, lastActive: "2026-04-15T09:00:00Z", risk: "medium" },
  { userId: "u_5", displayName: "Malik J.", email: "malik.j@demo.com", xp: 5940, level: 12, streakDays: 8, lastActive: "2026-04-22T22:00:00Z", risk: "low" },
  { userId: "u_6", displayName: "Noor H.", email: "noor.h@demo.com", xp: 4820, level: 11, streakDays: 17, lastActive: "2026-04-22T11:30:00Z", risk: "low" },
  { userId: "u_7", displayName: "Casey D.", email: "casey.d@demo.com", xp: 3810, level: 10, streakDays: 0, lastActive: "2026-04-10T16:00:00Z", risk: "high" },
  { userId: "u_demo", displayName: "You", email: "you@bowsportscapital.com", xp: 1840, level: 7, streakDays: 6, lastActive: new Date().toISOString(), risk: "low" },
];
