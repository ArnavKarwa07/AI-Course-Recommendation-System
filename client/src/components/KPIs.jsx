export default function KPIs({ kpiData }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Key Performance Indicators</h3>
      {kpiData.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {kpiData.map((kpi, index) => (
            <div
              key={index}
              style={{
                padding: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                backgroundColor: "#f9fafb",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: "500" }}>
                  {kpi.kpi_metric || "KPI Metric"}
                </span>
                <span
                  style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    backgroundColor:
                      kpi.kpi_score >= 4.0
                        ? "#dcfce7"
                        : kpi.kpi_score >= 3.0
                        ? "#fef3c7"
                        : "#fecaca",
                    color:
                      kpi.kpi_score >= 4.0
                        ? "#166534"
                        : kpi.kpi_score >= 3.0
                        ? "#92400e"
                        : "#991b1b",
                  }}
                >
                  {kpi.kpi_score}/5
                </span>
              </div>
              {kpi.review && (
                <p
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.875rem",
                    color: "#4b5563",
                  }}
                >
                  {kpi.review}
                </p>
              )}
              <div
                style={{
                  width: "100%",
                  height: "6px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(kpi.kpi_score / 5) * 100}%`,
                    height: "100%",
                    backgroundColor:
                      kpi.kpi_score >= 4.0
                        ? "#10b981"
                        : kpi.kpi_score >= 3.0
                        ? "#f59e0b"
                        : "#ef4444",
                    borderRadius: "3px",
                    transition: "width 0.5s ease",
                  }}
                ></div>
              </div>
              {kpi.month && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginTop: "0.5rem",
                  }}
                >
                  Month: {formatDate(kpi.month)}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            padding: "2rem",
          }}
        >
          No KPI data available
        </p>
      )}
    </div>
  );
}
