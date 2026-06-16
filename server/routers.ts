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
          notes: input.notes ?? null,
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
