import { lazy } from "react";

// Every page is loaded on demand (route-level code splitting) so the first
// paint only downloads what the current URL needs.
const loaders = {
  Login: () => import("../components/Login"),
  Signup: () => import("../components/Signup"),
  VerifyOtp: () => import("../components/VerifyOtp"),
  ForgotPassword: () => import("../components/ForgotPassword"),
  Landing: () => import("../pages/Landing"),
  TestSeries: () => import("../pages/TestSeries"),
  SeriesInstructions: () => import("../pages/SeriesInstructions"),
  SeriesStart: () => import("../pages/SeriesStart"),
  ExamEngine: () => import("../pages/ExamEngine"),
  MyResultPage: () => import("../pages/MyResultPage"),
  ResultAnalysis: () => import("../pages/ResultAnalysis"),
  DashboardLayout: () => import("../components/DashboardShell/DashboardLayout"),
  Dashboard: () => import("../pages/Dashboard"),
  DashboardCharts: () => import("../components/Dashboard/DashboardCharts"),
  DashboardTestSeries: () => import("../pages/DashboardTestSeries"),
  AttemptedTests: () => import("../pages/AttemptedTests"),
  ComingSoon: () => import("../pages/ComingSoon"),
  Profile: () => import("../pages/Profile"),
  ContactUs: () => import("../pages/ContactUs"),
};

export const lazyPage = (name) => lazy(loaders[name]);

export const preloadPage = (name) => {
  try {
    loaders[name]?.().catch(() => {});
  } catch {
    /* preloading is best-effort */
  }
};

const ROUTE_TO_PAGE = {
  "/dashboard": "Dashboard",
  "/dashboard/test-series": "DashboardTestSeries",
  "/dashboard/attempted-tests": "AttemptedTests",
  "/dashboard/coming-soon": "ComingSoon",
  "/profile": "Profile",
  "/contact": "ContactUs",
};

// Called on sidebar hover / focus: the chunk is usually already there when the click lands.
export const preloadRoute = (path) => {
  const name = ROUTE_TO_PAGE[path];
  if (name) preloadPage(name);
};

// Called once the dashboard is idle: warm every dashboard page in the background.
export const preloadDashboardPages = () => {
  Object.values(ROUTE_TO_PAGE).forEach((name) => preloadPage(name));
  preloadPage("DashboardCharts");
};
