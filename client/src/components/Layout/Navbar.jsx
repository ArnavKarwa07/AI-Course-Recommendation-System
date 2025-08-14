import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { getTeamMembersAPI } from "../../api/apis";
import "../../styles/Navbar.css";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import GroupIcon from "@mui/icons-material/Group";

export default function Navbar() {
  const { empId, logout } = useAuth();
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const checkManagerStatus = async () => {
      if (empId) {
        try {
          const response = await getTeamMembersAPI(empId);
          setIsManager(response.data && response.data.length > 0);
        } catch (error) {
          console.error("Error checking manager status:", error);
          setIsManager(false);
        }
      }
    };

    checkManagerStatus();
  }, [empId]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="logo">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <img
            src="/skillsense_ai.png"
            style={{
              height: "40px",
              width: "40px",
              objectFit: "contain",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>SkillSense AI</span>
            <span
              style={{
                color: "grey",
                fontSize: "small",
                fontWeight: "400",
              }}
            >
              Powered by Harbinger Group
            </span>
          </div>
        </div>
      </div>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <NavLink to="/dashboard" className="nav-item">
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
        {isManager && (
          <NavLink to="/your-team" className="nav-item">
            <GroupIcon />
            Your Team
          </NavLink>
        )}
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
