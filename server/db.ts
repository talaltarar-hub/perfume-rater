import { and, avg, count, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, perfumes, ratings, users, userProfiles, userTopPerfumes, profileRatings, type InsertPerfume, type InsertRating, type InsertUserProfile, type InsertUserTopPerfume, type InsertProfileRating } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User helpers ────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Perfume helpers ──────────────────────────────────────────────────────────

export async function listPerfumesWithScores(sortBy: "top" | "newest" = "newest") {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: perfumes.id,
      name: perfumes.name,
      brand: perfumes.brand,
      description: perfumes.description,
      notes: perfumes.notes,
      imageUrl: perfumes.imageUrl,
      createdAt: perfumes.createdAt,
      avgScore: sql<number>`COALESCE(AVG(${ratings.score}), 0)`.as("avgScore"),
      voteCount: sql<number>`COUNT(${ratings.id})`.as("voteCount"),
    })
    .from(perfumes)
    .leftJoin(ratings, eq(ratings.perfumeId, perfumes.id))
    .groupBy(perfumes.id);

  if (sortBy === "top") {
    rows.sort((a, b) => (b.avgScore ?? 0) - (a.avgScore ?? 0));
  } else {
    rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return rows;
}

export async function getPerfumeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(perfumes).where(eq(perfumes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPerfumeWithScore(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const rows = await db
    .select({
      id: perfumes.id,
      name: perfumes.name,
      brand: perfumes.brand,
      description: perfumes.description,
      notes: perfumes.notes,
      imageUrl: perfumes.imageUrl,
      createdAt: perfumes.createdAt,
      updatedAt: perfumes.updatedAt,
      avgScore: sql<number>`COALESCE(AVG(${ratings.score}), 0)`.as("avgScore"),
      voteCount: sql<number>`COUNT(${ratings.id})`.as("voteCount"),
    })
    .from(perfumes)
    .leftJoin(ratings, eq(ratings.perfumeId, perfumes.id))
    .where(eq(perfumes.id, id))
    .groupBy(perfumes.id)
    .limit(1);

  return rows.length > 0 ? rows[0] : undefined;
}

export async function insertPerfume(data: InsertPerfume) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(perfumes).values(data);
  return result;
}

export async function deletePerfumeById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(ratings).where(eq(ratings.perfumeId, id));
  await db.delete(perfumes).where(eq(perfumes.id, id));
}

// ─── Rating helpers ───────────────────────────────────────────────────────────

export async function getRatingsForPerfume(perfumeId: number) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: ratings.id,
      score: ratings.score,
      review: ratings.review,
      createdAt: ratings.createdAt,
      updatedAt: ratings.updatedAt,
      userId: ratings.userId,
      userName: users.name,
    })
    .from(ratings)
    .leftJoin(users, eq(users.id, ratings.userId))
    .where(eq(ratings.perfumeId, perfumeId))
    .orderBy(desc(ratings.updatedAt));

  return rows;
}

export async function getUserRatingForPerfume(userId: number, perfumeId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(ratings)
    .where(and(eq(ratings.userId, userId), eq(ratings.perfumeId, perfumeId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertRating(data: { userId: number; perfumeId: number; score: number; review?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserRatingForPerfume(data.userId, data.perfumeId);

  if (existing) {
    await db
      .update(ratings)
      .set({ score: data.score, review: data.review ?? null, updatedAt: new Date() })
      .where(and(eq(ratings.userId, data.userId), eq(ratings.perfumeId, data.perfumeId)));
  } else {
    await db.insert(ratings).values({
      userId: data.userId,
      perfumeId: data.perfumeId,
      score: data.score,
      review: data.review ?? null,
    });
  }
}


// ─── User Profile helpers ─────────────────────────────────────────────────────

export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUserProfile(data: InsertUserProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserProfile(data.userId!);
  if (existing) {
    await db.update(userProfiles).set(data).where(eq(userProfiles.userId, data.userId!));
  } else {
    await db.insert(userProfiles).values(data);
  }
}

export async function getUserTopPerfumes(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: userTopPerfumes.id,
      userId: userTopPerfumes.userId,
      perfumeId: userTopPerfumes.perfumeId,
      position: userTopPerfumes.position,
      perfumeName: perfumes.name,
      perfumeBrand: perfumes.brand,
      perfumeImageUrl: perfumes.imageUrl,
    })
    .from(userTopPerfumes)
    .leftJoin(perfumes, eq(perfumes.id, userTopPerfumes.perfumeId))
    .where(eq(userTopPerfumes.userId, userId))
    .orderBy(userTopPerfumes.position);

  return rows;
}

export async function addUserTopPerfume(data: InsertUserTopPerfume) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(userTopPerfumes).values(data);
}

export async function removeUserTopPerfume(userId: number, perfumeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(userTopPerfumes).where(and(eq(userTopPerfumes.userId, userId), eq(userTopPerfumes.perfumeId, perfumeId)));
}

export async function getProfileRatingsForUser(ratedUserId: number) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: profileRatings.id,
      score: profileRatings.score,
      review: profileRatings.review,
      createdAt: profileRatings.createdAt,
      ratingUserId: profileRatings.ratingUserId,
      ratingUserName: users.name,
    })
    .from(profileRatings)
    .leftJoin(users, eq(users.id, profileRatings.ratingUserId))
    .where(eq(profileRatings.ratedUserId, ratedUserId))
    .orderBy(desc(profileRatings.createdAt));

  return rows;
}

export async function getUserProfileRating(ratedUserId: number, ratingUserId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(profileRatings)
    .where(and(eq(profileRatings.ratedUserId, ratedUserId), eq(profileRatings.ratingUserId, ratingUserId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function upsertProfileRating(data: { ratedUserId: number; ratingUserId: number; score: number; review?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserProfileRating(data.ratedUserId, data.ratingUserId);

  if (existing) {
    await db
      .update(profileRatings)
      .set({ score: data.score, review: data.review ?? null, updatedAt: new Date() })
      .where(and(eq(profileRatings.ratedUserId, data.ratedUserId), eq(profileRatings.ratingUserId, data.ratingUserId)));
  } else {
    await db.insert(profileRatings).values({
      ratedUserId: data.ratedUserId,
      ratingUserId: data.ratingUserId,
      score: data.score,
      review: data.review ?? null,
    });
  }
}
