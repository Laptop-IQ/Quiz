import { Link, Navigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { getAdminToken } from "../services/api/api";

const Home = () => {
  // already signed in -> straight to the console
  if (getAdminToken()) return <Navigate to="/dashboard" replace />;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-950 px-6 text-center">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="relative max-w-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 shadow-2xl shadow-emerald-500/20">
          <ShieldCheck size={36} />
        </div>
        <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-5xl">Tech Quiz Master</h1>
        <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">Admin console</p>
        <p className="mt-5 text-slate-400">Manage quizzes, questions and students, and see how your platform is performing.</p>
        <Link to="/login" className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400">
          Sign in to continue <ArrowRight size={18} className="transition group-hover:translate-x-1" />
        </Link>
        <p className="mt-6 text-xs text-slate-500">
          Need access? <Link to="/admin/signup" className="font-bold text-slate-300 underline-offset-2 hover:underline">Create an admin account</Link>
        </p>
      </div>
    </main>
  );
};

export default Home;
