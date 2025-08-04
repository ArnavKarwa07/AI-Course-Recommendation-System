export default function SkillCard({ skill }) {
  return (
    <div
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
                {idx < skill.available.members.length - 1 ? ", " : ""}
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
  );
}
