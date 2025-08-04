export default function AITraitsCard({ behaviorTraits }) {
  return (
    <div
      className="card"
      style={{
        background: "#ffffff",
        color: "#374151",
        border: "1px solid #bc2cffff",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        minHeight: "200px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-25px",
          right: "-25px",
          width: "90px",
          height: "90px",
          background: "rgba(139, 92, 246, 0.05)",
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
          AI Identified Traits
        </h3>
        {behaviorTraits && behaviorTraits.length > 0 ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
                color: "#8b5cf6",
              }}
            >
              {behaviorTraits.length}
            </div>
            <p
              style={{
                margin: "0 0 1rem 0",
                fontSize: "0.9rem",
                color: "#6b7280",
              }}
            >
              Traits identified
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                justifyContent: "center",
                maxHeight: "60px",
                overflow: "hidden",
              }}
            >
              {behaviorTraits.map((trait, index) => (
                <span
                  key={index}
                  style={{
                    background: "#f3f4f6",
                    color: "#6b7280",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "12px",
                    fontSize: "0.7rem",
                    fontWeight: "500",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "0.5rem",
                color: "#9ca3af",
              }}
            >
              ...
            </div>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
              Analyzing behavior
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginTop: "0.5rem",
              }}
            >
              AI insights coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
