import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/*
 * Bow Sports Capital — Postgres / Drizzle schema
 *
 * Every user-scoped table should have RLS enabled in Supabase and a policy
 * that restricts read/write to (auth.uid() = user_id). Admin service-role
 * bypasses. See scripts/rls.sql for the policy bundle.
 */

// Reference auth.users as a read-only pgSchema table so we can FK it.
const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", { id: uuid("id").primaryKey() });

export const roleEnum = pgEnum("bsc_role", ["student", "coach", "admin"]);
export const claimSourceEnum = pgEnum("bsc_claim_source", ["AUTO", "MANUAL"]);
export const completionTypeEnum = pgEnum("bsc_completion_type", [
  "LESSON",
  "MODULE_FINAL",
  "TRACK_FINAL",
  "GAUNTLET",
]);
export const tierEnum = pgEnum("bsc_tier", ["BRONZE", "SILVER", "GOLD"]);
export const statusEnum = pgEnum("bsc_status", ["ACTIVE", "ARCHIVED", "REVOKED"]);
export const rarityEnum = pgEnum("bsc_rarity", ["common", "rare", "epic", "legendary"]);
export const questCadenceEnum = pgEnum("bsc_quest_cadence", ["DAILY", "WEEKLY", "ONE_TIME"]);
export const notificationKindEnum = pgEnum("bsc_notif_kind", [
  "xp",
  "levelup",
  "badge",
  "pass",
  "quest",
  "event",
  "system",
]);

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  levelTitle: text("level_title").notNull().default("Intern"),
  streakDays: integer("streak_days").notNull().default(0),
  streakShields: integer("streak_shields").notNull().default(0),
  bfc: integer("bfc").notNull().default(0),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }).defaultNow(),
  role: roleEnum("role").notNull().default("student"),
  favoriteRole: text("favorite_role"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tracks = pgTable("tracks", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  accentColor: text("accent_color").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  trackId: uuid("track_id")
    .notNull()
    .references(() => tracks.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  slidePdfUrl: text("slide_pdf_url"),
  spotifyEpisodeUrl: text("spotify_episode_url"),
  activityUrl: text("activity_url"),
  activityRepo: text("activity_repo"),
  xpValue: integer("xp_value").notNull().default(100),
  nextLessonId: uuid("next_lesson_id"),
  estimatedMinutes: integer("estimated_minutes"),
  roleFocus: text("role_focus"),
  difficulty: text("difficulty"),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const claimCodes = pgTable("claim_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
  issuedToUserId: uuid("issued_to_user_id").references(() => authUsers.id, { onDelete: "set null" }),
  xp: integer("xp").notNull().default(0),
  tier: tierEnum("tier"),
  completionType: completionTypeEnum("completion_type").notNull().default("LESSON"),
  theme: text("theme"),
  eligible: boolean("eligible").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  claimCodeId: uuid("claim_code_id").references(() => claimCodes.id, { onDelete: "set null" }),
  claimCode: text("claim_code").notNull(),
  lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
  xpAwarded: integer("xp_awarded").notNull().default(0),
  tier: tierEnum("tier"),
  source: claimSourceEnum("source").notNull().default("MANUAL"),
  deltaReason: text("delta_reason"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const xpLedger = pgTable("xp_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  delta: integer("delta").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  action: text("action").notNull(),
  refTable: text("ref_table"),
  refId: text("ref_id"),
  note: text("note"),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
});

export const credentials = pgTable("credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  track: text("track").notNull(),
  levelName: text("level_name").notNull(),
  passId: text("pass_id").notNull().unique(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  status: statusEnum("status").notNull().default("ACTIVE"),
  source: text("source"),
});

export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  category: text("category").notNull(),
  rarity: rarityEnum("rarity").notNull().default("common"),
});

export const userBadges = pgTable(
  "user_badges",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    badgeId: uuid("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.badgeId] }) }),
);

export const storeItems = pgTable("store_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  priceBfc: integer("price_bfc").notNull().default(0),
  givesBadgeId: uuid("gives_badge_id").references(() => badges.id, { onDelete: "set null" }),
  givesTitleId: text("gives_title_id"),
  contentLink: text("content_link"),
  previewImage: text("preview_image"),
  rarity: rarityEnum("rarity").notNull().default("common"),
  enabled: boolean("enabled").notNull().default(true),
});

export const inventory = pgTable(
  "inventory",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    storeItemId: uuid("store_item_id")
      .notNull()
      .references(() => storeItems.id, { onDelete: "cascade" }),
    acquiredAt: timestamp("acquired_at", { withTimezone: true }).notNull().defaultNow(),
    source: text("source"),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.storeItemId] }) }),
);

export const specialTitles = pgTable("special_titles", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  rarity: rarityEnum("rarity").notNull().default("common"),
});

export const userTitles = pgTable(
  "user_titles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    titleId: uuid("title_id")
      .notNull()
      .references(() => specialTitles.id, { onDelete: "cascade" }),
    awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
    source: text("source"),
  },
  (t) => ({ pk: primaryKey({ columns: [t.userId, t.titleId] }) }),
);

export const seasons = pgTable("seasons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("UPCOMING"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pods = pgTable("pods", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  emoji: text("emoji"),
  seasonId: uuid("season_id").references(() => seasons.id, { onDelete: "set null" }),
  status: statusEnum("status").notNull().default("ACTIVE"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const podMembers = pgTable(
  "pod_members",
  {
    podId: uuid("pod_id")
      .notNull()
      .references(() => pods.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    leftAt: timestamp("left_at", { withTimezone: true }),
    status: statusEnum("status").notNull().default("ACTIVE"),
  },
  (t) => ({ pk: primaryKey({ columns: [t.podId, t.userId] }) }),
);

export const quests = pgTable("quests", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetType: text("target_type").notNull(),
  targetJson: jsonb("target_json"),
  rewardPoints: integer("reward_points").notNull().default(0),
  rewardBadgeId: uuid("reward_badge_id").references(() => badges.id, { onDelete: "set null" }),
  difficulty: text("difficulty").notNull().default("Easy"),
  cadence: questCadenceEnum("cadence").notNull().default("DAILY"),
  enabled: boolean("enabled").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const questCompletions = pgTable("quest_completions", {
  id: uuid("id").primaryKey().defaultRandom(),
  questId: uuid("quest_id")
    .notNull()
    .references(() => quests.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("COMPLETED"),
  awardedPoints: integer("awarded_points").notNull().default(0),
  awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
  sourceRef: text("source_ref"),
});

export const liveEvents = pgTable("live_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  seasonId: uuid("season_id").references(() => seasons.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  trackCode: text("track_code"),
  moduleCode: text("module_code"),
  openAt: timestamp("open_at", { withTimezone: true }).notNull(),
  closeAt: timestamp("close_at", { withTimezone: true }).notNull(),
  rulesJson: jsonb("rules_json"),
  status: text("status").notNull().default("UPCOMING"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const eventSubmissions = pgTable("event_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => liveEvents.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  claimCode: text("claim_code"),
  score: integer("score"),
  status: text("status").notNull().default("SUBMITTED"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewedBy: uuid("reviewed_by"),
  notes: text("notes"),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull(),
  kind: notificationKindEnum("kind").notNull().default("system"),
  status: text("status").notNull().default("UNREAD"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  readAt: timestamp("read_at", { withTimezone: true }),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  showAt: timestamp("show_at", { withTimezone: true }).notNull(),
  autoHideAt: timestamp("auto_hide_at", { withTimezone: true }),
  status: text("status").notNull().default("ACTIVE"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const helpFaqs = pgTable("help_faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  audience: text("audience").notNull().default("STUDENT"),
  sortOrder: integer("sort_order").notNull().default(0),
  enabled: boolean("enabled").notNull().default(true),
});

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => authUsers.id, { onDelete: "set null" }),
  category: text("category").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  pageContext: text("page_context"),
  status: text("status").notNull().default("OPEN"),
  priority: text("priority").notNull().default("NORMAL"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  resolvedBy: uuid("resolved_by"),
  resolutionNote: text("resolution_note"),
});

export const assignments = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  trackId: uuid("track_id").references(() => tracks.id, { onDelete: "set null" }),
  moduleId: uuid("module_id").references(() => modules.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  resourceUrl: text("resource_url"),
  enabled: boolean("enabled").notNull().default(true),
});

export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("SUBMITTED"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  notes: text("notes"),
});

export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  location: text("location"),
  meetingUrl: text("meeting_url"),
  notes: text("notes"),
  enabled: boolean("enabled").notNull().default(true),
});

export const referralCodes = pgTable("referral_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  usesCount: integer("uses_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const referralRedemptions = pgTable("referral_redemptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  referralCodeId: uuid("referral_code_id")
    .notNull()
    .references(() => referralCodes.id, { onDelete: "cascade" }),
  referrerUserId: uuid("referrer_user_id").notNull(),
  referredUserId: uuid("referred_user_id").notNull(),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }).notNull().defaultNow(),
  xpAwarded: integer("xp_awarded").notNull().default(0),
});

export const adminNotes = pgTable("admin_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentUserId: uuid("student_user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  authorUserId: uuid("author_user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const engagementDaily = pgTable("engagement_daily", {
  dateKey: date("date_key").primaryKey(),
  activeStudents: integer("active_students").notNull().default(0),
  claimsSubmitted: integer("claims_submitted").notNull().default(0),
  eventsParticipated: integer("events_participated").notNull().default(0),
  questsCompleted: integer("quests_completed").notNull().default(0),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  claims: many(claims),
  badges: many(userBadges),
  credentials: many(credentials),
}));

export const tracksRelations = relations(tracks, ({ many }) => ({
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  track: one(tracks, { fields: [modules.trackId], references: [tracks.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  module: one(modules, { fields: [lessons.moduleId], references: [modules.id] }),
}));
