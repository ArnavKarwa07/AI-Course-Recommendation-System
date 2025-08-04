export default function StatsCards() {
  const stats = [
    {
      number: "12",
      label: "Courses Completed",
      sublabel: "SkillSense Tracked"
    },
    {
      number: "148",
      label: "Hours Learned",
      sublabel: "AI Optimized"
    },
    {
      number: "7",
      label: "Certificates Earned",
      sublabel: "Future Ready"
    },
    {
      number: "92%",
      label: "Success Rate",
      sublabel: "AI Predicted"
    }
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      {stats.map((stat, index) => (
        <div key={index} className="card-dashboard" style={{ flex: "1 1 250px" }}>
          <p className="metric-number">{stat.number}</p>
          <p className="metric-label">{stat.label}</p>
          <p className="metric-sublabel">{stat.sublabel}</p>
        </div>
      ))}
    </div>
  );
}