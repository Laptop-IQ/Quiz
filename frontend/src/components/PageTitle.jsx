import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const APP_NAME = "Tech Quiz Master";

// First match wins - keep the more specific paths above the general ones.
const TITLES = [
  ["/dashboard/test-series", "Test Series"],
  ["/dashboard/attempted-tests", "Attempted Tests"],
  ["/dashboard/coming-soon", "Coming Soon"],
  ["/dashboard", "Dashboard"],
  ["/profile", "My Profile"],
  ["/contact", "Contact Us"],
  ["/login", "Login"],
  ["/signup", "Sign Up"],
  ["/verify-otp", "Verify OTP"],
  ["/forgotpassword", "Forgot Password"],
  ["/exam", "Exam"],
  ["/result/analysis", "Result Analysis"],
  ["/result", "My Results"],
  ["/test-series", "Test Series"],
];

const titleFor = (pathname) => {
  const path = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  if (path === "/") return `${APP_NAME} - Mock Tests for SSC, GATE, Banking & More`;
  const hit = TITLES.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`));
  return hit ? `${hit[1]} | ${APP_NAME}` : APP_NAME;
};

// Keeps the browser tab title in sync with the current page.
const PageTitle = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = titleFor(pathname);
  }, [pathname]);
  return null;
};

export default PageTitle;
