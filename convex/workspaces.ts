import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const joinCode = "123456";
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw Error("Unauthorization");
    }
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });
    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
  },
});
