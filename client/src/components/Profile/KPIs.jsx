export default function KPIs({ kpiData }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getScoreClass = (score) => {
    if (score >= 4.0) return "excellent";
    if (score >= 3.0) return "good";
    return "poor";
  };

  return (
    <div className="card">
      <h3 className="kpis-title">Key Performance Indicators</h3>
      {kpiData.length > 0 ? (
        <div className="kpis-list">
          {kpiData.map((kpi, index) => (
            <div key={index} className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-metric">
                  {kpi.kpi_metric || "KPI Metric"}
                </span>
                <span className={`kpi-score ${getScoreClass(kpi.kpi_score)}`}>
                  {kpi.kpi_score}/5
                </span>
              </div>
              {kpi.review && <p className="kpi-review">{kpi.review}</p>}
              <div className="kpi-progress-bar">
                <div
                  className={`kpi-progress-fill ${getScoreClass(
                    kpi.kpi_score
                  )}`}
                  style={{
                    width: `${(kpi.kpi_score / 5) * 100}%`,
                  }}
                ></div>
              </div>
              {kpi.month && (
                <div className="kpi-date">Month: {formatDate(kpi.month)}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="kpis-empty">No KPI data available</p>
      )}
    </div>
  );
}
