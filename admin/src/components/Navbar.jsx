import React, { useEffect, useState } from "react";
import { navbarStyles } from "../assets/dummyStyles";
import { useNavigate } from "react-router-dom";
import { Home, List, Menu, X, User, LogOut } from "lucide-react";

const Navbar = ({
  logoSrc = null,
  siteName = "Tech Quiz Master",
  rightContent = null,
  onNavigate = null,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ✅ Check login via token
 useEffect(() => {
   const token =
     localStorage.getItem("adminToken"); // ✅ add this
   setIsLoggedIn(!!token);
 }, []);

  // Close menu on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close menu on resize
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setMobileOpen(false);
    window.addEventListener("resize", onResize);

    const prevOverflow = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prevOverflow || "";
    };
  }, [mobileOpen]);

  const handleNavigate = (href) => {
    setMobileOpen(false);
    if (onNavigate) return onNavigate(href);

    try {
      navigate(href);
    } catch {
      window.location.href = href;
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // ✅ remove admin token
    setIsLoggedIn(false);
    handleNavigate("/login"); // make sure login path is correct
  };

  return (
    <nav className={navbarStyles.nav}>
      <div className={navbarStyles.container}>
        <div className={navbarStyles.innerContainer}>
          {/* Logo */}
          <div className={navbarStyles.homeButton}>
            <button
              type="button"
              onClick={() => handleNavigate("/dashboard")}
              className={navbarStyles.homeButton}
            >
              <div className={navbarStyles.logoWrapper}>
                <img
                  src={
                    logoSrc ||
                    "https://cdn-icons-png.flaticon.com/128/5806/5806364.png"
                  }
                  alt={`${siteName} logo`}
                  className={navbarStyles.logoImg}
                />
              </div>
              <div className={navbarStyles.siteNameWrapper}>
                <span className={navbarStyles.siteName}>{siteName}</span>
                <span className={navbarStyles.siteSubtitle}>
                  Learning Platform
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Menu */}
          {isLoggedIn && (
            <div className={navbarStyles.desktopCenterContainer}>
              <div className={navbarStyles.desktopCenterInner}>
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className={navbarStyles.dashboardButton}
                >
                  <Home className={navbarStyles.dashboardIcon} />
                  <span className={navbarStyles.dashboardText}>Dashboard</span>
                </button>

                <button
                  onClick={() => handleNavigate("/list")}
                  className={navbarStyles.listButton}
                >
                  <List className={navbarStyles.listIcon} />
                  <span className={navbarStyles.listText}>List Quiz</span>
                </button>
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className={navbarStyles.desktopRightContent}>
              {rightContent ? (
                rightContent
              ) : (
                <div className={navbarStyles.profileGroup}>
                  {!isLoggedIn ? (
                    <button
                      onClick={() => handleNavigate("/login")}
                      className={navbarStyles.profileButton}
                    >
                      <User className={navbarStyles.profileIcon} />
                      <span>Login</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className={navbarStyles.profileButton}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className={navbarStyles.mobileMenuContainer}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileOpen((s) => !s);
                }}
                className={navbarStyles.hamburgerButton}
              >
                {mobileOpen ? (
                  <X className={navbarStyles.xIcon} />
                ) : (
                  <Menu className={navbarStyles.menuIcon} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div id="mobile-menu" className={navbarStyles.mobileOverlay}>
          <div
            onClick={() => setMobileOpen(false)}
            className={navbarStyles.mobileBackdrop}
          >
            <div
              className={navbarStyles.mobilePanel}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className={navbarStyles.mobileNav}>
                {isLoggedIn && (
                  <>
                    <button
                      onClick={() => handleNavigate("/dashboard")}
                      className={navbarStyles.mobileNavButton}
                    >
                      <Home className={navbarStyles.mobileNavIcon} />
                      <div className={navbarStyles.mobileNavItemTitle}>
                        Dashboard
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavigate("/list")}
                      className={navbarStyles.mobileNavButton}
                    >
                      <List className={navbarStyles.mobileNavIcon} />
                      <div className={navbarStyles.mobileNavItemTitle}>
                        List Quiz
                      </div>
                    </button>
                  </>
                )}

                {!isLoggedIn ? (
                  <button
                    onClick={() => handleNavigate("/login")}
                    className={navbarStyles.mobileNavButton}
                  >
                    <User className={navbarStyles.mobileNavIcon} />
                    <div className={navbarStyles.mobileNavItemTitle}>Login</div>
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className={navbarStyles.mobileNavButton}
                  >
                    <LogOut className={navbarStyles.mobileNavIcon} />
                    <div className={navbarStyles.mobileNavItemTitle}>
                      Logout
                    </div>
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
