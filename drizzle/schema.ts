import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  float,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const perfumes = mysqlTable("perfumes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  brand: varchar("brand", { length: 256 }).notNull(),
  description: text("description"),
  notes: text("notes"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Perfume = typeof perfumes.$inferSelect;
export type InsertPerfume = typeof perfumes.$inferInsert;

export const ratings = mysqlTable("ratings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  perfumeId: int("perfumeId").notNull(),
  score: int("score").notNull(), // 1–10
  review: text("review"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = typeof ratings.$inferInsert;

export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  bio: text("bio"),
  profileImageUrl: text("profileImageUrl"),
  profileVideoUrl: text("profileVideoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

export const userTopPerfumes = mysqlTable("userTopPerfumes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  perfumeId: int("perfumeId").notNull(),
  position: int("position").notNull(), // 1-5
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserTopPerfume = typeof userTopPerfumes.$inferSelect;
export type InsertUserTopPerfume = typeof userTopPerfumes.$inferInsert;

export const profileRatings = mysqlTable("profileRatings", {
  id: int("id").autoincrement().primaryKey(),
  ratedUserId: int("ratedUserId").notNull(), // User being rated
  ratingUserId: int("ratingUserId").notNull(), // User giving the rating
  score: int("score").notNull(), // 1-10 rating of their fragrance choices
  review: text("review"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProfileRating = typeof profileRatings.$inferSelect;
export type InsertProfileRating = typeof profileRatings.$inferInsert;
