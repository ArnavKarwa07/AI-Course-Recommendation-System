import KPIDashboard from "../KPIDashboard";

export default function TeamPerformance({
  enhancedPerformance,
  teamMembersData,
  selectedMember,
  setSelectedMember,
}) {
  return (
    <div>
      {/* Enhanced Performance Distribution */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
          Performance Distribution by Ranges
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {Object.entries(enhancedPerformance.performanceRanges).map(
            ([range, members]) => (
              <div
                key={range}
                style={{
                  padding: "1rem",
                  background:
                    range.includes("4.5") || range.includes("5.0")
                      ? "#dcfce7"
                      : range.includes("4.0")
                      ? "#fef3c7"
                      : range.includes("3.5")
                      ? "#fef9e7"
                      : range.includes("3.0")
                      ? "#fef2e2"
                      : range.includes("2.5")
                      ? "#fecaca"
                      : "#fee2e2",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 1rem 0",
                    color:
                      range.includes("4.5") || range.includes("5.0")
                        ? "#166534"
                        : range.includes("4.0")
                        ? "#92400e"
                        : range.includes("3.5")
                        ? "#a16207"
                        : range.includes("3.0")
                        ? "#c2410c"
                        : range.includes("2.5")
                        ? "#991b1b"
                        : "#7f1d1d",
                  }}
                >
                  📊 {range} ({members.length})
                </h4>
                {members.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    {members.map((member, index) => (
                      <div
                        key={index}
                        style={{
                          fontSize: "0.875rem",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          <strong>{member.name}</strong>
                        </span>
                        <span>{member.avgKPI}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      margin: 0,
                    }}
                  >
                    No members in this range
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Individual Performance with KPI Dashboard */}
      <div className="card">
        <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
          Individual Performance Analysis
        </h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          {enhancedPerformance.memberPerformance.map((member, index) => {
            const memberData = teamMembersData[member.empId];
            const isExpanded = selectedMember === member.empId;

            return (
              <div key={index}>
                {/* Member Performance Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() =>
                    setSelectedMember(isExpanded ? null : member.empId)
                  }
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.25rem",
                        fontSize: "1.1rem",
                      }}
                    >
                      {member.name}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      KPI Metrics: {Object.keys(member.kpiMetrics).length}{" "}
                      evaluated
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.5rem 1rem",
                        background:
                          member.avgKPI >= 4.0
                            ? "#dcfce7"
                            : member.avgKPI >= 3.0
                            ? "#fef3c7"
                            : "#fecaca",
                        color:
                          member.avgKPI >= 4.0
                            ? "#166534"
                            : member.avgKPI >= 3.0
                            ? "#92400e"
                            : "#991b1b",
                        borderRadius: "12px",
                        fontWeight: "600",
                        fontSize: "1.1rem",
                      }}
                    >
                      {member.avgKPI}
                    </div>

                    <div
                      style={{
                        padding: "0.5rem",
                        borderRadius: "50%",
                        background: isExpanded ? "#667eea" : "#e5e7eb",
                        color: isExpanded ? "white" : "#6b7280",
                        fontWeight: "bold",
                      }}
                    >
                      {isExpanded ? "−" : "+"}
                    </div>
                  </div>
                </div>

                {/* Expanded KPI Dashboard */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1.5rem",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    {memberData?.loaded && memberData.kpi?.length > 0 ? (
                      <div>
                        <h4
                          style={{
                            margin: "0 0 1rem 0",
                            color: "#1f2937",
                            fontSize: "1.1rem",
                          }}
                        >
                          📊 Detailed KPI Analysis for {member.name}
                        </h4>
                        <div
                          style={{
                            minHeight: "300px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <KPIDashboard kpiData={memberData.kpi} />
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#6b7280",
                          padding: "2rem",
                          background: "#f9fafb",
                          borderRadius: "8px",
                        }}
                      >
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                          📊
                        </div>
                        <p style={{ margin: 0 }}>
                          No KPI data available for this team member
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
