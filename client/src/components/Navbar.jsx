/* eslint-disable no-unused-vars */
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from '@mui/icons-material/Person';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export default function Navbar() {
  const { empId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="logo">
        <span>SkillSense AI</span>
        <span style={{ color: "grey", fontSize: "small", fontWeight: "400" }}>
          Powered by Harbinger Group
        </span>
      </div>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <NavLink to="/" className="nav-item">
          <HomeIcon />
          Dashboard
        </NavLink>
        <NavLink to="/courses" className="nav-item">
          <LibraryBooksIcon />
          Courses
        </NavLink>
        <NavLink to="/analytics" className="nav-item">
          <AnalyticsIcon />
          Analytics
        </NavLink>
        <NavLink to="/profile" className="nav-item">
          <PersonIcon />
          Profile
        </NavLink>
      </nav>
      <button className="Logout_button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}
