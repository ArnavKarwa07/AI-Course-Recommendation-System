/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getManagerProjectsAPI,
  getProjectAssignmentsAPI,
  getProjectSkillRequirementsAPI,
} from "../../api/apis";

export default function ProjectReadiness() {
  const { empId } = useAuth();
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    const fetchProjectsAndAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectsRes = await getManagerProjectsAPI(empId);
        console.log("Manager Projects API response:", projectsRes);
        const projects = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : [];
        const projectsWithDetails = await Promise.all(
          projects.map(async (project) => {
            try {
              const assignmentsRes = await getProjectAssignmentsAPI(
                project.project_id
              );
              console.log(
                `Assignments for project ${project.project_id}:`,
                assignmentsRes
              );
              const assignedMembers = Array.isArray(assignmentsRes.data)
                ? assignmentsRes.data
                : [];
              let requiredSkills = [];
              try {
                const skillsRes = await getProjectSkillRequirementsAPI(
                  project.project_id
                );
                console.log(
                  `Skills for project ${project.project_id}:`,
                  skillsRes
                );
                if (Array.isArray(skillsRes.data)) {
                  requiredSkills = skillsRes.data;
                } else if (
                  skillsRes.data &&
                  typeof skillsRes.data === "object"
                ) {
                  requiredSkills = Object.keys(skillsRes.data);
                } else {
                  requiredSkills = [];
                }
              } catch (err) {
                requiredSkills = [];
                console.warn(
                  "Skill API failed for project",
                  project.project_id,
                  err
                );
              }
              // Defensive mapping for available skills
              const availableSkills = {};
              assignedMembers.forEach((member) => {
                let skillsArr = [];
                if (Array.isArray(member.skills)) {
                  skillsArr = member.skills;
                } else if (typeof member.skills === "string" && member.skills) {
                  skillsArr = member.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                }
                skillsArr.forEach((skill) => {
                  if (typeof skill === "string" && skill.trim() !== "") {
                    availableSkills[skill] = (availableSkills[skill] || 0) + 1;
                  }
                });
              });
              const skillsCovered = requiredSkills.filter(
                (skill) => availableSkills[skill]
              );
              const readiness = requiredSkills.length
                ? Math.round(
                    (skillsCovered.length / requiredSkills.length) * 100
                  )
                : 100;
              return {
                ...project,
                assignedMembers,
                requiredSkills,
                availableSkills,
                skillsCovered: skillsCovered.length,
                readiness,
              };
            } catch (err) {
              // If a single project fails, log and skip it
              console.error(
                "Failed to load details for project",
                project.project_id,
                err
              );
              return null;
            }
          })
        );
        // Filter out any nulls (failed projects)
        setUserProjects(projectsWithDetails.filter(Boolean));
      } catch (err) {
        setError("Failed to load project data");
        console.error("Project readiness fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (empId) fetchProjectsAndAssignments();
  }, [empId]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🔄 Loading...
        </div>
        <p style={{ color: "#6b7280" }}>Analyzing project readiness...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div
          style={{ fontSize: "2rem", marginBottom: "1rem", color: "#ef4444" }}
        >
          ⚠️ Error
        </div>
        <p style={{ color: "#ef4444" }}>{error}</p>
      </div>
    );
  }

  if (userProjects.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
        <h3 style={{ color: "#6b7280", margin: "0 0 1rem 0" }}>
          No Projects Found
        </h3>
        <p style={{ color: "#9ca3af", margin: 0 }}>
          You are not currently managing any projects, or your team members
          haven't been assigned to projects yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {userProjects.map((project) => (
        <div
          key={project.project_id}
          style={{
            width: "100%",
            marginBottom: "1.5rem",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            boxShadow:
              expandedProject === project.project_id
                ? "0 4px 24px rgba(0,0,0,0.10)"
                : "0 1px 4px rgba(0,0,0,0.05)",
            background: "#fff",
            transition: "box-shadow 0.2s",
          }}
        >
          {/* Collapsed Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1.25rem 2rem",
              cursor: "pointer",
              borderBottom:
                expandedProject === project.project_id
                  ? "1px solid #e5e7eb"
                  : "none",
              background:
                expandedProject === project.project_id ? "#f9fafb" : "#fff",
              borderRadius:
                expandedProject === project.project_id
                  ? "10px 10px 0 0"
                  : "10px",
            }}
            onClick={() =>
              setExpandedProject(
                expandedProject === project.project_id
                  ? null
                  : project.project_id
              )
            }
          >
            <div style={{ fontWeight: 600, fontSize: "1.15rem" }}>
              {project.project_name}
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              <span
                style={{
                  fontWeight: 600,
                  color:
                    project.readiness >= 80
                      ? "#10b981"
                      : project.readiness >= 60
                      ? "#f59e0b"
                      : "#ef4444",
                  fontSize: "1.1rem",
                }}
              >
                {project.readiness}%
              </span>
              <span style={{ fontSize: "1.5rem" }}>
                {expandedProject === project.project_id ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedProject === project.project_id && (
            <div style={{ padding: "2rem" }}>
              {/* Project Details */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    fontWeight: 500,
                    color: "#6b7280",
                    marginBottom: "0.5rem",
                  }}
                >
                  {project.project_type || "General Project"}
                </div>
                <div style={{ color: "#374151", marginBottom: "0.5rem" }}>
                  {project.description}
                </div>
                <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                  <span>
                    Start:{" "}
                    {project.start_date
                      ? new Date(project.start_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                  {" | "}
                  <span>
                    Status:{" "}
                    <span
                      style={{
                        color:
                          project.status === "Active" ? "#10b981" : "#92400e",
                        fontWeight: 600,
                      }}
                    >
                      {project.status}
                    </span>
                  </span>
                </div>
              </div>

              {/* Required Skills vs Available Skills */}
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", color: "#374151" }}>
                  Required Skills vs Available Skills
                </h4>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
                >
                  {project.requiredSkills.map((skill) => (
                    <div
                      key={skill}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        background: project.availableSkills[skill]
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: project.availableSkills[skill]
                          ? "#166534"
                          : "#991b1b",
                        border: `1px solid ${
                          project.availableSkills[skill] ? "#bbf7d0" : "#fecaca"
                        }`,
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {skill}
                      {project.availableSkills[skill] ? (
                        <span style={{ fontSize: "0.9rem" }}>
                          ({project.availableSkills[skill]} member
                          {project.availableSkills[skill] > 1 ? "s" : ""})
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.9rem" }}>
                          (Not covered)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Team Members */}
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", color: "#374151" }}>
                  Assigned Team Members
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  {project.assignedMembers.length === 0 && (
                    <span style={{ color: "#ef4444" }}>
                      No team members assigned.
                    </span>
                  )}
                  {project.assignedMembers.map((member) => (
                    <div
                      key={member.emp_id}
                      style={{
                        padding: "0.75rem 1.25rem",
                        background: "#f3f4f6",
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                        minWidth: "180px",
                      }}
                    >
                      <div style={{ fontWeight: 600, color: "#374151" }}>
                        {member.name}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                        {member.role || member.assignment_role}
                      </div>
                      <div
                        style={{
                          color: "#6b7280",
                          fontSize: "0.85rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        Skills:{" "}
                        {(() => {
                          if (Array.isArray(member.skills)) {
                            return member.skills.join(", ") || "N/A";
                          } else if (
                            member.skills &&
                            typeof member.skills === "object"
                          ) {
                            return (
                              Object.keys(member.skills).join(", ") || "N/A"
                            );
                          } else if (typeof member.skills === "string") {
                            return member.skills;
                          }
                          return "N/A";
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
