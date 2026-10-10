import { useNavigate } from "react-router-dom";
import { BarChart3, Timer, Layers, Boxes, BookOpenCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const Card = ({ className = "", children }) => (
  <div className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${className}`}>
    {children}
  </div>
);

const Icon = ({ icon: I, tone }) => (
  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg ${tone}`}>
    <I size={22} />
  </div>
);

const bars = [
  { h: "45%", c: "bg-slate-200" },
  { h: "62%", c: "bg-sky-300" },
  { h: "55%", c: "bg-sky-300" },
  { h: "78%", c: "bg-cyan-400" },
  { h: "92%", c: "bg-emerald-400" },
];
const techs = ["SSC", "GATE", "Banking", "Railways", "UPSC", "Defence"];

const WhyUs = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Why Tech Quiz Master?</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to prepare smarter
          </h2>
          <p className="mt-3 text-slate-500">
            Practice with <span className="font-semibold text-slate-700">exam-pattern tests</span> and{" "}
            <span className="font-semibold text-slate-700">instant result analysis</span> to grow faster.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <Card className="h-full">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-sm">
                  <Icon icon={BarChart3} tone="bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30" />
                  <h3 className="mt-5 text-xl font-extrabold text-slate-900">Detailed score analysis</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Marks, accuracy and a subject-wise breakdown after every test, so you know exactly what to revise next.
                  </p>
                </div>
                <div className="flex h-32 items-end gap-2.5 sm:w-52" aria-hidden="true">
                  {bars.map((b, i) => (
                    <div key={i} className={`w-full rounded-t-lg ${b.c} transition-all duration-500 group-hover:opacity-90`} style={{ height: b.h }} />
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card className="h-full">
              <Icon icon={Timer} tone="bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-500/30" />
              <h3 className="mt-5 text-lg font-extrabold text-slate-900">Real exam marking</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Timed tests with the exam's own scheme, including negative marking.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 font-mono text-sm font-bold text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" /> 29:41
                </span>
                <span className="inline-flex items-center rounded-xl bg-amber-50 px-3.5 py-2 font-mono text-sm font-bold text-amber-700">+2 / −0.5</span>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0}>
            <Card className="h-full">
              <Icon icon={Layers} tone="bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30" />
              <h3 className="mt-5 text-lg font-extrabold text-slate-900">Level-wise tests</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Grow step by step with tests for every stage.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[["Basic", "bg-emerald-50 text-emerald-700"], ["Intermediate", "bg-amber-50 text-amber-700"], ["Advanced", "bg-rose-50 text-rose-700"]].map(([l, c]) => (
                  <span key={l} className={`rounded-full px-3 py-1 text-xs font-bold ${c}`}>{l}</span>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <Card className="h-full">
              <Icon icon={Boxes} tone="bg-gradient-to-br from-violet-400 to-purple-600 shadow-purple-500/30" />
              <h3 className="mt-5 text-lg font-extrabold text-slate-900">All major exams</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">All your exam preparation in one place.</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {techs.map((t) => (
                  <span key={t} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{t}</span>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={200}>
            <Card className="h-full">
              <Icon icon={BookOpenCheck} tone="bg-gradient-to-br from-sky-400 to-blue-600 shadow-blue-500/30" />
              <h3 className="mt-5 text-lg font-extrabold text-slate-900">Learn from every answer</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Concept-focused questions with clear explanations on every answer.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={16} /> Detailed solutions included
              </div>
            </Card>
          </Reveal>
        </div>

        <Reveal className="mt-12 text-center">
          <button
            onClick={() => navigate("/test-series")}
            className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Get Started For Free
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default WhyUs;
