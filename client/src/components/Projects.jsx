/* eslint-disable no-unused-vars */
export default function Projects({ projectsData }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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
        return "#f0f9ff";
      case "Ongoing":
        return "#fcf4d6ff";
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
        return { backgroundColor: "#ffec9fff", color: "#92400e" };
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
        return techStack; // Return as string if parsing fails
      }
    }
    return techStack;
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Projects</h3>
      {projectsData && projectsData.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {projectsData.map((project, index) => {
            const status = getProjectStatus(project.date, project.duration);
            const techStack = parseTechStack(project.tech_stack);

            return (
              <div
                key={project.project_id || index}
                style={{
                  padding: "1rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  backgroundColor: getBackgroundColor(status),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h4
                    style={{
                      margin: "0",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    {project.project_name || `Project ${index + 1}`}
                  </h4>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      ...getBadgeColor(status),
                    }}
                  >
                    {status}
                  </span>
                </div>

                {project.client && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                      Client: <strong>{project.client}</strong>
                    </span>
                  </div>
                )}

                <div style={{ marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    Role: <strong>{project.project_role}</strong>
                  </span>
                </div>

                {/* Tech Stack - Handle both string and object formats */}
                {techStack && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                      Tech Stack:{" "}
                      {typeof techStack === "object"
                        ? Object.keys(techStack).join(", ")
                        : techStack}
                    </span>
                  </div>
                )}

                {/* Skills Used */}
                {project.skills_used &&
                  Object.keys(project.skills_used).length > 0 && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.25rem",
                        }}
                      >
                        {Object.entries(project.skills_used).map(
                          ([skill, level]) => (
                            <span
                              key={skill}
                              style={{
                                padding: "0.125rem 0.5rem",
                                backgroundColor: "#f3e8ff",
                                color: "#7c3aed",
                                borderRadius: "0.75rem",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                              }}
                            >
                              {skill} (Lvl {level})
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#6b7280",
                  }}
                >
                  <span>Start Date: {formatDate(project.date)}</span>
                  <span>Duration: {project.duration} months</span>
                  {project.status && <span>Status: {project.status}</span>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            padding: "2rem",
          }}
        >
          No projects found
        </p>
      )}
    </div>
  );
}
