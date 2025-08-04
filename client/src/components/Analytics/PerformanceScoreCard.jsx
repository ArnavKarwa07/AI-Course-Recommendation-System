export default function PerformanceScoreCard({ averageKPI, kpiDataLength }) {
  return (
    <div
      className="card"
      style={{
        background: "#ffffff",
        color: "#374151",
        border: "1px solid #9d9d9dff",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "80px",
          height: "80px",
          background: "rgba(59, 130, 246, 0.05)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1, padding: "1.5rem" }}>
        <h3
          style={{
            margin: 0,
            fontWeight: "600",
            fontSize: "1.1rem",
            color: "#6b7280",
            marginBottom: "1rem",
          }}
        >
          Performance Score
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              color: "#1f2937",
            }}
          >
            {averageKPI}
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
              out of 5.0
            </p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>
              Based on {kpiDataLength || 0} metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
