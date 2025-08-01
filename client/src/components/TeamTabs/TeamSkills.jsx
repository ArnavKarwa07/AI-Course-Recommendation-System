export default function TeamSkills({
  skillAnalytics,
  skillsHeatmapData,
  teamMembers,
}) {
  return (
    <div>
      {/* Skills Bubble Chart/Heatmap */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
          Team Skills Heatmap
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "1rem",
            padding: "1rem",
            background: "#f8fafc",
            borderRadius: "8px",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          {skillsHeatmapData.map((skill, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                borderRadius: "50%",
                background: skill.color,
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "600",
                textAlign: "center",
                width: `${Math.max(60, skill.size)}px`,
                height: `${Math.max(60, skill.size)}px`,
                position: "relative",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                margin: "0 auto",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.1)";

                // Create tooltip with member details
                const tooltip = document.createElement("div");
                tooltip.id = "skill-tooltip";
                tooltip.style.cssText = `
                  position: fixed;
                  background: rgba(0,0,0,0.9);
                  color: white;
                  padding: 12px;
                  border-radius: 8px;
                  font-size: 12px;
                  z-index: 1000;
                  max-width: 300px;
                  pointer-events: none;
                `;

                const skillData = skillAnalytics.expertiseMap[skill.skill];
                const membersList = skillData.members
                  .map((m) => `${m.name} (${m.level})`)
                  .join(", ");

                tooltip.innerHTML = `
                  <div><strong>${skill.skill}</strong></div>
                  <div>Coverage: ${skill.coverage}% (${skill.memberCount}/${teamMembers.length})</div>
                  <div>Average Level: ${skill.averageLevel}</div>
                  <div style="margin-top: 8px;"><strong>Team Members:</strong></div>
                  <div>${membersList}</div>
                `;

                document.body.appendChild(tooltip);

                const updateTooltipPosition = (e) => {
                  tooltip.style.left = e.clientX + 10 + "px";
                  tooltip.style.top = e.clientY + 10 + "px";
                };

                e.target.addEventListener("mousemove", updateTooltipPosition);
                updateTooltipPosition(e);
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                const tooltip = document.getElementById("skill-tooltip");
                if (tooltip) {
                  tooltip.remove();
                }
              }}
            >
              <div style={{ fontSize: "0.7rem" }}>{skill.skill}</div>
              <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                {skill.averageLevel}
              </div>
              <div style={{ fontSize: "0.6rem" }}>{skill.coverage}%</div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#10b981",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem" }}>Expert Level (4.0)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#f59e0b",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem" }}>Intermediate (3.0-3.9)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#ef4444",
              }}
            ></div>
            <span style={{ fontSize: "0.875rem" }}>Beginner (Below 3.0)</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
          AI Identified Skill Gaps
        </h3>
        {skillAnalytics.individualSkillGaps.length > 0 ? (
          <div
            style={{
              display: "grid",
              gap: "1rem",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            {skillAnalytics.individualSkillGaps.map((member, index) => (
              <div
                key={index}
                style={{
                  padding: "1.5rem",
                  background: "#fefbf2",
                  border: "1px solid #fed7aa",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "#92400e",
                    marginBottom: "1rem",
                    fontSize: "1.1rem",
                  }}
                >
                  {member.name} ({member.role})
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {member.gaps.map((gap, gapIndex) => (
                    <span
                      key={gapIndex}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#ffffff",
                        border: "1px solid #fed7aa",
                        borderRadius: "20px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#92400e",
                        display: "inline-block",
                      }}
                    >
                      {gap.skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#059669",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#059669" }}>
              No Skill Gaps Identified
            </h4>
            <p style={{ margin: 0, color: "#065f46" }}>
              All team members meet the required skill levels for their roles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
