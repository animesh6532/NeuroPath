import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";
import { ThemeContext } from "../context/ThemeContext";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { clearAllAppData } = useContext(AppContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearAllAppData();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          NeuroPath <span>AI</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/resume" onClick={closeMenu}>
                Resume Analyze
              </NavLink>
              <NavLink to="/interview" onClick={closeMenu}>
                AI Mock Interview
              </NavLink>
              <NavLink to="/placement" onClick={closeMenu}>
                Placement Prediction
              </NavLink>
              <NavLink to="/roadmap" onClick={closeMenu}>
                Learning Roadmap
              </NavLink>
              <NavLink to="/profile" onClick={closeMenu}>
                Profile
              </NavLink>
            </>
          )}
        </nav>

        <div className="navbar-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </button>

          {!isAuthenticated ? (
            <>
              <button
                className="nav-btn secondary"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="nav-btn primary"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </>
          ) : (
            <button className="nav-btn danger" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;