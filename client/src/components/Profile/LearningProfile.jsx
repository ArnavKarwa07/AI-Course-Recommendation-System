export default function LearningProfile({ employeeData }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Learning Profile</h3>
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ margin: "0 0 0.5rem 0", fontWeight: "500" }}>
          Learning Preference:
        </p>
        <span
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dbeafe",
            color: "#1e40af",
            borderRadius: "1rem",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          {employeeData.learning_preferences}
        </span>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ margin: "0 0 0.5rem 0", fontWeight: "500" }}>Interests:</p>
        <span
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dcfce7",
            color: "#166534",
            borderRadius: "1rem",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          {employeeData.interests}
        </span>
      </div>
      <div>
        <p style={{ margin: "0 0 0.5rem 0", fontWeight: "500" }}>
          Career Goal:
        </p>
        <span
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#fef3c7",
            color: "#92400e",
            borderRadius: "1rem",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          {employeeData.career_goal}
        </span>
      </div>
    </div>
  );
}
