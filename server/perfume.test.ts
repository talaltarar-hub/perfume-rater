import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeCtx(overrides?: Partial<TrpcContext>): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
    ...overrides,
  };
}

function makeUserCtx(role: "user" | "admin" = "user"): TrpcContext {
  return makeCtx({
    user: {
      id: 1,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  });
}

describe("ratings.upsert", () => {
  it("throws UNAUTHORIZED when user is not authenticated", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.ratings.upsert({ perfumeId: 1, score: 8 })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("throws NOT_FOUND when perfume does not exist", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.ratings.upsert({ perfumeId: 999999, score: 8 })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});

describe("admin.addPerfume", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.admin.addPerfume({ name: "Test", brand: "Brand" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx("user"));
    await expect(
      caller.admin.addPerfume({ name: "Test", brand: "Brand" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("admin.deletePerfume", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.admin.deletePerfume({ id: 1 })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx("user"));
    await expect(
      caller.admin.deletePerfume({ id: 1 })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("ratings.getMyRating", () => {
  it("throws UNAUTHORIZED when user is not authenticated", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.ratings.getMyRating({ perfumeId: 1 })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

describe("perfumes.list", () => {
  it("accepts sortBy=top without throwing", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.perfumes.list({ sortBy: "top" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts sortBy=newest without throwing", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.perfumes.list({ sortBy: "newest" });
    expect(Array.isArray(result)).toBe(true);
  });
});
