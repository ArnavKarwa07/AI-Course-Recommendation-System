/* eslint-disable no-unused-vars */
export default function Projects({ projectsData }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProjectStatus = (dateString, projectDuration = 0) => {
    if (!dateString) return "Unknown";

    const projectDate = new Date(dateString);
    const now = new Date();
    const projectEndDate = new Date(projectDate);
    projectEndDate.setMonth(
      projectEndDate.getMonth() +
        (Number.isFinite(projectDuration) ? projectDuration : 0)
    );

    if (now > projectDate && now < projectEndDate) return "Ongoing";
    if (projectDate > now) return "Upcoming";
    return "Completed";
  };

  const getBackgroundColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "#f8fafc";
      case "Ongoing":
        return "#fffbeb";
      case "Completed":
        return "#f0fdf4";
      default:
        return "#f9fafb";
    }
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "Upcoming":
        return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "Ongoing":
        return { backgroundColor: "#fef3c7", color: "#d97706" };
      case "Completed":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  // Parse tech stack if it's a string
  const parseTechStack = (techStack) => {
    if (typeof techStack === "string") {
      try {
        return JSON.parse(techStack);
      } catch (e) {
        return techStack;
      }
    }
    return techStack;
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Projects</h3>
      {projectsData && projectsData.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {projectsData.map((project, index) => {
            const status = getProjectStatus(project.date, project.duration);
            const techStack = parseTechStack(project.tech_stack);

            return (
              <div
                key={project.project_id || index}
                style={{
                  padding: "1.5rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  backgroundColor: getBackgroundColor(status),
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Header Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        margin: "0 0 0.25rem 0",
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {project.project_name || `Project ${index + 1}`}
                    </h4>
                    {project.client && (
                      <p
                        style={{
                          margin: "0",
                          fontSize: "0.875rem",
                          color: "#6b7280",
                        }}
                      >
                        {project.client}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      padding: "0.375rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                      marginLeft: "1rem",
                      ...getBadgeColor(status),
                    }}
                  >
                    {status}
                  </span>
                </div>

                {/* Role Section */}
                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {project.project_role}
                  </span>
                </div>

                {/* Skills Section */}
                {project.skills_used &&
                  Object.keys(project.skills_used).length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <p
                        style={{
                          margin: "0 0 0.5rem 0",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "#6b7280",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Skills Used
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {Object.entries(project.skills_used).map(
                          ([skill, level]) => (
                            <span
                              key={skill}
                              style={{
                                padding: "0.25rem 0.75rem",
                                backgroundColor: "#ede9fe",
                                color: "#7c3aed",
                                borderRadius: "16px",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                                border: "1px solid #e0e7ff",
                              }}
                            >
                              {skill} • L{level}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Tech Stack Section */}
                {techStack && (
                  <div style={{ marginBottom: "1rem" }}>
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Tech Stack
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "0.875rem",
                        color: "#374151",
                        lineHeight: "1.5",
                      }}
                    >
                      {typeof techStack === "object"
                        ? Object.keys(techStack).join(" • ")
                        : techStack}
                    </p>
                  </div>
                )}

                {/* Footer Section */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "1rem",
                    borderTop: "1px solid #e5e7eb",
                    fontSize: "0.8rem",
                    color: "#6b7280",
                  }}
                >
                  <span>{formatDate(project.date)}</span>
                  <span>{project.duration} months</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            color: "#6b7280",
            padding: "3rem 1rem",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            border: "2px dashed #d1d5db",
          }}
        >
          <p style={{ margin: "0", fontSize: "1rem" }}>No projects found</p>
        </div>
      )}
    </div>
  );
}
