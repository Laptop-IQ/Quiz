import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TestingIllustration from "../../assets/testing-amico.svg";
import RankIcon from "../../assets/icons/gold-winner-trophy-icon.svg";
import PatternIcon from "../../assets/icons/rules-icon.svg";
import AnalysisIcon from "../../assets/icons/growth-icon.svg";
import LanguageIcon from "../../assets/icons/language-translate-bubbles-icon.svg";
import Reveal from "./Reveal";

const features = [
  { text: "Leaderboard Rank", icon: RankIcon, bg: "bg-yellow-100" },
  { text: "Latest Exam Patterns", icon: PatternIcon, bg: "bg-purple-100" },
  { text: "In-depth Performance Analysis", icon: AnalysisIcon, bg: "bg-orange-100" },
  { text: "Timed Mock Tests", icon: LanguageIcon, bg: "bg-green-100" },
];

const QuizPass = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-slate-950 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.5)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-14">
          <div className="flex justify-center">
            <div className="rounded-3xl bg-white/95 p-6 shadow-2xl">
              <img src={TestingIllustration} alt="Illustration of a student taking an online test" className="w-full max-w-sm" loading="lazy" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-400">Prepare for every exam with</p>
            <div className="mt-2 flex items-center gap-3">
              <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Mock Tests</h2>
              <span className="rounded-md bg-gradient-to-r from-emerald-400 to-cyan-500 px-2.5 py-1 text-xs font-black tracking-wide text-slate-950">FREE</span>
            </div>
            <p className="mt-4 max-w-lg text-slate-300">
              Unlimited access to level-wise, exam-pattern mock tests on a structured online practice platform.
            </p>

            <h3 className="mb-4 mt-8 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">What you get</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.text} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${f.bg}`}>
                    <img src={f.icon} alt="" className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-white">{f.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/test-series")}
              className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              Explore Test Series
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default QuizPass;
