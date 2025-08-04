export default function ProjectHeader({ project, isExpanded, onToggleExpand }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.25rem 2rem",
        cursor: "pointer",
        borderBottom: isExpanded ? "1px solid #e5e7eb" : "none",
        background: isExpanded ? "#f9fafb" : "#fff",
        borderRadius: isExpanded ? "10px 10px 0 0" : "10px",
      }}
      onClick={onToggleExpand}
    >
      <div style={{ fontWeight: 600, fontSize: "1.15rem" }}>
        {project.project_name}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
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
        <span style={{ fontSize: "1.5rem" }}>{isExpanded ? "▲" : "▼"}</span>
      </div>
    </div>
  );
}
