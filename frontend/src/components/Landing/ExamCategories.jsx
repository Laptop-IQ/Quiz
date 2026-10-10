import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { EXAM_CATEGORIES } from "../../config/examCategories";
import Reveal from "./Reveal";

const ExamCategories = () => (
  <section id="exams" className="bg-white py-20 sm:py-24">
    <div className="mx-auto max-w-6xl px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Choose your exam</span>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          One platform for every competitive exam
        </h2>
        <p className="mt-3 text-slate-500">
          Pick the exam you&apos;re preparing for and start with exam-pattern mock tests.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXAM_CATEGORIES.map((c, i) => {
          const Icon = c.Icon;
          return (
            <Reveal key={c.id} delay={(i % 3) * 90}>
              <Link
                to={`/test-series?category=${c.id}`}
                className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-lg transition group-hover:scale-105`}>
                    <Icon size={26} />
                  </div>
                  <ArrowRight size={18} className="mt-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-slate-900">{c.label}</h3>
                <p className="text-xs font-semibold text-slate-400">{c.full}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{c.blurb}</p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {c.exams.slice(0, 4).map((e) => (
                    <span key={e} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                      {e}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default ExamCategories;
