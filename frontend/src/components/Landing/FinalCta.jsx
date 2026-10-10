import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const isLoggedIn = () =>
  !!(localStorage.getItem("token") || sessionStorage.getItem("token") || localStorage.getItem("user"));

const FinalCta = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  return (
    <section className="bg-slate-50 px-4 pb-20 sm:px-6 sm:pb-24">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500 via-cyan-600 to-blue-700 px-6 py-14 text-center shadow-[0_30px_80px_-20px_rgba(6,182,212,0.5)] sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />

        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
            Ready to start your exam preparation?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
            Start with a free mock test today and see exactly where you stand.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate(loggedIn ? "/dashboard" : "/signup")}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              {loggedIn ? "Go to Dashboard" : "Create Free Account"}
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/test-series")}
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              Browse Test Series
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default FinalCta;
