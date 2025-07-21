import { useState } from "react";

const KPIDashboard = ({ kpiData }) => {
  const [activeView, setActiveView] = useState("chart");

  if (!kpiData || !Array.isArray(kpiData) || kpiData.length === 0) {
    return (
      <div className="card">
        <h2
          style={{
            fontWeight: "600",
            color: "#1f2937",
            margin: "0 0 1.5rem 0",
          }}
        >
          📊 KPI Performance Dashboard
        </h2>
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📈</div>
          <p>No KPI data available</p>
        </div>
      </div>
    );
  }

  const maxScore = 5;
  const chartHeight = 300;
  const chartWidth = 800;
  const barWidth = Math.min(60, (chartWidth - 100) / kpiData.length - 10);
  const barSpacing =
    (chartWidth - 100 - barWidth * kpiData.length) / (kpiData.length + 1);

  const getColor = (score) => {
    if (score >= 4.0) return "#10b981";
    if (score >= 3.0) return "#f59e0b";
    return "#ef4444";
  };

  const getPerformanceLevel = (score) => {
    if (score >= 4.0) return "Excellent";
    if (score >= 3.0) return "Good";
    return "Needs Improvement";
  };

  const averageScore = (
    kpiData.reduce((sum, kpi) => sum + kpi.kpi_score, 0) / kpiData.length
  ).toFixed(1);
  const highestScore = Math.max(...kpiData.map((kpi) => kpi.kpi_score));
  const lowestScore = Math.min(...kpiData.map((kpi) => kpi.kpi_score));

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontWeight: "600",
            color: "#1f2937",
            margin: 0,
          }}
        >
          KPI Performance Dashboard
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveView("chart")}
            style={{
              background: activeView === "chart" ? "#3b82f6" : "transparent",
              color: activeView === "chart" ? "white" : "#6b7280",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              transition: "all 0.2s ease",
            }}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveView("table")}
            style={{
              background: activeView === "table" ? "#3b82f6" : "transparent",
              color: activeView === "table" ? "white" : "#6b7280",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              transition: "all 0.2s ease",
            }}
          >
            Table
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            background: "#f8fafc",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: getColor(averageScore),
            }}
          >
            {averageScore}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Average Score
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            background: "#f0fdf4",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#10b981",
            }}
          >
            {highestScore.toFixed(1)}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Highest Score
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            background: "#fef2f2",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#ef4444",
            }}
          >
            {lowestScore.toFixed(1)}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Lowest Score
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            background: "#fafaf9",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#1f2937",
            }}
          >
            {kpiData.length}
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Total KPIs
          </p>
        </div>
      </div>

      {activeView === "chart" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <svg
            width={chartWidth}
            height={chartHeight + 80}
            style={{ overflow: "visible" }}
          >
            {/* Grid lines and labels */}
            {[1, 2, 3, 4, 5].map((line) => (
              <g key={line}>
                <line
                  x1={50}
                  y1={(line * chartHeight) / maxScore}
                  x2={chartWidth - 50}
                  y2={(line * chartHeight) / maxScore}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                <text
                  x={40}
                  y={(line * chartHeight) / maxScore + 5}
                  fill="#6b7280"
                  fontSize="12"
                  textAnchor="end"
                >
                  {line}
                </text>
              </g>
            ))}

            {/* Y-axis */}
            <line
              x1={50}
              y1={0}
              x2={50}
              y2={chartHeight}
              stroke="#e5e7eb"
              strokeWidth="2"
            />

            {/* X-axis */}
            <line
              x1={50}
              y1={chartHeight}
              x2={chartWidth - 50}
              y2={chartHeight}
              stroke="#e5e7eb"
              strokeWidth="2"
            />

            {/* Bars */}
            {kpiData.map((kpi, index) => {
              const barHeight = (kpi.kpi_score / maxScore) * chartHeight;
              const x = 50 + barSpacing + index * (barWidth + barSpacing);
              const y = chartHeight - barHeight;

              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={getColor(kpi.kpi_score)}
                    rx="4"
                    style={{ transition: "all 0.3s ease" }}
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 10}
                    fill="#374151"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {kpi.kpi_score.toFixed(1)}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 20}
                    fill="#6b7280"
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {kpi.kpi_metric}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 40}
                    fill="#9ca3af"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {kpi.month
                      ? new Date(kpi.month).toLocaleDateString()
                      : "N/A"}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                }}
              >
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  KPI Metric
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "center",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Score
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "center",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Performance
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  KPI Review
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "center",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {kpiData.map((kpi, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td
                    style={{
                      padding: "0.75rem",
                      fontWeight: "500",
                      color: "#1f2937",
                    }}
                  >
                    {kpi.kpi_metric}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "12px",
                        fontWeight: "600",
                        color: "white",
                        background: getColor(kpi.kpi_score),
                      }}
                    >
                      {kpi.kpi_score.toFixed(1)}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: getColor(kpi.kpi_score),
                        background: `${getColor(kpi.kpi_score)}20`,
                      }}
                    >
                      {getPerformanceLevel(kpi.kpi_score)}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      color: "#1f2937",
                      maxWidth: "250px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.875rem",
                        lineHeight: "1.4",
                        color: "#374151",
                        wordWrap: "break-word",
                      }}
                    >
                      {kpi.review || "No review available"}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    {kpi.month
                      ? new Date(kpi.month).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          marginTop: "2rem",
          padding: "1rem",
          background: "#f8fafc",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#10b981",
              borderRadius: "3px",
            }}
          ></div>
          <span
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Excellent (4.0+)
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#f59e0b",
              borderRadius: "3px",
            }}
          ></div>
          <span
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Good (3.0-3.9)
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#ef4444",
              borderRadius: "3px",
            }}
          ></div>
          <span
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Needs Improvement ({"<"}3.0)
          </span>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;