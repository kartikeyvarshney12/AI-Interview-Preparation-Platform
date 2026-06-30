import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div
          className="navbar-logo"
          onClick={() => navigate("/dashboard")}
        >
          <div className="logo-icon">
            AI
          </div>

          <div className="logo-text">
            <span className="logo-title">
              Interview Prep
            </span>

            <span className="logo-subtitle">
              Placement Platform
            </span>
          </div>
        </div>

        <div className="nav-links">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>

          <Link className="nav-link" to="/upload-resume">
            Resume
          </Link>

          <Link className="nav-link" to="/history">
            History
          </Link>
        </div>

        <div className="nav-right">
          <div className="user-badge">
            <div className="avatar">
              {firstLetter}
            </div>

            <div className="user-info">
              <span className="user-name">
                {user?.name || "User"}
              </span>

              <span className="user-role">
                Candidate
              </span>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;