import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardTopbar from "./DashboardTopbar";
import { prefetchSeries } from "../../services/useAllSeries";
import { prefetchResults } from "../../services/useMyResults";
import { preloadDashboardPages } from "../../routes/pages";

const DESKTOP_BREAKPOINT = 768;
const SIDEBAR_OPEN = 264;
const SIDEBAR_COLLAPSED = 76;
const CONTENT_MAX = 1440;

// Pages with the light "Attempted Tests" canvas: bg must span the whole main area
const LIGHT_ROUTES = ["/dashboard/attempted-tests", "/profile"];

const getViewportWidth = () =>
  typeof document !== "undefined"
    ? document.documentElement.clientWidth || window.innerWidth
    : CONTENT_MAX;

// Shown inside the shell (sidebar + topbar stay visible) while a page chunk loads
const PageFallback = () => (
  <div className="space-y-4" aria-busy="true" aria-label="Loading">
    <div className="h-40 animate-pulse rounded-3xl bg-white/5" />
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5" />
      ))}
    </div>
  </div>
);

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("dash-sidebar-collapsed") === "true",
  );
  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";

  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= DESKTOP_BREAKPOINT,
  );

  // Viewport width WITHOUT scrollbar - used to size content as if sidebar were open
  const [viewportW, setViewportW] = useState(getViewportWidth);

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
      setViewportW(getViewportWidth());
    };
    window.addEventListener("resize", onResize);
    // also reacts to the page scrollbar appearing/disappearing between routes
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    ro?.observe(document.documentElement);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, []);

  // Warm data + page chunks so every dashboard page opens instantly
  useEffect(() => {
    prefetchSeries();
    prefetchResults();
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => preloadDashboardPages());
    return () => cancel(id);
  }, []);

  const toggle = (value) => {
    setCollapsed((previous) => {
      const next = typeof value === "function" ? value(previous) : value;
      localStorage.setItem("dash-sidebar-collapsed", String(next));
      return next;
    });
  };

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_OPEN;

  // Content width is ALWAYS what it would be with the sidebar open, so toggling the
  // sidebar never stretches the layout - the block just stays centered in the main area.
  const contentPad = typeof window !== "undefined" && window.innerWidth >= 1024 ? 56 : 48;
  const contentMaxWidth = isDesktop
    ? Math.min(CONTENT_MAX, Math.max(viewportW - SIDEBAR_OPEN - contentPad, 0))
    : undefined;

  const isLightPage = LIGHT_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <div
      className="dashboard-shell min-h-dvh w-full max-w-full overflow-x-hidden bg-[#070b14] text-slate-100"
      style={{ "--dashboard-sidebar-width": `${isDesktop ? sidebarWidth : 0}px` }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={toggle} />

      <div className="dashboard-main flex min-h-dvh min-w-0 max-w-full flex-col">
        {!isDashboardHome && <DashboardTopbar />}

        <main className={`dashboard-content min-w-0 max-w-full flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7 ${isLightPage ? "bg-[#f7f9fc]" : ""}`}>
          <div
            className="mx-auto w-full min-w-0"
            style={contentMaxWidth !== undefined ? { maxWidth: `${contentMaxWidth}px` } : undefined}
          >
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
