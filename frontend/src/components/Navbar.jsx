import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { navbarAnimations, navbarStyles } from "../assets/dummyStyles";
import { Menu, X } from "react-feather"; // Hamburger & close icons
import { User, FileText, LogOut, ChevronDown } from "lucide-react";

const Navbar = ({ logoSrc, quizType = "default" }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);

  // Fetch user from localStorage on mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu if clicked outside
  useEffect(() => {
    if (!menuOpen) return;

    const handleDocClick = (e) => {
      if (
        navRef.current?.contains(e.target) ||
        menuBtnRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      )
        return;

      setMenuOpen(false);
    };

    document.addEventListener("click", handleDocClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleDocClick, { capture: true });
  }, [menuOpen]);

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <div className={navbarStyles.container}>
      <nav ref={navRef} className={navbarStyles.nav()}>
        <div className={navbarStyles.innerContainer}>
          <div className={navbarStyles.flexContainer}>
            {/* Logo */}
            <div className={navbarStyles.logoSection}>
              <button
                className={navbarStyles.logoButton}
                onClick={() => goTo("/")}
              >
                {logoSrc ? (
                  <img src={logoSrc} alt="logo" className={navbarStyles.logoImage} />
                ) : (
                  <svg width="30" height="34" viewBox="0 0 26 30" fill="none" aria-label="logo">
                    <rect x="1" y="1" width="24" height="28" rx="5" fill="#fff" stroke="#16A34A" strokeWidth="1.8" />
                    <path d="M8 22V9l5 4 5-4v13l-5-3-5 3z" fill="#15803D" />
                  </svg>
                )}
              </button>
            </div>

            {/* Title */}
            <div className={navbarStyles.titleContainer}>
              <h1 className={navbarStyles.titleText()}>
                <span className="text-[#15803D]">Tech</span> Quiz Master
              </h1>
            </div>

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 ml-6 mr-auto">
              <li>
                <button
                  onClick={() => goTo("/test-series")}
                  className="hover:text-[#16A34A] cursor-pointer"
                >
                  Test Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => goTo("/quiz")}
                  className="hover:text-[#16A34A] cursor-pointer"
                >
                  Practice
                </button>
              </li>
              {user && (
                <li>
                  <button
                    onClick={() => goTo("/dashboard")}
                    className="hover:text-[#16A34A] cursor-pointer"
                  >
                    Dashboard
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => goTo("/ContactUs")}
                  className="hover:text-[#16A34A] cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
            </ul>

            {/* Desktop Auth Area */}
            <div className={navbarStyles.desktopButtons}>
              {!user && (
                <>
                  <button
                    onClick={() => goTo("/login")}
                    className={navbarStyles.buttonBase()}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => goTo("/signup")}
                    className={navbarStyles.logoutButton}
                  >
                    Sign Up
                  </button>
                </>
              )}

              {user && (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((s) => !s)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-9 h-9 rounded-full bg-[#16A34A] text-white font-semibold flex items-center justify-center uppercase">
                      {(user.name || user.email || "U").charAt(0)}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50 py-1">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          goTo("/dashboard");
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" /> Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          goTo("/profile");
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          goTo("/result");
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" /> My Results
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={menuBtnRef}
              className={`md:hidden ${navbarStyles.mobileMenuButton()}`}
              onClick={() => setMenuOpen((s) => !s)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div ref={menuRef} className={navbarStyles.mobileMenuWrapper}>
              <div className={navbarStyles.mobileMenuContent}>
                <button
                  onClick={() => goTo("/test-series")}
                  className={navbarStyles.mobileMenuItem()}
                >
                  Test Series
                </button>
                <button
                  onClick={() => goTo("/ContactUs")}
                  className={navbarStyles.mobileMenuItem()}
                >
                  Contact Us
                </button>
                {user && (
                  <button
                    onClick={() => goTo("/profile")}
                    className={navbarStyles.mobileMenuItem()}
                  >
                    Profile
                  </button>
                )}
              {!user && (
                <>
                  <button
                    onClick={() => {
                      goTo("/login");
                      setMenuOpen(false);
                    }}
                    className={navbarStyles.mobileMenuItem()}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      goTo("/signup");
                      setMenuOpen(false);
                    }}
                    className={navbarStyles.mobileLogoutButton}
                  >
                    Sign Up
                  </button>
                </>
              )}

              {user && (
                <>
                  <button
                    onClick={() => {
                      goTo("/result");
                      setMenuOpen(false);
                    }}
                    className={navbarStyles.mobileMenuItem()}
                  >
                    My Results
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className={navbarStyles.mobileLogoutButton}
                  >
                    Logout
                  </button>
                </>
              )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <style>{navbarAnimations}</style>
    </div>
  );
};

export default Navbar;
