import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ExperiencesList } from "./components/ExperiencesList";
import { AddExperienceForm } from "./components/AddExperienceForm";
import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f4ec] text-stone-900" dir="rtl">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute left-0 top-32 h-96 w-96 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-rose-300/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/60 bg-[#fffaf2]/85 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-xl shadow-lg shadow-orange-200">
              👨🏻‍💻
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-stone-950 md:text-2xl">
              تجارب طلاب كلية الحاسبات
              </h1>
              <p className="text-xs font-medium text-stone-500 md:text-sm">
                مساحة لطيفة لنصائح السنة الأولى
              </p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <Content />
      </main>

      <Toaster position="top-center" richColors />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [showAddForm, setShowAddForm] = useState(false);

  if (loggedInUser === undefined) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-b-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Unauthenticated>
        <section className="grid items-center gap-8 py-8 md:grid-cols-[1.15fr_0.85fr] md:py-16">
          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-7 shadow-2xl shadow-orange-100/70 backdrop-blur md:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              <span className="text-xl">👩🏻‍💻👨🏻‍💻</span>
              <span>رحله تجارب ونصائح </span>
            </div>

            <h2 className="mb-5 text-4xl font-black leading-tight text-stone-950 md:text-6xl">
             وصلت وجهتك يا مستجد ✨
            </h2>

            <p className="mb-8 max-w-2xl text-lg leading-9 text-stone-600">
            تجارب ونصائح من طلاب وطالبات كلية الحاسبات بمختلف التخصصات والفروع
            </p>

            <div className="grid gap-3 text-sm font-semibold text-stone-700 sm:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4" >نصائح 💡 </div>
              <div className="rounded-2xl bg-stone-50 p-4">  👨🏻‍💻👩🏻‍💻 تجارب طلاب وطالبات  </div>
              <div className="rounded-2xl bg-stone-50 p-4"> ❤️إعجاب بالتعليق</div>
            </div>
          </div>

          <SignInForm />
        </section>
      </Unauthenticated>

      <Authenticated>
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-stone-950 via-stone-900 to-orange-950 p-7 text-white shadow-2xl shadow-orange-200/60 md:p-10">
          <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-amber-100 ring-1 ring-white/15">
                أهلًا {loggedInUser?.name || loggedInUser?.email} 👋
              </p>

              <h2 className="text-3xl font-black leading-tight md:text-5xl">
                خلّي تجربتك تفيد غيرك
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-stone-200 md:text-lg">
                اكتب نصيحة، موقف، أو شيء تمنيت أحد قاله لك في بداية الطريق.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="rounded-2xl bg-white px-7 py-4 text-base font-black text-stone-950 shadow-xl transition hover:-translate-y-1 hover:bg-amber-50"
            >
              {showAddForm ? "إغلاق النموذج" : "شارك تجربتك 📝"}
            </button>
          </div>
        </section>

        {showAddForm && (
          <div className="animate-fadeInUp">
            <AddExperienceForm onSuccess={() => setShowAddForm(false)} />
          </div>
        )}

        <ExperiencesList />
      </Authenticated>

    <footer className="mt-12 border-t pt-6 text-center text-sm text-gray-500">
  <p className="font-medium">
    صُنع هذا الموقع ليكون دليلك لبداية جامعية مليئة بالنصائح والتجارب.
  </p>

  <p className="mt-4 text-xs text-gray-400">
    © 2026 HasibHub
  </p>
</footer>
</div>
);
}
