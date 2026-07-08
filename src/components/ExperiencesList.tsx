import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ExperienceCard } from "./ExperienceCard";

export function ExperiencesList() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const experiences = useQuery(api.experiences.list, { category: selectedCategory });

  const categories = [
    { value: "all", label: "الكل", icon: "🌟" },
    { value: "academic", label: "طالبة", icon: "👩🏻‍💻" },
    { value: "social", label: "طالب", icon: "👨🏻‍💻" },
    { value: "challenges", label: "طالب تأهيلي", icon: "💡👨🏻‍💻" },
    { value: "tips", label: "طالبة تأهيلي", icon: "💡👩🏻‍💻" },
  ];

  if (experiences === undefined) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-b-orange-600" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-xl shadow-orange-100/50 backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-black text-stone-950">التجارب المنشورة</h3>
          <p className="mt-1 text-sm font-medium text-stone-500">اختار التصنيف المناسب وتصفح </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                selectedCategory === category.value
                  ? "bg-stone-950 text-white shadow-lg shadow-stone-300"
                  : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-amber-50"
              }`}
            >
              <span className="ml-1">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {experiences.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-amber-300 bg-white/70 p-12 text-center shadow-xl shadow-orange-100/40">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-3xl">📝</div>
          <h3 className="text-2xl font-black text-stone-950">لا توجد تجارب بعد</h3>
          <p className="mt-2 text-stone-500">كون أول شخص يشارك تجربة هنا.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {experiences.map((experience) => (
            <ExperienceCard key={experience._id} experience={experience} />
          ))}
        </div>
      )}
    </section>
  );
}
