export default function ProjectDetails({ project }) {
  return (
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
              color: project.status === "active" ? "#10b981" : "#92400e",
              fontWeight: 600,
            }}
          >
            {project.status}
          </span>
        </span>
      </div>
    </div>
  );
}
