import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let experiences;
    
    if (args.category && args.category !== "all") {
      experiences = await ctx.db
        .query("experiences")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .collect();
    } else {
      experiences = await ctx.db
        .query("experiences")
        .order("desc")
        .collect();
    }
    
    return experiences.map(exp => ({
      ...exp,
      timeAgo: getTimeAgo(exp._creationTime),
    }));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    university: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول لإضافة تجربة");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    const experienceId = await ctx.db.insert("experiences", {
      title: args.title,
      content: args.content,
      authorName: user.name || user.email || "مجهول",
      authorId: userId,
      university: args.university,
      category: args.category,
      likes: 0,
      likedBy: [],
    });

    return experienceId;
  },
});

export const toggleLike = mutation({
  args: {
    experienceId: v.id("experiences"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول للإعجاب");
    }

    const experience = await ctx.db.get(args.experienceId);
    if (!experience) {
      throw new Error("التجربة غير موجودة");
    }

    const hasLiked = experience.likedBy.includes(userId);
    
    if (hasLiked) {
      // إلغاء الإعجاب
      await ctx.db.patch(args.experienceId, {
        likes: experience.likes - 1,
        likedBy: experience.likedBy.filter(id => id !== userId),
      });
    } else {
      // إضافة إعجاب
      await ctx.db.patch(args.experienceId, {
        likes: experience.likes + 1,
        likedBy: [...experience.likedBy, userId],
      });
    }

    return !hasLiked;
  },
});

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `منذ ${minutes} دقيقة`;
  } else if (hours < 24) {
    return `منذ ${hours} ساعة`;
  } else {
    return `منذ ${days} يوم`;
  }
}
