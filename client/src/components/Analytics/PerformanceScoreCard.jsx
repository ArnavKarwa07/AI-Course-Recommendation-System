export default function PerformanceScoreCard({ averageKPI, kpiDataLength }) {
  return (
    <div className="card performance-score-card">
      <div className="performance-score-content">
        <h3 className="performance-score-title">Performance Score</h3>
        <div className="performance-score-display">
          <div className="performance-score-value">{averageKPI}</div>
          <div className="performance-score-details">
            <p className="performance-score-max">out of 5.0</p>
            <p className="performance-score-metrics">
              Based on {kpiDataLength || 0} metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
