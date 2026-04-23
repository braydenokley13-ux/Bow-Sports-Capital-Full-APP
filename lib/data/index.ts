import {
  mockAnnouncements,
  mockBadges,
  mockClaims,
  mockClaimCodes,
  mockCredentials,
  mockLeaderboard,
  mockLessons,
  mockLessonProgress,
  mockLiveEvents,
  mockModules,
  mockNotifications,
  mockPods,
  mockProfile,
  mockQuests,
  mockRoster,
  mockSeason,
  mockStoreItems,
  mockTracks,
  mockUserBadges,
  mockXpLedger,
} from "./mock";
import type { LeaderboardRow, Lesson, Profile, TrackCode } from "./types";

/*
 * Data layer — returns real DB data when Supabase is configured, or the
 * mock dataset otherwise. The rest of the app never talks to Supabase
 * directly. Switch with BSC_USE_MOCK_DATA=0 and DATABASE_URL set.
 */

const USE_MOCK =
  process.env.BSC_USE_MOCK_DATA === "1" || !process.env.DATABASE_URL;

export async function getProfile(userId?: string): Promise<Profile> {
  void userId;
  if (USE_MOCK) return mockProfile;
  return mockProfile; // TODO: Drizzle query
}

export async function getTracks() {
  return mockTracks;
}

export async function getTrackByCode(code: TrackCode) {
  return mockTracks.find((t) => t.code === code) ?? null;
}

export async function getModulesForTrack(trackId: string) {
  return mockModules.filter((m) => m.trackId === trackId);
}

export async function getLessonsForModule(moduleId: string) {
  return mockLessons.filter((l) => l.moduleId === moduleId);
}

export async function getLessonByCode(code: string): Promise<Lesson | null> {
  return mockLessons.find((l) => l.code === code) ?? null;
}

export async function getAllLessons() {
  return mockLessons;
}

export async function getLessonProgress(userId: string) {
  void userId;
  return mockLessonProgress;
}

export async function getNextLesson(userId: string) {
  const progress = await getLessonProgress(userId);
  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
  return mockLessons.find((l) => !completedIds.has(l.id)) ?? null;
}

export async function getXpLedger(userId: string, limit = 20) {
  void userId;
  return mockXpLedger.slice(-limit).reverse();
}

export async function getCredentials(userId: string) {
  void userId;
  return mockCredentials;
}

export async function getCredentialByPassId(passId: string) {
  return mockCredentials.find((c) => c.passId.toUpperCase() === passId.toUpperCase()) ?? null;
}

export async function getBadges() {
  return mockBadges;
}

export async function getUserBadges(userId: string) {
  void userId;
  return mockUserBadges;
}

export async function getStoreItems() {
  return mockStoreItems.filter((s) => s.enabled);
}

export async function getPods() {
  return mockPods;
}

export async function getQuests(userId: string) {
  void userId;
  return mockQuests;
}

export async function getCurrentSeason() {
  return mockSeason;
}

export async function getUpcomingEvents() {
  return mockLiveEvents;
}

export async function getNotifications(userId: string) {
  void userId;
  return mockNotifications;
}

export async function getAnnouncements() {
  return mockAnnouncements;
}

export async function getLeaderboard(track?: TrackCode): Promise<LeaderboardRow[]> {
  void track;
  return mockLeaderboard;
}

export async function getRoster() {
  return mockRoster;
}

export async function findClaimCode(code: string) {
  return mockClaimCodes.find((c) => c.code.toUpperCase() === code.toUpperCase()) ?? null;
}

export async function recentClaims(userId: string) {
  void userId;
  return mockClaims.slice().reverse();
}
