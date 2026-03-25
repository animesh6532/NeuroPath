import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    if (saved) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  /**
   * Toggle dark/light theme
   */
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode ? 'true' : 'false');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  /**
   * Close mobile menu on navigation
   */
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-logo">
          <span className="logo-icon">🧠</span>
          <span className="logo-text">NeuroPath AI</span>
        </Link>

        {/* Menu Toggle Button (Mobile) */}
        <button
          className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Menu */}
        <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/resume"
                  className={`nav-link ${location.pathname === '/resume' ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  📄 Resume
                </Link>
              </li>
              <li>
                <Link
                  to="/interview"
                  className={`nav-link ${location.pathname === '/interview' ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  🎤 Interview
                </Link>
              </li>
              <li>
                <Link
                  to="/roadmap"
                  className={`nav-link ${location.pathname === '/roadmap' ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  🛣️ Roadmap
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  👤 Profile
                </Link>
              </li>
              <li className="navbar-divider"></li>
              <li>
                <button
                  onClick={toggleDarkMode}
                  className="theme-toggle"
                  title="Toggle dark mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/"
                  className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={handleNavClick}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="nav-link signup-btn"
                  onClick={handleNavClick}
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <button
                  onClick={toggleDarkMode}
                  className="theme-toggle"
                  title="Toggle dark mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
