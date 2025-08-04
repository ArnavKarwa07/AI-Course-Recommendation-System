import LearningStats from "../Shared/LearningStats";
import Skills from "../Shared/Skills";
import Projects from "../Shared/Projects";

export default function TeamMembers({
  teamMembers,
  teamMembersData,
  selectedMember,
  setSelectedMember,
}) {
  return (
    <div>
      <div className="card">
        <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
          Individual Team Member Analysis
        </h3>

        <div style={{ display: "grid", gap: "1rem" }}>
          {teamMembers.map((member) => {
            const memberData = teamMembersData[member.emp_id];
            const isExpanded = selectedMember === member.emp_id;

            // Calculate member metrics
            const avgKPI =
              memberData?.kpi && memberData.kpi.length > 0
                ? (
                    memberData.kpi.reduce(
                      (sum, kpi) => sum + kpi.kpi_score,
                      0
                    ) / memberData.kpi.length
                  ).toFixed(1)
                : "N/A";

            return (
              <div key={member.emp_id}>
                {/* Member Header */}
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() =>
                    setSelectedMember(isExpanded ? null : member.emp_id)
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #667eea, #764ba2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        {member.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </div>
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontWeight: "600",
                            color: "#1f2937",
                          }}
                        >
                          {member.name}
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.875rem",
                            color: "#6b7280",
                          }}
                        >
                          {member.role} • {member.dept}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color:
                              avgKPI !== "N/A"
                                ? avgKPI >= 4
                                  ? "#10b981"
                                  : avgKPI >= 3
                                  ? "#f59e0b"
                                  : "#ef4444"
                                : "#6b7280",
                          }}
                        >
                          {avgKPI}
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.75rem",
                            color: "#6b7280",
                          }}
                        >
                          Avg KPI
                        </p>
                      </div>

                      <div
                        style={{
                          padding: "0.5rem",
                          borderRadius: "50%",
                          background: isExpanded ? "#667eea" : "#e5e7eb",
                          color: isExpanded ? "white" : "#6b7280",
                        }}
                      >
                        {isExpanded ? "-" : "+"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1.5rem",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                    }}
                  >
                    {memberData?.loaded ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "2rem",
                        }}
                      >
                        <div>
                          <LearningStats
                            completedCourses={memberData.courses}
                          />
                          <div style={{ marginTop: "1rem" }}>
                            <Skills employeeData={memberData.employee} />
                          </div>
                        </div>
                        <div>
                          <Projects projectsData={memberData.projects} />
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#ef4444",
                          padding: "2rem",
                        }}
                      >
                        ⚠️ Error loading member data
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
