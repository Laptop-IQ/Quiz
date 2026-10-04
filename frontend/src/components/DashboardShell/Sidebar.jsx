import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ChevronLeft } from "lucide-react";
import { MENU } from "./menuConfig";

const linkCls = (isActive, collapsed) =>
  `group relative flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer ${
    isActive
      ? "bg-gray-700 text-white"
      : "text-gray-400 hover:bg-gray-700/60 hover:text-white"
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
        className={linkCls(false, collapsed) + " w-full text-left"}
      >
        <Icon size={18} />
        {!collapsed && <span className="flex-1">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className="text-[10px] px-2 py-0.5 bg-orange-500 rounded-full text-white">
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
      className={({ isActive }) => linkCls(isActive, collapsed)}
    >
      <Icon size={18} />
      {!collapsed && <span className="flex-1">{item.label}</span>}
    </NavLink>
  );
};

const SidebarContent = ({ collapsed, closeMobile }) => (
  <nav className="py-4">
    {MENU.map((group) => (
      <div key={group.section}>
        {!collapsed && (
          <p className="text-xs text-gray-500 uppercase px-4 mt-4 mb-2">
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

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-3 left-4 z-50 bg-[#121212] p-2 rounded cursor-pointer"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="text-white" size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:block fixed h-screen bg-[#121212] text-white z-30 transition-[width] duration-300"
        style={{ width: collapsed ? 72 : 256 }}
      >
        <div className="p-4 font-bold border-b border-gray-800 flex items-center gap-2">
          <span className="text-[#26c6da]">
            <svg width="20" height="24" viewBox="0 0 26 30" fill="none">
              <rect x="1" y="1" width="24" height="28" rx="5" fill="none" stroke="#26c6da" strokeWidth="2" />
              <path d="M8 22V9l5 4 5-4v13l-5-3-5 3z" fill="#26c6da" />
            </svg>
          </span>
          {!collapsed && <span>techquiz</span>}
        </div>

        <div className={`group absolute top-20 z-20 transition-all duration-300 ${collapsed ? "-right-3" : "-right-3"}`}>
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="relative bg-[#1f1f1f] border border-gray-900 rounded-full p-1.5 hover:bg-gray-700 transition cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              size={18}
              className={`text-gray-300 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          <SidebarContent collapsed={collapsed} />
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed z-50 w-64 h-screen bg-[#121212] text-white md:hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <span className="font-bold">techquiz</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="cursor-pointer">
                <X className="text-white" />
              </button>
            </div>
            <SidebarContent collapsed={false} closeMobile={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
