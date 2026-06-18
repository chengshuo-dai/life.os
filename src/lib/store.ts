/**
 * Data Store — Vercel KV wrapper with in-memory fallback for local development.
 *
 * Reads from Vercel KV when KV_URL is configured (production).
 * Falls back to an in-memory Map when running locally without KV.
 */

import type { UserSession, UserCredits, UserProfile, ArchiveTimelineEntry } from '@/models/types';

// ─── In-memory fallback store (globalThis for cross-module persistence) ──

// Use globalThis to ensure the store survives Next.js module recompilation in dev mode.
// In production with KV, this is never used.
const globalStore = globalThis as unknown as { __lifeos_store?: Map<string, any> };
if (!globalStore.__lifeos_store) {
  globalStore.__lifeos_store = new Map<string, any>();
}
const memoryStore = globalStore.__lifeos_store;

function isKVConfigured(): boolean {
  return !!(process.env.KV_URL && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvGet<T>(key: string): Promise<T | null> {
  if (isKVConfigured()) {
    const { kv } = await import('@vercel/kv');
    return await kv.get<T>(key);
  }
  return memoryStore.get(key) ?? null;
}

async function kvSet(key: string, value: any, ttlSeconds?: number): Promise<void> {
  if (isKVConfigured()) {
    const { kv } = await import('@vercel/kv');
    if (ttlSeconds) {
      await kv.set(key, value, { ex: ttlSeconds });
    } else {
      await kv.set(key, value);
    }
    return;
  }
  memoryStore.set(key, value);
  if (ttlSeconds) {
    setTimeout(() => {
      if (memoryStore.get(key) === value) {
        memoryStore.delete(key);
      }
    }, ttlSeconds * 1000);
  }
}

async function kvDelete(key: string): Promise<void> {
  if (isKVConfigured()) {
    const { kv } = await import('@vercel/kv');
    await kv.del(key);
    return;
  }
  memoryStore.delete(key);
}

// ─── Session Store ─────────────────────────────────────
const SESSION_PREFIX = 'session:';
const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days

export async function getSession(userId: string): Promise<UserSession | null> {
  return kvGet<UserSession>(`${SESSION_PREFIX}${userId}`);
}

export async function setSession(userId: string, session: UserSession): Promise<void> {
  await kvSet(`${SESSION_PREFIX}${userId}`, session, SESSION_TTL);
}

export async function deleteSession(userId: string): Promise<void> {
  await kvDelete(`${SESSION_PREFIX}${userId}`);
}

// ─── Profile Store ─────────────────────────────────────
const PROFILE_PREFIX = 'profile:';

export async function getProfile(userId: string): Promise<UserProfile | null> {
  return kvGet<UserProfile>(`${PROFILE_PREFIX}${userId}`);
}

export async function setProfile(userId: string, profile: UserProfile): Promise<void> {
  await kvSet(`${PROFILE_PREFIX}${userId}`, profile);
}

// ─── Credits Store ─────────────────────────────────────
const CREDITS_PREFIX = 'credits:';

export async function getCredits(userId: string): Promise<UserCredits | null> {
  return kvGet<UserCredits>(`${CREDITS_PREFIX}${userId}`);
}

export async function setCredits(userId: string, credits: UserCredits): Promise<void> {
  await kvSet(`${CREDITS_PREFIX}${userId}`, credits);
}

// ─── Narrative Progress Store ──────────────────────────
const PROGRESS_PREFIX = 'progress:';

export interface NarrativeProgress {
  current_node: string;
  choices_made: string[];
  progress: number;
}

export async function getNarrativeProgress(
  userId: string,
  narrativeId: string
): Promise<NarrativeProgress | null> {
  return kvGet<NarrativeProgress>(`${PROGRESS_PREFIX}${userId}:${narrativeId}`);
}

export async function setNarrativeProgress(
  userId: string,
  narrativeId: string,
  progress: NarrativeProgress
): Promise<void> {
  await kvSet(`${PROGRESS_PREFIX}${userId}:${narrativeId}`, progress);
}

// ─── Archive Store ─────────────────────────────────────
const ARCHIVE_PREFIX = 'archive:';

export async function getArchive(userId: string): Promise<ArchiveTimelineEntry[] | null> {
  return kvGet<ArchiveTimelineEntry[]>(`${ARCHIVE_PREFIX}${userId}`);
}

export async function setArchive(userId: string, entries: ArchiveTimelineEntry[]): Promise<void> {
  await kvSet(`${ARCHIVE_PREFIX}${userId}`, entries);
}

export async function appendArchiveEntry(userId: string, entry: ArchiveTimelineEntry): Promise<void> {
  const existing = await getArchive(userId);
  const entries = existing || [];
  entries.push(entry);
  await setArchive(userId, entries);
}
