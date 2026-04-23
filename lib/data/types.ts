export type TrackCode = "101" | "201" | "301";

export interface Profile {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  streakShields: number;
  bfc: number;
  lastActiveAt: string;
  role: "student" | "coach" | "admin";
  favoriteRole?: string;
  createdAt: string;
}

export interface Track {
  id: string;
  code: TrackCode;
  name: string;
  description: string;
  accentColor: string;
  sortOrder: number;
  enabled: boolean;
}

export interface ModuleItem {
  id: string;
  trackId: string;
  code: string;
  title: string;
  description: string;
  sortOrder: number;
  enabled: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  code: string; // e.g. "T201-M1-L2"
  title: string;
  summary: string;
  sortOrder: number;
  slidePdfUrl?: string | null;
  spotifyEpisodeUrl?: string | null;
  activityUrl?: string | null;
  activityRepo?: string | null;
  xpValue: number;
  nextLessonId?: string | null;
  enabled: boolean;
  estimatedMinutes?: number;
  roleFocus?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export interface ClaimCode {
  code: string;
  lessonId: string;
  issuedToUserId?: string | null;
  xp: number;
  tier?: "BRONZE" | "SILVER" | "GOLD" | null;
  completionType: "LESSON" | "MODULE_FINAL" | "TRACK_FINAL" | "GAUNTLET";
  theme?: string;
}

export interface Claim {
  id: string;
  userId: string;
  claimCode: string;
  lessonId: string;
  xpAwarded: number;
  tier?: "BRONZE" | "SILVER" | "GOLD" | null;
  source: "AUTO" | "MANUAL";
  deltaReason?: string;
  submittedAt: string;
}

export interface XpLedgerEntry {
  id: string;
  userId: string;
  delta: number;
  balanceAfter: number;
  action: string;
  refTable?: string;
  refId?: string;
  note?: string;
  ts: string;
}

export interface Credential {
  id: string;
  userId: string;
  track: TrackCode;
  levelName: string;
  passId: string;
  issuedAt: string;
  status: "ACTIVE" | "REVOKED";
}

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  awardedAt: string;
}

export interface StoreItem {
  id: string;
  code: string;
  name: string;
  description: string;
  category: "GM_CARD" | "AVATAR" | "TITLE" | "CONTENT" | "COSMETIC";
  priceBfc: number;
  givesBadgeId?: string | null;
  givesTitleId?: string | null;
  contentLink?: string | null;
  previewImage?: string | null;
  enabled: boolean;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

export interface Pod {
  id: string;
  name: string;
  emoji?: string;
  seasonId?: string;
  status: "ACTIVE" | "ARCHIVED";
  memberCount: number;
  totalXp: number;
  ranking?: number;
}

export interface Quest {
  id: string;
  code: string;
  title: string;
  description: string;
  targetType: string;
  rewardPoints: number;
  rewardBadgeId?: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
  cadence: "DAILY" | "WEEKLY" | "ONE_TIME";
  enabled: boolean;
  progress?: number;
  goal?: number;
  completed?: boolean;
}

export interface Season {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: "ACTIVE" | "CLOSED" | "UPCOMING";
}

export interface LiveEvent {
  id: string;
  seasonId?: string;
  title: string;
  description: string;
  trackCode?: TrackCode;
  moduleCode?: string;
  openAt: string;
  closeAt: string;
  status: "UPCOMING" | "LIVE" | "CLOSED";
  participants?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  kind: "xp" | "levelup" | "badge" | "pass" | "quest" | "event" | "system";
  status: "UNREAD" | "READ";
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  showAt: string;
  autoHideAt?: string;
  status: "ACTIVE" | "SCHEDULED" | "ARCHIVED";
}

export interface LeaderboardRow {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  xp: number;
  level: number;
  streakDays: number;
  levelTitle: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  xpEarned: number;
  tier?: "BRONZE" | "SILVER" | "GOLD" | null;
  submittedAt?: string;
}
