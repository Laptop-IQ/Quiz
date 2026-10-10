import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Sparkles, Timer, TrendingUp, Flame, Trophy, ChevronRight, Cpu,
} from "lucide-react";

const isLoggedIn = () =>
  !!(
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("user")
  );

const steps = ["Learn", "Practice", "Improve", "Succeed"];
const avatars = [
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
];
const topics = [
  { name: "Reasoning", value: 88, bar: "from-emerald-400 to-emerald-500" },
  { name: "Quantitative Aptitude", value: 72, bar: "from-cyan-400 to-sky-500" },
  { name: "English", value: 61, bar: "from-amber-400 to-orange-500" },
  { name: "General Awareness", value: 54, bar: "from-rose-400 to-pink-500" },
];

// Illustrative preview of the result screen (sample data, not a real user)
const ResultPreview = () => (
  <div className="relative mx-auto w-full max-w-[470px]">
    <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-emerald-300/40 blur-3xl" />
    <div className="absolute -right-8 bottom-4 h-56 w-56 rounded-full bg-sky-300/40 blur-3xl" />

    <div className="relative rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <Cpu size={20} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900">SSC CGL · Full Mock</p>
            <p className="text-xs font-medium text-slate-500">Tier-1 pattern · −0.5 negative</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">Completed</span>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-[104px] w-[104px] shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="9" />
            <circle
              cx="50" cy="50" r="42" fill="none" strokeWidth="9" strokeLinecap="round"
              stroke="url(#lpRing)" strokeDasharray="263.9" className="lp-ring"
            />
            <defs>
              <linearGradient id="lpRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900">64%</span>
            <span className="-mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">Score</span>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-2">
          {[
            ["Marks", "128/200"],
            ["Accuracy", "86%"],
            ["Time", "41m"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-2.5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-0.5 text-base font-black text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {topics.map((t) => (
          <div key={t.name}>
            <div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-500">
              <span>{t.name}</span>
              <span className="text-slate-700">{t.value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`lp-bar h-full rounded-full bg-gradient-to-r ${t.bar}`} style={{ "--w": `${t.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="lp-float absolute -right-3 -top-5 flex items-center gap-2 rounded-2xl border border-white/70 bg-white px-3.5 py-2.5 shadow-xl sm:-right-8">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
      </span>
      <Timer size={15} className="text-slate-500" />
      <span className="text-sm font-extrabold tabular-nums text-slate-900">29:41</span>
    </div>

    <div className="lp-float-slow absolute -bottom-5 -left-3 flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white px-3.5 py-2.5 shadow-xl sm:-left-8">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        <TrendingUp size={16} />
      </div>
      <div>
        <p className="text-xs font-extrabold text-slate-900">+12% better</p>
        <p className="text-[10px] font-medium text-slate-500">than last attempt</p>
      </div>
    </div>

    <div className="lp-float-slow absolute -bottom-6 right-2 hidden items-center gap-2 rounded-2xl border border-white/70 bg-white px-3 py-2 shadow-xl sm:flex sm:-right-4" style={{ animationDelay: "-2s" }}>
      <Flame size={16} className="text-orange-500" />
      <Trophy size={15} className="text-amber-500" />
      <span className="text-xs font-extrabold text-slate-900">Leaderboard</span>
    </div>

    <p className="mt-9 pr-3 text-right text-[11px] font-medium text-slate-400 sm:pr-0 sm:text-center">Sample preview</p>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/60 to-cyan-100/70 pb-36 pt-14 sm:pt-20">
      {/* decorative background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="lp-hero-in text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
            <Sparkles size={14} className="text-emerald-500" />
            SSC · GATE · Banking · Railways · UPSC
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl xl:text-[3.25rem]">
            Crack government exams with{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              smart mock tests
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
            Exam-pattern mock tests for SSC, GATE, Banking, Railways and more. Timed with
            negative marking like the real paper, and instant analysis of where you lose marks.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <button
              onClick={() => navigate(loggedIn ? "/dashboard" : "/test-series")}
              className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:w-auto"
            >
              {loggedIn ? "Go to Dashboard" : "Start Practicing Free"}
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate(loggedIn ? "/test-series" : "/signup")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-7 py-3.5 text-base font-bold text-slate-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 sm:w-auto"
            >
              {loggedIn ? "Browse Test Series" : "Create Free Account"}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm font-semibold text-slate-500 lg:justify-start">
            {steps.map((s, i) => (
              <span key={s} className="inline-flex items-center gap-2">
                <span className={i === steps.length - 1 ? "text-emerald-600" : ""}>{s}</span>
                {i < steps.length - 1 && <ChevronRight size={14} className="text-slate-300" />}
              </span>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-center gap-3 lg:justify-start">
            <div className="flex -space-x-2.5">
              {avatars.map((g, i) => (
                <span key={g} className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${g} text-xs font-black text-white`}>
                  {"TQMA"[i]}
                </span>
              ))}
            </div>
            <p className="text-left text-sm leading-tight text-slate-600">
              <span className="font-extrabold text-slate-900">10K+ aspirants</span>
              <br />
              practicing on Tech Quiz Master
            </p>
          </div>
        </div>

        <div className="lp-hero-in" style={{ animationDelay: "120ms" }}>
          <ResultPreview />
        </div>
      </div>
    </section>
  );
};

export default Hero;
