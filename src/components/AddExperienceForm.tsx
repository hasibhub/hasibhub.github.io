import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AddExperienceFormProps {
  onSuccess: () => void;
}

export function AddExperienceForm({ onSuccess }: AddExperienceFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [university, setUniversity] = useState("");
  const [category, setCategory] = useState("academic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createExperience = useMutation(api.experiences.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !university.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);

    try {
      await createExperience({
        title: title.trim(),
        content: content.trim(),
        university: university.trim(),
        category,
      });

      toast.success("تم نشر تجربتك بنجاح 🎉");
      setTitle("");
      setContent("");
      setUniversity("");
      setCategory("academic");
      onSuccess();
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة التجربة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "academic", label: "طالبة", icon: "👩🏻‍💻" },
    { value: "social", label: "طالب", icon: "👨🏻‍💻" },
    { value: "challenges", label: "طالب تأهيلي", icon: "💡👨🏻‍💻" },
    { value: "tips", label: "طالبة تأهيلي", icon: "💡👩🏻‍💻" },
  ];

  return (
    <div className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl shadow-orange-100/70 md:p-8">
      <div className="mb-7 text-center">
        <p className="mb-2 text-sm font-black text-orange-600">مشاركة جديدة</p>
        <h3 className="text-3xl font-black text-stone-950">اكتب تجربتك الجامعية</h3>
        <p className="mt-2 text-sm text-stone-500">خليها واضح، صادق، ومفيدة للطلاب وطالبات الجدد.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-black text-stone-700">عنوان التجربة *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال : اول سنه بالجامعه... "
              className="field"
              maxLength={100}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-stone-700">الجامعة *</label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="مثال: جامعة أم القرى"
              className="field"
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-black text-stone-700">الفئة</label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`rounded-2xl border p-4 text-sm font-black transition ${
                  category === cat.value
                    ? "border-stone-950 bg-stone-950 text-white shadow-lg"
                    : "border-stone-200 bg-stone-50 text-stone-700 hover:border-orange-300 hover:bg-amber-50"
                }`}
              >
                <div className="mb-1 text-2xl">{cat.icon}</div>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-black text-stone-700">تفاصيل التجربة *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="اكتب تجربتك، النصائح، أو أي شيء خلي غيرك يستفيد منه..."
            rows={7}
            className="field resize-none leading-8"
            maxLength={2000}
          />
          <div className="mt-2 text-xs font-bold text-stone-400">{content.length}/2000 حرف</div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-gradient-to-r from-stone-950 to-orange-900 px-6 py-4 text-base font-black text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "جاري النشر..." : "نشر التجربة 🚀"}
        </button>
      </form>
    </div>
  );
}
