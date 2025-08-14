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
      <div className="team-overview-metrics-grid">
        <div className="card-dashboard team-overview-metric-card kpi">
          <div className="team-overview-metric-icon">KPI</div>
          <div className="team-overview-metric-number">
            {kpiAnalytics.averageScore}
          </div>
          <p className="team-overview-metric-label">
            Team Average Score
          </p>
          <div className="team-overview-metric-detail">
            vs Benchmark: {kpiAnalytics.benchmark}
          </div>
        </div>

        <div className="card-dashboard team-overview-metric-card team">
          <div className="team-overview-metric-icon">Team</div>
          <div className="team-overview-metric-number">
            {teamMembers.length}
          </div>
          <p className="team-overview-metric-label">
            Total Members
          </p>
          <div className="team-overview-metric-detail">
            Active Learners: {learningAnalytics.activelearners}
          </div>
        </div>

        <div className="card-dashboard team-overview-metric-card skills">
          <div className="team-overview-metric-icon">Skills</div>
          <div className="team-overview-metric-number">
            {skillAnalytics.skillDistribution.length}
          </div>  
          <p className="team-overview-metric-label">
            Unique Skills
          </p>
          <div className="team-overview-metric-detail">
            Individual Gaps: {skillAnalytics.individualSkillGaps.length}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="team-overview-insights-grid">
        <div className="card">
          <h3 className="team-overview-insights-title">KPI Summary</h3>
          <div className="team-overview-insights-content">
            <div className="team-overview-insights-row">
              <span>High Performers (4.0+):</span>
              <span className="team-overview-insights-value excellent">
                {performanceDistribution.excellent.length}
              </span>
            </div>
            <div className="team-overview-insights-row">
              <span>Good Performers (3.0-3.9):</span>
              <span className="team-overview-insights-value good">
                {performanceDistribution.good.length}
              </span>
            </div>
            <div className="team-overview-insights-row">
              <span>Need Support (below 3.0):</span>
              <span className="team-overview-insights-value poor">
                {performanceDistribution.needsImprovement.length}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="team-overview-insights-title">
            Learning Engagement
          </h3>
          <div className="team-overview-insights-content">
            <div className="team-overview-insights-row">
              <span>Active Learners:</span>
              <span className="team-overview-insights-value primary">
                {learningAnalytics.activelearners}
              </span>
            </div>
            <div className="team-overview-insights-row">
              <span>Engagement Rate:</span>
              <span className="team-overview-insights-value primary">
                {learningAnalytics.engagementRate}%
              </span>
            </div>
            <div className="team-overview-insights-row">
              <span>Average Score:</span>
              <span className="team-overview-insights-value primary">
                {learningAnalytics.averageScore}/5.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
