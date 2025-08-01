/* eslint-disable react-hooks/exhaustive-deps */
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

  // Helper function to normalize skill names for comparison
  const normalizeSkillName = (skillName) => {
    return skillName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "");
  };

  // Helper function to process member skills - handles JSON object format
  const processMemberSkills = (memberSkills) => {
    const skillsMap = {};

    // Handle different skill data formats
    if (!memberSkills) {
      return skillsMap;
    }

    // If it's already an object (JSON from database)
    if (typeof memberSkills === "object" && !Array.isArray(memberSkills)) {
      Object.entries(memberSkills).forEach(([skillName, proficiency]) => {
        if (skillName && skillName.trim()) {
          const normalized = normalizeSkillName(skillName);
          if (normalized) {
            skillsMap[normalized] = {
              originalName: skillName.trim(),
              proficiency: parseInt(proficiency) || 0,
            };
          }
        }
      });
      return skillsMap;
    }

    // Handle array format
    let skillsArray = [];
    if (Array.isArray(memberSkills)) {
      skillsArray = memberSkills;
    } else if (typeof memberSkills === "string" && memberSkills.trim()) {
      // Handle comma-separated string format like "JavaScript(4), Python(3)"
      skillsArray = memberSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    skillsArray.forEach((skill) => {
      if (typeof skill === "string") {
        // Parse skills like "JavaScript(4)" or "JavaScript 4"
        const match = skill.match(/^(.+?)[\s(]*(\d+)[\s)]*$/);
        if (match) {
          const skillName = match[1].trim();
          const proficiency = parseInt(match[2]) || 0;
          const normalized = normalizeSkillName(skillName);
          if (normalized) {
            skillsMap[normalized] = {
              originalName: skillName,
              proficiency: proficiency,
            };
          }
        } else {
          // No proficiency specified, use default
          const normalized = normalizeSkillName(skill);
          if (normalized) {
            skillsMap[normalized] = {
              originalName: skill.trim(),
              proficiency: 3, // default proficiency
            };
          }
        }
      }
    });

    return skillsMap;
  };

  useEffect(() => {
    const fetchProjectsAndAssignments = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching projects for manager:", empId);
        const projectsRes = await getManagerProjectsAPI(empId);
        console.log("Projects response:", projectsRes);

        const projects = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : [];

        const projectsWithDetails = await Promise.all(
          projects.map(async (project) => {
            try {
              console.log("Processing project:", project.project_name);

              // Get project assignments
              const assignmentsRes = await getProjectAssignmentsAPI(
                project.project_id
              );
              console.log(
                "Assignments response for",
                project.project_name,
                ":",
                assignmentsRes
              );

              const assignedMembers = Array.isArray(assignmentsRes.data)
                ? assignmentsRes.data
                : [];

              // Get required skills
              let requiredSkills = [];
              try {
                const skillsRes = await getProjectSkillRequirementsAPI(
                  project.project_id
                );
                console.log(
                  "Skills response for",
                  project.project_name,
                  ":",
                  skillsRes
                );

                if (Array.isArray(skillsRes.data)) {
                  requiredSkills = skillsRes.data
                    .map((skill) => {
                      if (typeof skill === "object" && skill.skill_name) {
                        return {
                          name: skill.skill_name,
                          required_level:
                            skill.proficiency_level ||
                            skill.required_level ||
                            1,
                        };
                      } else if (typeof skill === "string") {
                        return { name: skill.trim(), required_level: 1 };
                      }
                      return null;
                    })
                    .filter((skill) => skill && skill.name);
                } else if (
                  skillsRes.data &&
                  typeof skillsRes.data === "object"
                ) {
                  // Handle when skills come as an object like {"JavaScript": 4, "Python": 3}
                  requiredSkills = Object.entries(skillsRes.data).map(
                    ([skillName, level]) => ({
                      name: skillName,
                      required_level: parseInt(level) || 1,
                    })
                  );
                }
              } catch (err) {
                console.warn(
                  "Skills API failed for project",
                  project.project_id,
                  err
                );
              }

              console.log(
                "Required skills for",
                project.project_name,
                ":",
                requiredSkills
              );

              // CREATE TOTAL AVAILABLE SKILLS OBJECT FROM ALL TEAM MEMBERS
              const allAvailableSkills = {};

              assignedMembers.forEach((member) => {
                console.log(
                  "Processing member:",
                  member.name,
                  "Skills:",
                  member.skills
                );

                const memberSkills = processMemberSkills(member.skills);
                console.log("Processed member skills:", memberSkills);

                // Add each member's skills to the total available skills
                Object.keys(memberSkills).forEach((normalizedSkill) => {
                  const skillData = memberSkills[normalizedSkill];

                  if (!allAvailableSkills[normalizedSkill]) {
                    allAvailableSkills[normalizedSkill] = {
                      originalName: skillData.originalName,
                      maxProficiency: 0,
                      members: [],
                    };
                  }

                  // Add this member to the skill
                  allAvailableSkills[normalizedSkill].members.push({
                    name: member.name,
                    proficiency: skillData.proficiency,
                  });

                  // Update max proficiency if this member has higher skill level
                  if (
                    skillData.proficiency >
                    allAvailableSkills[normalizedSkill].maxProficiency
                  ) {
                    allAvailableSkills[normalizedSkill].maxProficiency =
                      skillData.proficiency;
                  }
                });
              });

              console.log(
                "All available skills for",
                project.project_name,
                ":",
                allAvailableSkills
              );

              // ANALYZE SKILL COVERAGE WITH PARTIAL COMPLETION
              const skillsAnalysis = requiredSkills.map((reqSkill) => {
                const normalizedReqSkill = normalizeSkillName(reqSkill.name);
                console.log(
                  `\nAnalyzing skill: ${reqSkill.name} (normalized: ${normalizedReqSkill})`
                );
                console.log("Required level:", reqSkill.required_level);

                // Check if this skill is available in the team
                const availableSkill = allAvailableSkills[normalizedReqSkill];

                if (availableSkill) {
                  console.log("Found matching skill:", availableSkill);
                  console.log(
                    "Max available proficiency:",
                    availableSkill.maxProficiency
                  );

                  // Calculate coverage percentage with partial completion
                  const coveragePercentage = Math.min(
                    100,
                    Math.round(
                      (availableSkill.maxProficiency /
                        reqSkill.required_level) *
                        100
                    )
                  );

                  const isCovered =
                    availableSkill.maxProficiency >= reqSkill.required_level;
                  const proficiencyGap = Math.max(
                    0,
                    reqSkill.required_level - availableSkill.maxProficiency
                  );

                  console.log("Coverage percentage:", coveragePercentage);
                  console.log("Is covered:", isCovered);

                  return {
                    name: reqSkill.name,
                    required_level: reqSkill.required_level,
                    available: availableSkill,
                    maxAvailableProficiency: availableSkill.maxProficiency,
                    isCovered,
                    proficiencyGap,
                    coveragePercentage,
                  };
                } else {
                  console.log("No matching skill found in team");

                  // Skill not available at all
                  return {
                    name: reqSkill.name,
                    required_level: reqSkill.required_level,
                    available: null,
                    maxAvailableProficiency: 0,
                    isCovered: false,
                    proficiencyGap: reqSkill.required_level,
                    coveragePercentage: 0,
                  };
                }
              });

              // Calculate overall project readiness
              const overallReadiness =
                requiredSkills.length > 0
                  ? Math.round(
                      skillsAnalysis.reduce(
                        (sum, skill) => sum + skill.coveragePercentage,
                        0
                      ) / skillsAnalysis.length
                    )
                  : 100; // 100% if no skills required

              const skillsCoveredCount = skillsAnalysis.filter(
                (skill) => skill.isCovered
              ).length;

              console.log("Final analysis for", project.project_name, ":", {
                skillsAnalysis,
                overallReadiness,
                skillsCoveredCount,
              });

              return {
                ...project,
                assignedMembers,
                requiredSkills,
                allAvailableSkills,
                skillsAnalysis,
                skillsCovered: skillsCoveredCount,
                readiness: overallReadiness,
              };
            } catch (err) {
              console.error(
                "Failed to load details for project",
                project.project_id,
                err
              );
              return null;
            }
          })
        );

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
          {/* Project Header */}
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
                  Project ID: {project.project_id}
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
                          project.status === "active" ? "#10b981" : "#92400e",
                        fontWeight: 600,
                      }}
                    >
                      {project.status}
                    </span>
                  </span>
                </div>
              </div>
              {/* Skills Analysis */}
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", color: "#374151" }}>
                  Required Skills vs Available Skills{" "}
                </h4>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
                >
                  {project.skillsAnalysis &&
                  project.skillsAnalysis.length > 0 ? (
                    project.skillsAnalysis.map((skill) => (
                      <div
                        key={skill.name}
                        style={{
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          background: skill.isCovered
                            ? "#dcfce7"
                            : skill.coveragePercentage > 0
                            ? "#fef3c7"
                            : "#fee2e2",
                          color: skill.isCovered
                            ? "#166534"
                            : skill.coveragePercentage > 0
                            ? "#92400e"
                            : "#991b1b",
                          border: `1px solid ${
                            skill.isCovered
                              ? "#bbf7d0"
                              : skill.coveragePercentage > 0
                              ? "#fde68a"
                              : "#fecaca"
                          }`,
                          fontWeight: 500,
                          fontSize: "0.9rem",
                          minWidth: "200px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>{skill.name}</span>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color:
                                skill.coveragePercentage >= 100
                                  ? "#059669"
                                  : skill.coveragePercentage >= 50
                                  ? "#d97706"
                                  : "#dc2626",
                            }}
                          >
                            {skill.coveragePercentage}%
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: "0.8rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Required: Level {skill.required_level}
                        </div>

                        {skill.available ? (
                          <div style={{ fontSize: "0.8rem" }}>
                            <div style={{ marginBottom: "0.25rem" }}>
                              Available:-{" "}
                              <span style={{ opacity: 0.8 }}>
                                {skill.available.members.length} member
                                {skill.available.members.length > 1 ? "s" : ""}
                              </span>
                            </div>

                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                fontStyle: "italic",
                              }}
                            >
                              {skill.available.members.map((member, idx) => (
                                <span key={idx}>
                                  {member.name} (L{member.proficiency})
                                  {idx < skill.available.members.length - 1
                                    ? ", "
                                    : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: "0.8rem", color: "#dc2626" }}>
                            Not available - 0% match
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                      No skill requirements defined for this project
                    </div>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", color: "#374151" }}>
                  Assigned Team Members ({project.assignedMembers?.length || 0}{" "}
                  members)
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  {project.assignedMembers &&
                    project.assignedMembers.length === 0 && (
                      <span style={{ color: "#ef4444" }}>
                        No team members assigned.
                      </span>
                    )}
                  {project.assignedMembers &&
                    project.assignedMembers.map((member) => (
                      <div
                        key={member.emp_id || member.id}
                        style={{
                          padding: "0.75rem 1.25rem",
                          background: "#f3f4f6",
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb",
                          minWidth: "180px",
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "#374151" }}>
                          {member.name || "Unknown"}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                          {member.role ||
                            member.assignment_role ||
                            "No role specified"}
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
                            if (!member.skills) return "N/A";

                            // If it's an object, format it properly
                            if (
                              typeof member.skills === "object" &&
                              !Array.isArray(member.skills)
                            ) {
                              return (
                                Object.entries(member.skills)
                                  .map(([skill, level]) => `${skill}(${level})`)
                                  .join(", ") || "N/A"
                              );
                            }

                            // Fallback for other formats
                            const memberSkills = processMemberSkills(
                              member.skills
                            );
                            const skillsDisplay = Object.values(memberSkills)
                              .map(
                                (skill) =>
                                  `${skill.originalName}(${skill.proficiency})`
                              )
                              .join(", ");
                            return skillsDisplay || "N/A";
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
