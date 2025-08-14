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
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <p className="empty-state-text">No specific skills required</p>
        </div>
      );
    }

    return (
      <div className="skills-grid">
        {Object.entries(requiredSkills).map(([skill, level]) => (
          <div key={skill} className="skill-item">
            <div className="skill-name">
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
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-text">No team members assigned</p>
        </div>
      );
    }

    return (
      <div className="team-members-grid">
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
            <div key={`member-${memberId}`} className="team-member-card">
              {/* Member Header */}
              <div className="team-member-header">
                <div className="team-member-name">
                  {memberData.name || `Member ${memberId}`}
                </div>

                {memberData.role && (
                  <div className="team-member-role">{memberData.role}</div>
                )}
              </div>

              {/* Current Skills */}
              {Object.keys(currentSkills).length > 0 && (
                <div className="skills-section">
                  <div className="skills-section-title">Current Skills</div>
                  <div className="skills-tags">
                    {Object.entries(currentSkills).map(([skill, level]) => (
                      <span
                        key={`current-${memberId}-${skill}`}
                        className="skill-tag"
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
                  <div className="behavior-traits-section">
                    <div className="behavior-traits-title">Behavior Traits</div>
                    <div className="skills-tags">
                      {analysis.behavior_traits.map((trait, index) => (
                        <span
                          key={`trait-${memberId}-${index}`}
                          className="behavior-trait-tag"
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
      <div className="suggestions-section">
        <h4 className="section-title">💡 Improvement Recommendations</h4>

        <div className="suggestions-grid">
          {/* Immediate Actions */}
          {suggestions.immediate_actions &&
            suggestions.immediate_actions.length > 0 && (
              <div className="suggestion-card immediate">
                <div className="suggestion-title immediate">
                  🚨 Immediate Actions Required
                </div>
                <ul className="immediate-actions-list">
                  {suggestions.immediate_actions.map((action, index) => (
                    <li key={index} className="immediate-action-item">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Team Courses */}
          {suggestions.team_courses &&
            Object.keys(suggestions.team_courses).length > 0 && (
              <div className="suggestion-card courses">
                <div className="suggestion-title courses">
                  Recommended Courses for Team
                </div>
                {Object.entries(suggestions.team_courses).map(
                  ([memberId, courses]) => {
                    const memberName =
                      teamMembersDetails && teamMembersDetails[memberId]
                        ? teamMembersDetails[memberId].name
                        : `${memberId}`;

                    return (
                      <div key={memberId} className="course-assignment">
                        <div className="course-member-name">{memberName}:</div>
                        <div className="course-tags">
                          {courses.map((course, index) => (
                            <span key={index} className="course-tag">
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
              <div className="suggestion-card team-members">
                <div className="suggestion-title team-members">
                  Suggested Additional Team Members
                </div>
                <div className="suggested-members-grid">
                  {suggestions.suggested_team_members.map((member, index) => (
                    <div
                      key={`suggested-${member.emp_id || index}`}
                      className="suggested-member-card"
                    >
                      <div className="suggested-member-name">{member.name}</div>
                      <div className="suggested-member-id">
                        Employee ID: {member.emp_id}
                      </div>
                      {member.reason && (
                        <div className="suggested-member-reason">
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
      <div className="project-readiness-loading">
        <div className="project-readiness-loading-icon">🔄</div>
        <p className="project-readiness-loading-text">
          Analyzing project readiness...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-readiness-error">
        <div className="project-readiness-error-icon">⚠️</div>
        <p className="project-readiness-error-text">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="project-readiness-empty">
        <div className="project-readiness-empty-icon">📋</div>
        <h3 className="project-readiness-empty-title">No Projects Found</h3>
        <p className="project-readiness-empty-text">
          You are not currently managing any projects.
        </p>
      </div>
    );
  }

  return (
    <div className="project-readiness-container">
      {projects.map((project) => (
        <div key={`project-${project.project_id}`} className="project-card">
          {/* Project Header */}
          <div
            className="project-header"
            onClick={() => handleToggleExpand(project.project_id)}
          >
            <div className="project-header-content">
              <div className="project-header-info">
                <h3 className="project-title">{project.project_name}</h3>

                {project.project_details && (
                  <div className="project-details">
                    <div className="project-details-row">
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

                <div className="project-stats">
                  {/* Readiness Score */}
                  <div className="project-stat-item">
                    <div
                      className="readiness-circle"
                      style={{
                        backgroundColor: getReadinessColor(
                          (project.readiness_score || 0) * 100
                        ),
                      }}
                    >
                      {Math.round((project.readiness_score || 0) * 100)}%
                    </div>
                    <div>
                      <div className="stat-value">
                        {getReadinessStatus(
                          (project.readiness_score || 0) * 100
                        )}
                      </div>
                      <div className="stat-label">Project Readiness</div>
                    </div>
                  </div>

                  {/* Team Size */}
                  <div className="project-stat-item">
                    <span className="stat-icon">👥</span>
                    <div>
                      <div className="stat-value">
                        {project.team_members ? project.team_members.length : 0}{" "}
                        Members
                      </div>
                      <div className="stat-label">Team Size</div>
                    </div>
                  </div>

                  {/* Required Skills Count */}
                  <div className="project-stat-item">
                    <span className="stat-icon">🎯</span>
                    <div>
                      <div className="stat-value">
                        {project.required_skills
                          ? Object.keys(project.required_skills).length
                          : 0}{" "}
                        Skills
                      </div>
                      <div className="stat-label">Required</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`expand-toggle ${
                  expandedProject === project.project_id ? "expanded" : ""
                }`}
              >
                ▼
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedProject === project.project_id && (
            <div className="project-expanded-content">
              {/* Readiness Reasoning */}
              {project.readiness_score_reasoning && (
                <div className="section-content">
                  <h4 className="section-title">📊 Readiness Analysis</h4>
                  <div className="readiness-analysis">
                    {project.readiness_score_reasoning}
                  </div>
                </div>
              )}

              {/* Required Skills */}
              <div className="section-content">
                <h4 className="section-title">🎯 Required Skills</h4>
                {renderSkillsGrid(project.required_skills)}
              </div>

              {/* Team Members */}
              <div className="section-content">
                <h4 className="section-title">👥 Team Members</h4>
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
