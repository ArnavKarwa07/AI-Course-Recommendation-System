export default function ProfileHeader({ employeeData }) {
  if (!employeeData) return null;

  return (
    <div
      className="card"
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
        color: "white",
        marginBottom: "2rem",
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          {employeeData.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "N/A"}
        </div>
        <div>
          <p style={{ margin: "0 0 0.5rem 0", fontSize: "2rem" }}>
            {employeeData.name}{" "}
            <span
              style={{
                fontSize: "1.2rem",
                opacity: 0.9,
              }}
            >
              - {employeeData.role}
            </span>
          </p>
          <p style={{ margin: "0", opacity: 0.8 }}>
            Department: {employeeData.dept}
          </p>
          <div
            style={{
              marginTop: "0.5rem",
              padding: "0.25rem 0.75rem",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "1rem",
              fontSize: "0.875rem",
              display: "inline-block",
            }}
          >
            ID: {employeeData.emp_id}
          </div>
        </div>
      </div>
    </div>
  );
}
