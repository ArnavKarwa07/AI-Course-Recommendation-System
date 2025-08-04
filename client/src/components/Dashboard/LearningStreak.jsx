export default function LearningStreak() {
  return (
    <div className="card learning-streak">
      <div className="streak-circle">
        <span>15</span>
      </div>
      <h3
        style={{
          fontWeight: "600",
          margin: "0 0 0.5rem 0",
          color: "#1f2937",
        }}
      >
        Day Streak
      </h3>
      <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
        SkillSense AI tracking your consistency 🔥
      </p>
    </div>
  );
}