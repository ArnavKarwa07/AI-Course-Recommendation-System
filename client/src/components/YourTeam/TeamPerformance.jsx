import KPIDashboard from "../Shared/KPIDashboard";

export default function TeamPerformance({
  enhancedPerformance,
  teamMembersData,
  selectedMember,
  setSelectedMember,
}) {
  const getRangeClass = (range) => {
    if (range.includes("4.5") || range.includes("5.0")) return "excellent";
    if (range.includes("4.0")) return "very-good";
    if (range.includes("3.5")) return "good";
    if (range.includes("3.0")) return "fair";
    if (range.includes("2.5")) return "poor";
    return "very-poor";
  };

  const getKPIClass = (avgKPI) => {
    if (avgKPI >= 4.0) return "excellent";
    if (avgKPI >= 3.0) return "good";
    return "poor";
  };

  return (
    <div>
      {/* Enhanced Performance Distribution */}
      <div className="card team-performance-card">
        <h3 className="team-performance-title">
          Performance Distribution by Ranges
        </h3>
        <div className="team-performance-ranges-grid">
          {Object.entries(enhancedPerformance.performanceRanges).map(
            ([range, members]) => {
              const rangeClass = getRangeClass(range);
              return (
                <div
                  key={range}
                  className={`team-performance-range-card ${rangeClass}`}
                >
                  <h4 className={`team-performance-range-title ${rangeClass}`}>
                    📊 {range} ({members.length})
                  </h4>
                  {members.length > 0 ? (
                    <div className="team-performance-range-members">
                      {members.map((member, index) => (
                        <div
                          key={index}
                          className="team-performance-range-member"
                        >
                          <span>
                            <strong>{member.name}</strong>
                          </span>
                          <span>{member.avgKPI}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="team-performance-range-empty">
                      No members in this range
                    </p>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Individual Performance with KPI Dashboard */}
      <div className="card">
        <h3 className="team-performance-analysis-title">
          Individual Performance Analysis
        </h3>
        <div className="team-performance-analysis-grid">
          {enhancedPerformance.memberPerformance.map((member, index) => {
            const memberData = teamMembersData[member.empId];
            const isExpanded = selectedMember === member.empId;

            return (
              <div key={index}>
                {/* Member Performance Header */}
                <div
                  className="team-performance-member-header"
                  onClick={() =>
                    setSelectedMember(isExpanded ? null : member.empId)
                  }
                >
                  <div className="team-performance-member-info">
                    <div className="team-performance-member-name">
                      {member.name}
                    </div>
                    <div className="team-performance-member-metrics">
                      KPI Metrics: {Object.keys(member.kpiMetrics).length}{" "}
                      evaluated
                    </div>
                  </div>

                  <div className="team-performance-member-stats">
                    <div
                      className={`team-performance-member-kpi ${getKPIClass(
                        member.avgKPI
                      )}`}
                    >
                      {member.avgKPI}
                    </div>

                    <div
                      className={`team-performance-member-toggle ${
                        isExpanded ? "expanded" : "collapsed"
                      }`}
                    >
                      {isExpanded ? "−" : "+"}
                    </div>
                  </div>
                </div>

                {/* Expanded KPI Dashboard */}
                {isExpanded && (
                  <div className="team-performance-member-expanded">
                    {memberData?.loaded && memberData.kpi?.length > 0 ? (
                      <div>
                        <h4 className="team-performance-kpi-title">
                          KPI Analysis for {member.name}
                        </h4>
                        <div className="team-performance-kpi-container">
                          <KPIDashboard kpiData={memberData.kpi} />
                        </div>
                      </div>
                    ) : (
                      <div className="team-performance-no-data">
                        <div className="team-performance-no-data-icon">📊</div>
                        <p className="team-performance-no-data-text">
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
