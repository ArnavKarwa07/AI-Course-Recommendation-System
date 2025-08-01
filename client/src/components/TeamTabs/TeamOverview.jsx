export default function TeamOverview({
  teamMembers,
  kpiAnalytics,
  performanceDistribution,
  skillAnalytics,
  learningAnalytics,
}) {
  return (
    <div>
      {/* Key Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="card-dashboard"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>KPI</div>
          <div className="metric-number" style={{ color: "white" }}>
            {kpiAnalytics.averageScore}
          </div>
          <p
            className="metric-label"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            Team Average Score
          </p>
          <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            vs Benchmark: {kpiAnalytics.benchmark}
          </div>
        </div>

        <div
          className="card-dashboard"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Team</div>
          <div className="metric-number" style={{ color: "white" }}>
            {teamMembers.length}
          </div>
          <p
            className="metric-label"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            Total Members
          </p>
          <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Active Learners: {learningAnalytics.activelearners}
          </div>
        </div>

        <div
          className="card-dashboard"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            Skills
          </div>
          <div className="metric-number" style={{ color: "white" }}>
            {skillAnalytics.skillDistribution.length}
          </div>
          <p
            className="metric-label"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            Unique Skills
          </p>
          <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Individual Gaps: {skillAnalytics.individualSkillGaps.length}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <div className="card">
          <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
            Performance Summary
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>High Performers (4.0+):</span>
              <span style={{ fontWeight: "600", color: "#10b981" }}>
                {performanceDistribution.excellent.length}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Good Performers (3.0-3.9):</span>
              <span style={{ fontWeight: "600", color: "#f59e0b" }}>
                {performanceDistribution.good.length}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Need Support (below 3.0):</span>
              <span style={{ fontWeight: "600", color: "#ef4444" }}>
                {performanceDistribution.needsImprovement.length}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
            Learning Engagement
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Active Learners:</span>
              <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                {learningAnalytics.activelearners}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Engagement Rate:</span>
              <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                {learningAnalytics.engagementRate}%
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Average Score:</span>
              <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                {learningAnalytics.averageScore}/5.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
