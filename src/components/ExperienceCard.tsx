import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface Experience {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  university: string;
  category: string;
  likes: number;
  likedBy: string[];
  timeAgo: string;
}

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const toggleLike = useMutation(api.experiences.toggleLike);

  const handleLike = async () => {
    if (!loggedInUser) {
      toast.error("يجب تسجيل الدخول للإعجاب");
      return;
    }

    try {
      await toggleLike({ experienceId: experience._id as any });
    } catch (error) {
      toast.error("حدث خطأ أثناء الإعجاب");
    }
  };

  const isLiked = loggedInUser && experience.likedBy.includes(loggedInUser._id);

  const getCategoryInfo = (category: string) => {
    const categories = {
      academic: { label: "طالبة", icon: "👩🏻‍💻", color: "bg-rose-50 text-rose-700 ring-rose-100" },
      social: { label: "طالب", icon: "👨🏻‍💻", color: "bg-blue-50 text-blue-700 ring-blue-100" },
      challenges: { label: "طالب تأهيلي", icon: "💡👨🏻‍💻", color: "bg-amber-50 text-amber-800 ring-amber-100" },
      tips: { label: "طالبة تأهيلي", icon: "👩🏻‍💻", color: "bg-purple-50 text-purple-700 ring-purple-100" },
    };
    return categories[category as keyof typeof categories] || categories.academic;
  };

  const categoryInfo = getCategoryInfo(experience.category);

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-xl shadow-stone-200/50 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-100">
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black ring-1 ${categoryInfo.color}`}>
            <span>{categoryInfo.icon}</span>
            {categoryInfo.label}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500">{experience.timeAgo}</span>
        </div>

        <h3 className="mb-3 text-2xl font-black leading-snug text-stone-950 group-hover:text-orange-700">
          {experience.title}
        </h3>

        <div className="mb-5 flex flex-wrap gap-2 text-xs font-bold text-stone-500">
          <span className="rounded-full bg-stone-50 px-3 py-1.5">👤 {experience.authorName}</span>
          <span className="rounded-full bg-stone-50 px-3 py-1.5">🏛️ {experience.university}</span>
        </div>

        <p className=" whitespace-pre-wrap text-[15px] leading-8 text-stone-700">
          {experience.content}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50/80 px-6 py-4">
        <button
          onClick={handleLike}
          disabled={!loggedInUser}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition ${
            isLiked
              ? "bg-red-50 text-red-600 ring-1 ring-red-100"
              : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-red-50 hover:text-red-600"
          } ${!loggedInUser ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <span className={isLiked ? "animate-pulse" : ""}>{isLiked ? "❤️" : "🤍"}</span>
          <span>{experience.likes}</span>
        </button>

        <span className="text-xs font-bold text-stone-400">
          {experience.likes > 0 ? `${experience.likes} أعجبوا بهذه التجربة` : "كون أول إعجاب"}
        </span>
      </div>
    </article>
  );
}
