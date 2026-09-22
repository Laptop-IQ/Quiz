import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  backgroundDesigns,
  svgPatterns,
  navbarAnimations,
  navbarStyles,
} from "../assets/dummyStyles";
import { Menu, X } from "react-feather"; // Hamburger & close icons

const Navbar = ({ logoSrc, quizType = "default" }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [user, setUser] = useState(null);

  const navRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);

  const design = backgroundDesigns[quizType] || backgroundDesigns.default;
  const pattern = svgPatterns[design.pattern] || svgPatterns.abstract;

  // Fetch user from localStorage on mount
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
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
    navigate("/");
  };

  return (
    <div className={navbarStyles.container}>
      <nav
        ref={navRef}
        className={navbarStyles.nav(design.borderColor, isHovering)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={navbarStyles.patternContainer}>
          <div
            className={navbarStyles.patternLayer}
            style={{
              backgroundImage: pattern,
              ...navbarStyles.backgroundPatternStyle,
            }}
          />
        </div>

        <div className={navbarStyles.innerContainer}>
          <div className={navbarStyles.flexContainer}>
            {/* Logo */}
            <div className={navbarStyles.logoSection}>
              <button
                className={navbarStyles.logoButton}
                onClick={() => goTo("/")}
              >
                <img
                  src={
                    logoSrc ||
                    "https://cdn-icons-png.flaticon.com/128/5806/5806364.png"
                  }
                  alt="logo"
                  className={navbarStyles.logoImage}
                />
              </button>
            </div>

            {/* Title */}
            <div className={navbarStyles.titleContainer}>
              <div className={navbarStyles.titleWrapper}>
                <div className={navbarStyles.titleBox}>
                  <h1 className={navbarStyles.titleText(design.textColor)}>
                    <span className={navbarStyles.titleGradient}>
                      Tech Quiz Master
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className={navbarStyles.desktopButtons}>
              {!user && (
                <>
                  <button
                    onClick={() => goTo("/login")}
                    className={navbarStyles.buttonBase(design.accentColor)}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => goTo("/signup")}
                    className={navbarStyles.buttonBase(design.accentColor)}
                  >
                    Sign Up
                  </button>
                </>
              )}

              {user && (
                <>
                  <button
                    onClick={() => goTo("/result")}
                    className={navbarStyles.buttonBase(design.accentColor)}
                  >
                    My Results
                  </button>
                  <button
                    onClick={handleLogout}
                    className={navbarStyles.buttonBase(design.accentColor)}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={menuBtnRef}
              className={`lg:hidden ${navbarStyles.mobileMenuButton(design.accentColor)}`}
              onClick={() => setMenuOpen((s) => !s)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div ref={menuRef} className={navbarStyles.mobileMenuWrapper}>
              {!user && (
                <>
                  <button
                    onClick={() => {
                      goTo("/login");
                      setMenuOpen(false);
                    }}
                    className={navbarStyles.buttonBase(design.accentColor)}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      goTo("/signup");
                      setMenuOpen(false);
                    }}
                    className={navbarStyles.buttonBase(design.accentColor)}
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
                    className={navbarStyles.buttonBase(design.accentColor)}
                  >
                    My Results
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className={navbarStyles.buttonBase(design.accentColor)}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
      <style>{navbarAnimations}</style>
    </div>
  );
};

export default Navbar;
