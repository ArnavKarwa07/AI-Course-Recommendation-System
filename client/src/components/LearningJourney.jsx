import ProgressBar from "./ProgressBar";

export default function LearningJourney() {
  const learningItems = [
    {
      title: "Machine Learning",
      progress: 60,
      color: "#3b82f6",
      description: "Advanced concepts • 12 hours remaining"
    },
    {
      title: "Deep Learning",
      progress: 40,
      color: "#10b981",
      description: "Neural Networks • 18 hours remaining"
    },
    {
      title: "Pandas",
      progress: 75,
      color: "#8b5cf6",
      description: "Data manipulation • 6 hours remaining"
    }
  ];

  return (
    <div className="card">
      <h2
        style={{
          fontWeight: "600",
          color: "#1f2937",
          marginBottom: "1.5rem",
        }}
      >
        Current Learning Journey
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {learningItems.map((item, index) => (
          <div key={index} className="learning-item">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <h4
                style={{ margin: 0, fontWeight: "500", color: "#374151" }}
              >
                {item.title}
              </h4>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: item.color,
                }}
              >
                {item.progress}%
              </span>
            </div>
            <ProgressBar percent={item.progress} />
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.75rem",
                color: "#6b7280",
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}