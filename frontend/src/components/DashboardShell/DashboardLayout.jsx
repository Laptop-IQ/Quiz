import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardTopbar from "./DashboardTopbar";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("dash-sidebar-collapsed") === "true",
  );
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggle = (fn) => {
    setCollapsed((prev) => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      localStorage.setItem("dash-sidebar-collapsed", next);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar collapsed={collapsed} setCollapsed={toggle} />

      {/* Sidebar pushes content only at the lg breakpoint, where it's
          fixed instead of an overlay. */}
      <div
        className="transition-[margin] duration-300"
        style={{ marginLeft: isDesktop ? (collapsed ? 72 : 256) : 0 }}
      >
        <DashboardTopbar />
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
