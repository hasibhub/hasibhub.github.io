import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white/90 p-6 shadow-xl">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-3xl shadow-lg">
          👩🏻‍💻
        </div>
        <h2 className="text-3xl font-black text-stone-950">تسجيل الدخول</h2>
      </div>

      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setSubmitting(true);
          const formData = new FormData(event.currentTarget);
          formData.set("flow", flow);
          await signIn("password", formData);
          setSubmitting(false);
        }}
      >
        <input
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-4 text-right outline-none focus:border-orange-400"
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          required
        />

        <input
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-4 text-right outline-none focus:border-orange-400"
          type="password"
          name="password"
          placeholder="كلمة المرور"
          required
        />

        <button
          className="w-full rounded-2xl bg-stone-950 px-5 py-4 text-lg font-black text-white transition hover:bg-orange-700 disabled:opacity-60"
          type="submit"
          disabled={submitting}
        >
          {flow === "signIn" ? "تسجيل الدخول" : "إنشاء حساب"}
        </button>

        <button
          type="button"
          className="w-full text-sm font-bold text-orange-700"
          onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
        >
          {flow === "signIn" ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب؟ سجل الدخول"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-sm text-stone-400">
        <div className="h-px flex-1 bg-stone-200" />
        أو
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <button
        className="w-full rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 px-5 py-4 text-lg font-black text-white transition hover:from-orange-800 hover:to-stone-950"
        onClick={() => signIn("anonymous")}
      >
        الدخول كزائر
      </button>
    </div>
  );
}