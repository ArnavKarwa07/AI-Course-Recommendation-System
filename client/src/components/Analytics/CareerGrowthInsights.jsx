export default function CareerGrowthInsights({
  employeeDetails,
  timeSinceLastPromotion,
  promotionCycle,
}) {
  return (
    <div
      className="card"
      style={{
        marginTop: "2rem",
        border: "none",
        padding: "2.5rem 2rem",
        borderRadius: "18px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background shapes */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "120px",
          height: "120px",
          background:
            "radial-gradient(circle, #10b98122 60%, transparent 100%)",
          zIndex: 0,
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30px",
          left: "-30px",
          width: "80px",
          height: "80px",
          background:
            "radial-gradient(circle, #3b82f622 60%, transparent 100%)",
          zIndex: 0,
          borderRadius: "50%",
        }}
      />
      <h2
        style={{
          fontWeight: "700",
          color: "#1f2937",
          margin: "0 0 2.5rem 0",
          letterSpacing: "0.01em",
          fontSize: "2rem",
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        Career Growth Insights
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Current Role */}
        <div
          style={{
            padding: "1.5rem",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 2px 8px 0 rgba(31,41,55,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1.5px solid #d1fae5",
            minHeight: "140px",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "1.7rem",
              marginBottom: "0.5rem",
              color: "#10b981",
            }}
            role="img"
            aria-label="role"
          >
            🧑‍💼
          </span>
          <h4
            style={{
              margin: "0 0 0.5rem 0",
              color: "#374151",
              fontWeight: 600,
            }}
          >
            Current Role
          </h4>
          <p
            style={{
              margin: 0,
              fontWeight: "600",
              color: "#1f2937",
              fontSize: "1.1rem",
            }}
          >
            {employeeDetails?.role}
          </p>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280" }}>
            {employeeDetails?.dept} Department
          </p>
        </div>

        {/* Career Goal */}
        <div
          style={{
            padding: "1.5rem",
            background: "#f0fdfa",
            borderRadius: "14px",
            boxShadow: "0 2px 8px 0 rgba(16,185,129,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1.5px solid #a7f3d0",
            minHeight: "140px",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "1.7rem",
              marginBottom: "0.5rem",
              color: "#10b981",
            }}
            role="img"
            aria-label="goal"
          >
            🎯
          </span>
          <h4
            style={{
              margin: "0 0 0.5rem 0",
              color: "#374151",
              fontWeight: 600,
            }}
          >
            Career Goal
          </h4>
          <p
            style={{
              margin: 0,
              fontWeight: "700",
              color: "#10b981",
              fontSize: "1.1rem",
            }}
          >
            {employeeDetails?.career_goal}
          </p>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280" }}>
            Target Position
          </p>
        </div>

        {/* Experience */}
        <div
          style={{
            padding: "1.5rem",
            background: "#eff6ff",
            borderRadius: "14px",
            boxShadow: "0 2px 8px 0 rgba(59,130,246,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1.5px solid #bfdbfe",
            minHeight: "140px",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "1.7rem",
              marginBottom: "0.5rem",
              color: "#3b82f6",
            }}
            role="img"
            aria-label="experience"
          >
            ⏳
          </span>
          <h4
            style={{
              margin: "0 0 0.5rem 0",
              color: "#374151",
              fontWeight: 600,
            }}
          >
            Experience
          </h4>
          <p
            style={{
              margin: 0,
              fontWeight: "700",
              color: "#3b82f6",
              fontSize: "1.1rem",
            }}
          >
            {employeeDetails?.experience} months
          </p>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280" }}>
            Total Experience
          </p>
        </div>

        {/* Next Promotion */}
        <div
          style={{
            padding: "1.5rem",
            background: "#fef3c7",
            borderRadius: "14px",
            boxShadow: "0 2px 8px 0 rgba(251,191,36,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1.5px solid #fde68a",
            minHeight: "140px",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "1.7rem",
              marginBottom: "0.5rem",
              color: "#f59e0b",
            }}
            role="img"
            aria-label="promotion"
          >
            📈
          </span>
          <h4
            style={{
              margin: "0 0 0.5rem 0",
              color: "#374151",
              fontWeight: 600,
            }}
          >
            Next Promotion
          </h4>
          <p
            style={{
              margin: 0,
              fontWeight: "700",
              color: "#f59e0b",
              fontSize: "1.1rem",
            }}
          >
            ~{Math.max(0, promotionCycle - timeSinceLastPromotion)} months
          </p>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280" }}>
            Estimated Timeline
          </p>
        </div>
      </div>
    </div>
  );
}
