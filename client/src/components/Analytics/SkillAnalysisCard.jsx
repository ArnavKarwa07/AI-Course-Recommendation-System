export default function SkillAnalysisCard({ skillGaps }) {
  return (
    <div
      className="card"
      style={{
        background: "#ffffff",
        color: "#374151",
        border:
          skillGaps.length > 0 ? "1px solid #fbbf24" : "1px solid #10b981",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        minHeight: "200px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-15px",
          right: "-15px",
          width: "60px",
          height: "60px",
          background:
            skillGaps.length > 0
              ? "rgba(251, 191, 36, 0.1)"
              : "rgba(16, 185, 129, 0.1)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1, padding: "1.5rem" }}>
        <h3
          style={{
            margin: 0,
            fontWeight: "600",
            fontSize: "1.1rem",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          Skill Analysis
        </h3>
        {skillGaps.length > 0 ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
                color: "#f59e0b",
              }}
            >
              {skillGaps.length}
            </div>
            <p
              style={{
                margin: "0 0 1rem 0",
                fontSize: "0.9rem",
                color: "#6b7280",
              }}
            >
              Skill gaps detected
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                justifyContent: "center",
              }}
            >
              {skillGaps.map((gap, index) => (
                <span
                  key={index}
                  style={{
                    background: "#fef3c7",
                    color: "#92400e",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "12px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    border: "1px solid #fde68a",
                  }}
                >
                  {gap}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
                color: "#10b981",
              }}
            >
              0
            </div>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
              No skill gaps detected
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginTop: "0.5rem",
              }}
            >
              You're on track
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
