import { useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "Is Tech Quiz Master really free?",
    a: "Yes. You get unlimited access to level-wise mock tests at no cost.",
  },
  {
    q: "Which exams can I prepare for?",
    a: "SSC, GATE, Banking, Railways, UPSC, Defence, Teaching and State PSC exams, plus tech skills like HTML, CSS, JavaScript and React. Each exam has its own test series in the Test Series section.",
  },
  {
    q: "Is there negative marking?",
    a: "Tests follow the marking scheme of the exam they are modelled on, including negative marking where it applies. The scheme is shown on the instructions screen before you start and is reflected in your marks.",
  },
  {
    q: "How do the timed tests work?",
    a: "Every test runs against a countdown, just like a real assessment. You can mark questions for review and pause the test if you need a break.",
  },
  {
    q: "What do I get after finishing a test?",
    a: "An instant breakdown: your marks, accuracy, time taken and the subjects that need more work, along with detailed solutions.",
  },
  {
    q: "Can I retake a test?",
    a: "Absolutely. Retake any test as often as you like and compare your attempts from your dashboard.",
  },
  {
    q: "Do I need an account?",
    a: "You can browse the test series without one. Create a free account to save your results and track your progress over time.",
  },
];

const Faq = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">FAQ</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Questions? We've got answers
          </h2>
        </Reveal>

        <Reveal className="mt-10 space-y-3" delay={100}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                  isOpen ? "border-emerald-200 shadow-md" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-500 sm:px-6 sm:py-5"
                  >
                    <span className="text-[15px] font-bold text-slate-900 sm:text-base">{f.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition duration-300 ${
                        isOpen ? "rotate-45 bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Plus size={16} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-500 sm:px-6">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
};

export default Faq;
