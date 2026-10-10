import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Library, PlusCircle, Users, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import { clearAdminSession, getAdminToken } from "../services/api/api";
import { initials } from "../lib/format";
import { cx } from "./ui";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/quizzes", label: "Quizzes", icon: Library, end: true },
  { to: "/quizzes/new", label: "Add quiz", icon: PlusCircle },
  { to: "/users", label: "Users", icon: Users },
];

const TITLES = [
  ["/quizzes/new", "Add quiz"],
  ["/quizzes/", "Edit quiz"],
  ["/quizzes", "Quizzes"],
  ["/users", "Users"],
  ["/dashboard", "Overview"],
];

const readAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("adminData") || "null") || {};
  } catch {
    return {};
  }
};

const SidebarContent = ({ admin, onNavigate, onLogout }) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center gap-3 px-5 py-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20">
        <ShieldCheck size={20} />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-extrabold text-white">Tech Quiz Master</p>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-400">Admin</p>
      </div>
    </div>

    <nav className="flex-1 space-y-1 px-3" aria-label="Admin navigation">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cx(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400",
              isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white",
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>

    <div className="m-3 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-xs font-black text-emerald-300">
          {initials(admin.name || admin.email)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{admin.name || "Admin"}</p>
          <p className="truncate text-[11px] text-slate-400">{admin.email}</p>
        </div>
      </div>
      <button onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white">
        <LogOut size={14} /> Logout
      </button>
    </div>
  </div>
);

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const admin = readAdmin();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    const title = TITLES.find(([p]) => location.pathname.startsWith(p))?.[1];
    document.title = `${title || "Admin"} | Tech Quiz Master Admin`;
  }, [location.pathname]);

  if (!getAdminToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const logout = () => {
    clearAdminSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-dvh bg-[#f7f9fc]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-slate-950 lg:block">
        <SidebarContent admin={admin} onLogout={logout} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-950 shadow-2xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close menu">
              <X size={18} />
            </button>
            <SidebarContent admin={admin} onNavigate={() => setOpen(false)} onLogout={logout} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-700 hover:bg-slate-100" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <p className="text-sm font-extrabold text-slate-900">Tech Quiz Master <span className="text-emerald-600">Admin</span></p>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
