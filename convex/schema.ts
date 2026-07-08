import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  experiences: defineTable({
    title: v.string(),
    content: v.string(),
    authorName: v.string(),
    authorId: v.id("users"),
    university: v.string(),
    category: v.string(), // "academic", "social", "challenges", "tips"
    likes: v.number(),
    likedBy: v.array(v.id("users")),
  })
    .index("by_author", ["authorId"])
    .index("by_category", ["category"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
