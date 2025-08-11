import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getManagerProjectsAPI, getProjectAssessmentAPI } from "../../api/apis";

export default function ProjectReadiness() {
  const { empId } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      if (!empId) return;

      setLoading(true);
      setError(null);

      try {
        // Get list of project IDs managed by this employee
        const projectsResponse = await getManagerProjectsAPI(empId);
        const projectIds = projectsResponse?.data || [];

        if (projectIds.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }

        // Fetch assessment data for each project
        const projectAssessments = await Promise.all(
          projectIds.map(async (projectId) => {
            try {
              const assessmentResponse = await getProjectAssessmentAPI(
                empId,
                projectId
              );
              return assessmentResponse?.data || null;
            } catch (err) {
              console.error(`Failed to assess project ${projectId}:`, err);
              return null;
            }
          })
        );

        // Filter out failed requests
        const validAssessments = projectAssessments.filter(Boolean);
        setProjects(validAssessments);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load project data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, [empId]);

  const getReadinessColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const getReadinessStatus = (score) => {
    if (score >= 80) return "Ready";
    if (score >= 50) return "Partially Ready";
    return "Not Ready";
  };

  const renderSkillsGrid = (requiredSkills) => {
    if (!requiredSkills || Object.keys(requiredSkills).length === 0) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f8fafc",
            borderRadius: "0.5rem",
            border: "2px dashed #cbd5e1",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}></div>
          <p style={{ color: "#64748b", fontStyle: "italic", margin: 0 }}>
            No specific skills required
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {Object.entries(requiredSkills).map(([skill, level]) => (
          <div
            key={skill}
            style={{
              padding: "1rem",
              backgroundColor: "#f1f5f9",
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                fontWeight: "600",
                fontSize: "0.95rem",
                color: "#1e293b",
              }}
            >
              {skill} : {level}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTeamMembers = (teamMembersDetails) => {
    if (!teamMembersDetails || Object.keys(teamMembersDetails).length === 0) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f8fafc",
            borderRadius: "0.5rem",
            border: "2px dashed #cbd5e1",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</div>
          <p style={{ color: "#64748b", fontStyle: "italic", margin: 0 }}>
            No team members assigned
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "1rem",
        }}
      >
        {Object.entries(teamMembersDetails).map(([memberId, memberData]) => {
          let currentSkills = {};
          let analysis = {};

          try {
            currentSkills = JSON.parse(memberData.current_skills || "{}");
            analysis = JSON.parse(memberData.analysis || "{}");
          } catch (e) {
            console.error("Error parsing member data:", e);
          }

          return (
            <div
              key={`member-${memberId}`}
              style={{
                padding: "1.25rem",
                backgroundColor: "#ffffff",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Member Header */}
              <div
                style={{
                  marginBottom: "1rem",
                  borderBottom: "1px solid #f1f5f9",
                  paddingBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    color: "#1e293b",
                    marginBottom: "0.25rem",
                  }}
                >
                  {memberData.name || `Member ${memberId}`}
                </div>

                {memberData.role && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "500",
                      backgroundColor: "#f1f5f9",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      display: "inline-block",
                    }}
                  >
                    {memberData.role}
                  </div>
                )}
              </div>

              {/* Current Skills */}
              {Object.keys(currentSkills).length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      color: "#475569",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    Current Skills
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.375rem",
                    }}
                  >
                    {Object.entries(currentSkills).map(([skill, level]) => (
                      <span
                        key={`current-${memberId}-${skill}`}
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          borderRadius: "0.375rem",
                          fontSize: "0.7rem",
                          fontWeight: "500",
                          border: "1px solid #bfdbfe",
                        }}
                      >
                        {skill} ({level})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Behavior Traits */}
              {analysis.behavior_traits &&
                analysis.behavior_traits.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                        color: "#7c3aed",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      Behavior Traits
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.375rem",
                      }}
                    >
                      {analysis.behavior_traits.map((trait, index) => (
                        <span
                          key={`trait-${memberId}-${index}`}
                          style={{
                            padding: "0.25rem 0.5rem",
                            backgroundColor: "#f3e8ff",
                            color: "#7c3aed",
                            borderRadius: "0.375rem",
                            fontSize: "0.7rem",
                            fontWeight: "500",
                            border: "1px solid #e9d5ff",
                          }}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSuggestions = (suggestions, teamMembersDetails) => {
    if (!suggestions || Object.keys(suggestions).length === 0) {
      return null;
    }

    return (
      <div style={{ marginTop: "1.5rem" }}>
        <h4
          style={{
            margin: "0 0 1rem 0",
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          💡 Improvement Recommendations
        </h4>

        <div style={{ display: "grid", gap: "1rem" }}>
          {/* Immediate Actions */}
          {suggestions.immediate_actions &&
            suggestions.immediate_actions.length > 0 && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  padding: "1.25rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #fecaca",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    marginBottom: "0.75rem",
                    color: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  🚨 Immediate Actions Required
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.25rem",
                    listStyle: "none",
                  }}
                >
                  {suggestions.immediate_actions.map((action, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: "0.85rem",
                        color: "#7f1d1d",
                        marginBottom: "0.5rem",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "-1rem",
                          color: "#dc2626",
                        }}
                      >
                        •
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Team Courses */}
          {suggestions.team_courses &&
            Object.keys(suggestions.team_courses).length > 0 && (
              <div
                style={{
                  backgroundColor: "#fffbeb",
                  padding: "1.25rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #fed7aa",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    marginBottom: "0.75rem",
                    color: "#d97706",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  Recommended Courses for Team
                </div>
                {Object.entries(suggestions.team_courses).map(
                  ([memberId, courses]) => {
                    const memberName =
                      teamMembersDetails && teamMembersDetails[memberId]
                        ? teamMembersDetails[memberId].name
                        : `${memberId}`;

                    return (
                      <div key={memberId} style={{ marginBottom: "1rem" }}>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: "#92400e",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {memberName}:
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          {courses.map((course, index) => (
                            <span
                              key={index}
                              style={{
                                padding: "0.375rem 0.75rem",
                                backgroundColor: "#fef3c7",
                                color: "#92400e",
                                borderRadius: "0.5rem",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                border: "1px solid #fcd34d",
                              }}
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

          {/* Suggested Team Members */}
          {suggestions.suggested_team_members &&
            Array.isArray(suggestions.suggested_team_members) &&
            suggestions.suggested_team_members.length > 0 && (
              <div
                style={{
                  backgroundColor: "#f0fdf4",
                  padding: "1.25rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #bbf7d0",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    marginBottom: "0.75rem",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  Suggested Additional Team Members
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  {suggestions.suggested_team_members.map((member, index) => (
                    <div
                      key={`suggested-${member.emp_id || index}`}
                      style={{
                        padding: "1rem",
                        backgroundColor: "#ffffff",
                        borderRadius: "0.5rem",
                        border: "1px solid #d1fae5",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          color: "#1e293b",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {member.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#059669",
                          marginBottom: "0.5rem",
                          fontWeight: "500",
                        }}
                      >
                        Employee ID: {member.emp_id}
                      </div>
                      {member.reason && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#374151",
                            lineHeight: "1.4",
                            backgroundColor: "#f9fafb",
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            border: "1px solid #f3f4f6",
                          }}
                        >
                          <strong>Reason:</strong> {member.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  };

  const handleToggleExpand = (projectId) => {
    setExpandedProject((prev) => (prev === projectId ? null : projectId));
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔄</div>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          Analyzing project readiness...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          backgroundColor: "#fef2f2",
          borderRadius: "0.75rem",
          border: "1px solid #fecaca",
        }}
      >
        <div
          style={{ fontSize: "3rem", marginBottom: "1rem", color: "#dc2626" }}
        >
          ⚠️
        </div>
        <p style={{ color: "#dc2626", fontSize: "1.1rem", fontWeight: "500" }}>
          {error}
        </p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          backgroundColor: "#f8fafc",
          borderRadius: "0.75rem",
          border: "2px dashed #cbd5e1",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📋</div>
        <h3 style={{ color: "#475569", margin: 0, fontSize: "1.5rem" }}>
          No Projects Found
        </h3>
        <p style={{ color: "#64748b", margin: 0, fontSize: "1rem" }}>
          You are not currently managing any projects.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "1rem",
      }}
    >
      {projects.map((project) => (
        <div
          key={`project-${project.project_id}`}
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {/* Project Header */}
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid #f1f5f9",
              cursor: "pointer",
              backgroundColor: "#f8fafc",
            }}
            onClick={() => handleToggleExpand(project.project_id)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#1e293b",
                    lineHeight: "1.3",
                  }}
                >
                  {project.project_name}
                </h3>

                {project.project_details && (
                  <div
                    style={{
                      color: "#64748b",
                      margin: "0 0 1rem 0",
                      fontSize: "0.9rem",
                      backgroundColor: "#ffffff",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #f1f5f9",
                      width: "fit-content",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "2rem",
                      }}
                    >
                      <span>
                        <strong>Client:</strong>{" "}
                        {project.project_details.client}
                      </span>
                      <span>
                        <strong>Status:</strong>{" "}
                        {project.project_details.status}
                      </span>
                      <span>
                        <strong>Duration:</strong>{" "}
                        {project.project_details.duration} months
                      </span>
                      <span>
                        <strong>Start Date:</strong>{" "}
                        {project.project_details.start_date}
                      </span>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Readiness Score */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "3.5rem",
                        height: "3.5rem",
                        borderRadius: "50%",
                        backgroundColor: getReadinessColor(
                          (project.readiness_score || 0) * 100
                        ),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                      }}
                    >
                      {Math.round((project.readiness_score || 0) * 100)}%
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}
                      >
                        {getReadinessStatus(
                          (project.readiness_score || 0) * 100
                        )}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        Project Readiness
                      </div>
                    </div>
                  </div>

                  {/* Team Size */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>👥</span>
                    <div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}
                      >
                        {project.team_members ? project.team_members.length : 0}{" "}
                        Members
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        Team Size
                      </div>
                    </div>
                  </div>

                  {/* Required Skills Count */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>🎯</span>
                    <div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#1e293b",
                        }}
                      >
                        {project.required_skills
                          ? Object.keys(project.required_skills).length
                          : 0}{" "}
                        Skills
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        Required
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#ffffff",
                  transition: "transform 0.2s ease",
                  transform:
                    expandedProject === project.project_id
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                ▼
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedProject === project.project_id && (
            <div style={{ padding: "1.5rem", backgroundColor: "#f8fafc" }}>
              {/* Readiness Reasoning */}
              {project.readiness_score_reasoning && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4
                    style={{
                      margin: "0 0 0.75rem 0",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    📊 Readiness Analysis
                  </h4>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.9rem",
                      color: "#374151",
                      lineHeight: "1.6",
                    }}
                  >
                    {project.readiness_score_reasoning}
                  </div>
                </div>
              )}

              {/* Required Skills */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4
                  style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  🎯 Required Skills
                </h4>
                {renderSkillsGrid(project.required_skills)}
              </div>

              {/* Team Members */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h4
                  style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  👥 Team Members
                </h4>
                {renderTeamMembers(project.team_members_details)}
              </div>

              {/* Suggestions */}
              {renderSuggestions(
                project.suggestions,
                project.team_members_details
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
