import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  deletePerfumeById,
  getPerfumeWithScore,
  getRatingsForPerfume,
  getUserRatingForPerfume,
  insertPerfume,
  listPerfumesWithScores,
  upsertRating,
  getUserProfile,
  upsertUserProfile,
  getUserTopPerfumes,
  addUserTopPerfume,
  removeUserTopPerfume,
  getProfileRatingsForUser,
  getUserProfileRating,
  upsertProfileRating,
} from "./db";
import { systemRouter } from "./_core/systemRouter";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  perfumes: router({
    list: publicProcedure
      .input(z.object({ sortBy: z.enum(["top", "newest"]).default("newest") }))
      .query(async ({ input }) => {
        return listPerfumesWithScores(input.sortBy);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const perfume = await getPerfumeWithScore(input.id);
        if (!perfume) throw new TRPCError({ code: "NOT_FOUND", message: "Perfume not found" });
        const reviews = await getRatingsForPerfume(input.id);
        return { ...perfume, reviews };
      }),

    submit: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(256),
          brand: z.string().min(1).max(256),
          description: z.string().max(5000).optional(),
          imageUrl: z.string().url().optional().or(z.literal("")),
        })
      )
      .mutation(async ({ input }) => {
        await insertPerfume({
          name: input.name,
          brand: input.brand,
          description: input.description ?? null,
          imageUrl: input.imageUrl || null,
        });
        return { success: true };
      }),
  }),

  ratings: router({
    getMyRating: protectedProcedure
      .input(z.object({ perfumeId: z.number() }))
      .query(async ({ input, ctx }) => {
        return getUserRatingForPerfume(ctx.user.id, input.perfumeId);
      }),

    upsert: protectedProcedure
      .input(
        z.object({
          perfumeId: z.number(),
          score: z.number().int().min(1).max(10),
          review: z.string().max(2000).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Verify perfume exists
        const perfume = await getPerfumeWithScore(input.perfumeId);
        if (!perfume) throw new TRPCError({ code: "NOT_FOUND", message: "Perfume not found" });

        await upsertRating({
          userId: ctx.user.id,
          perfumeId: input.perfumeId,
          score: input.score,
          review: input.review,
        });

        return { success: true };
      }),
  }),

  profiles: router({
    getProfile: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return getUserProfile(input.userId);
      }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          bio: z.string().max(1000).optional(),
          profileImageUrl: z.string().url().optional().or(z.literal("")),
          profileVideoUrl: z.string().url().optional().or(z.literal("")),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await upsertUserProfile({
          userId: ctx.user.id,
          bio: input.bio ?? null,
          profileImageUrl: input.profileImageUrl || null,
          profileVideoUrl: input.profileVideoUrl || null,
        });
        return { success: true };
      }),

    getTopPerfumes: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return getUserTopPerfumes(input.userId);
      }),

    addTopPerfume: protectedProcedure
      .input(
        z.object({
          perfumeId: z.number(),
          position: z.number().int().min(1).max(5),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const existing = await getUserTopPerfumes(ctx.user.id);
        if (existing.length >= 5 && !existing.some(p => p.perfumeId === input.perfumeId)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Maximum 5 top perfumes allowed" });
        }
        await addUserTopPerfume({
          userId: ctx.user.id,
          perfumeId: input.perfumeId,
          position: input.position,
        });
        return { success: true };
      }),

    removeTopPerfume: protectedProcedure
      .input(z.object({ perfumeId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await removeUserTopPerfume(ctx.user.id, input.perfumeId);
        return { success: true };
      }),

    getProfileRatings: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return getProfileRatingsForUser(input.userId);
      }),

    getMyProfileRating: protectedProcedure
      .input(z.object({ ratedUserId: z.number() }))
      .query(async ({ input, ctx }) => {
        return getUserProfileRating(input.ratedUserId, ctx.user.id);
      }),

    upsertProfileRating: protectedProcedure
      .input(
        z.object({
          ratedUserId: z.number(),
          score: z.number().int().min(1).max(10),
          review: z.string().max(2000).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (input.ratedUserId === ctx.user.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot rate your own profile" });
        }
        await upsertProfileRating({
          ratedUserId: input.ratedUserId,
          ratingUserId: ctx.user.id,
          score: input.score,
          review: input.review,
        });
        return { success: true };
      }),
  }),

  admin: router({
    addPerfume: adminProcedure
      .input(
        z.object({
          name: z.string().min(1).max(256),
          brand: z.string().min(1).max(256),
          description: z.string().max(5000).optional(),
          notes: z.string().max(2000).optional(),
          imageUrl: z.string().url().optional().or(z.literal("")),
        })
      )
      .mutation(async ({ input }) => {
        await insertPerfume({
          name: input.name,
          brand: input.brand,
          description: input.description ?? null,
          imageUrl: input.imageUrl || null,
        });
        return { success: true };
      }),

    deletePerfume: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePerfumeById(input.id);
        return { success: true };
      }),

    listPerfumes: adminProcedure.query(async () => {
      return listPerfumesWithScores("newest");
    }),
  }),
});

export type AppRouter = typeof appRouter;
