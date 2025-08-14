import LearningStats from "../Shared/LearningStats";
import Skills from "../Shared/Skills";
import Projects from "../Shared/Projects";

export default function TeamMembers({
  teamMembers,
  teamMembersData,
  selectedMember,
  setSelectedMember,
}) {
  const getKPIClass = (avgKPI) => {
    if (avgKPI === "N/A") return "na";
    if (avgKPI >= 4) return "excellent";
    if (avgKPI >= 3) return "good";
    return "poor";
  };

  return (
    <div>
      <div className="card">
        <h3 className="team-members-title">Individual Team Member Analysis</h3>

        <div className="team-members-grid">
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
                  className="team-member-header"
                  onClick={() =>
                    setSelectedMember(isExpanded ? null : member.emp_id)
                  }
                >
                  <div className="team-member-header-content">
                    <div className="team-member-info">
                      <div className="team-member-avatar">
                        {member.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </div>
                      <div className="team-member-details">
                        <h4>{member.name}</h4>
                        <p>
                          {member.role} • {member.dept}
                        </p>
                      </div>
                    </div>

                    <div className="team-member-stats">
                      <div className="team-member-kpi">
                        <div
                          className={`team-member-kpi-value ${getKPIClass(
                            avgKPI
                          )}`}
                        >
                          {avgKPI}
                        </div>
                        <p className="team-member-kpi-label">Avg KPI</p>
                      </div>

                      <div
                        className={`team-member-expand-toggle ${
                          isExpanded ? "expanded" : "collapsed"
                        }`}
                      >
                        {isExpanded ? "-" : "+"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="team-member-expanded-content">
                    {memberData?.loaded ? (
                      <div className="team-member-expanded-grid">
                        <div className="team-member-left-column">
                          <LearningStats
                            completedCourses={memberData.courses}
                          />
                          <div className="team-member-skills-section">
                            <Skills skills={memberData.employee.skills} />
                          </div>
                        </div>
                        <div className="team-member-right-column">
                          <Projects projectsData={memberData.projects} />
                        </div>
                      </div>
                    ) : (
                      <div className="team-member-error">
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
