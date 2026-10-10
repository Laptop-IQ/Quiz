import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronLeft } from "lucide-react";
import { MENU } from "./menuConfig";
import { preloadRoute } from "../../routes/pages";

const linkCls = (isActive, collapsed) =>
  `group relative flex min-w-0 items-center gap-3 mx-2 my-1 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-200 ${
    isActive
      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-white ring-1 ring-cyan-400/20"
      : "text-slate-400 hover:bg-white/5 hover:text-white"
  } ${collapsed ? "justify-center" : ""}`;

const Item = ({ item, collapsed, onClick }) => {
  const Icon = item.icon;
  const navigate = useNavigate();

  if (item.soon) {
    return (
      <button
        onClick={() => {
          onClick?.();
          navigate("/dashboard/coming-soon", { state: { label: item.label } });
        }}
        className={linkCls(false, collapsed) + " w-[calc(100%-1rem)] text-left"}
      >
        <Icon size={18} className="shrink-0" />
        {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className="shrink-0 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] text-white">
            {item.badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      onMouseEnter={() => preloadRoute(item.to)}
      onFocus={() => preloadRoute(item.to)}
      onTouchStart={() => preloadRoute(item.to)}
      className={({ isActive }) => linkCls(isActive, collapsed)}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
    </NavLink>
  );
};

const SidebarContent = ({ collapsed, closeMobile }) => (
  <nav className="py-4">
    {MENU.map((group) => (
      <div key={group.section}>
        {!collapsed && (
          <p className="px-4 mb-2 mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {group.section}
          </p>
        )}
        {group.items.map((item) => (
          <Item key={item.label} item={item} collapsed={collapsed} onClick={closeMobile} />
        ))}
      </div>
    ))}
  </nav>
);

const Logo = ({ collapsed }) => (
  <div className={`flex h-16 shrink-0 items-center border-b border-white/10 ${collapsed ? "justify-center px-2" : "gap-2 px-5"}`}>
    <span className="text-cyan-300">
      <svg width="20" height="24" viewBox="0 0 26 30" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="24" height="28" rx="5" fill="none" stroke="#26c6da" strokeWidth="2" />
        <path d="M8 22V9l5 4 5-4v13l-5-3-5 3z" fill="#26c6da" />
      </svg>
    </span>
    {!collapsed && <span className="font-bold tracking-tight text-white">techquiz</span>}
  </div>
);

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="fixed left-4 top-3 z-[60] rounded-xl border border-white/10 bg-[#0b1120] p-2 text-white shadow-lg md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <aside
        className="dashboard-sidebar fixed inset-y-0 left-0 z-40 hidden overflow-hidden border-r border-white/10 bg-[#080d18]/95 text-white shadow-2xl shadow-black/20 backdrop-blur-xl md:block"
        style={{ width: "var(--dashboard-sidebar-width)" }}
      >
        <Logo collapsed={collapsed} />

        <div className="h-[calc(100dvh-4rem)] overflow-x-hidden overflow-y-auto py-1 [scrollbar-width:thin]">
          <SidebarContent collapsed={collapsed} />
        </div>
      </aside>

      <button
        onClick={() => setCollapsed((previous) => !previous)}
        className="dashboard-sidebar-toggle fixed top-[4.8rem] z-[55] hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#151c2b] text-slate-300 shadow-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-[#1d2638] hover:text-white md:flex"
        style={{ left: "calc(var(--dashboard-sidebar-width) - 18px)" }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft size={17} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
      </button>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-[280px] overflow-hidden border-r border-white/10 bg-[#080d18] text-white shadow-2xl md:hidden">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <span className="font-bold tracking-tight">techquiz</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="h-[calc(100dvh-4rem)] overflow-y-auto">
              <SidebarContent collapsed={false} closeMobile={() => setMobileOpen(false)} />
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
