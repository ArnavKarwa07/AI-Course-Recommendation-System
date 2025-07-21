export default function Skills({ employeeData }) {
  const getSkillLevel = (level) => {
    if (level == 5) return "Expert";
    if (level >= 3) return "Advanced";
    if (level >= 2) return "Intermediate";
    return "Beginner";
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Skills Assessment</h3>
      {employeeData?.skills && Object.keys(employeeData.skills).length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {Object.entries(employeeData.skills).map(([skill, level]) => (
            <div key={skill}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: "500" }}>{skill}</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Level {level}
                  </span>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "white",
                      backgroundColor:
                        level >= 4
                          ? "#10b981"
                          : level >= 3
                          ? "#3b82f6"
                          : level >= 2
                          ? "#f59e0b"
                          : "#6b7280",
                    }}
                  >
                    {getSkillLevel(level)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(level / 5) * 100}%`,
                    height: "100%",
                    backgroundColor:
                      level >= 4
                        ? "#10b981"
                        : level >= 3
                        ? "#3b82f6"
                        : level >= 2
                        ? "#f59e0b"
                        : "#6b7280",
                    borderRadius: "4px",
                    transition: "width 0.5s ease",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            padding: "2rem",
          }}
        >
          No skills data available
        </p>
      )}
    </div>
  );
}
