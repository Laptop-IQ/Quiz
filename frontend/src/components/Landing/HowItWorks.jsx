import { ListChecks, Timer, LineChart } from "lucide-react";
import Reveal from "./Reveal";

const steps = [
  {
    icon: ListChecks,
    tone: "from-emerald-400 to-teal-500",
    title: "Pick your exam",
    text: "Choose your exam's test series and start at the level that suits you: Basic, Intermediate or Advanced.",
  },
  {
    icon: Timer,
    tone: "from-sky-400 to-blue-600",
    title: "Take an exam-style test",
    text: "A real countdown with the exam's own marking scheme, including negative marking. Mark questions for review as you go.",
  },
  {
    icon: LineChart,
    tone: "from-violet-400 to-purple-600",
    title: "Review & improve",
    text: "Get your marks, accuracy, time per question and the subjects that need more work, instantly.",
  },
];

const HowItWorks = () => (
  <section className="bg-white py-20 sm:py-24">
    <div className="mx-auto max-w-6xl px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">How it works</span>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          From first question to exam-day confidence in 3 steps
        </h2>
      </Reveal>

      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-slate-200 md:block" />
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 120}>
              <div className="group relative h-full rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl">
                <div className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${s.tone} text-white shadow-lg transition group-hover:scale-105`}>
                  <Icon size={30} />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-xs font-black text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-extrabold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorks;
