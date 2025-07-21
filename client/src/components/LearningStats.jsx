export default function LearningStats({ completedCourses }) {
  // Calculate stats from the data
  const totalCourses = completedCourses.length;
  const totalMonthsLearned = completedCourses.reduce(
    (sum, course) => sum + (course.duration || 0),
    0
  );
  const averageScore =
    completedCourses.length > 0
      ? (
          completedCourses.reduce(
            (sum, course) => sum + (course.score || 0),
            0
          ) / completedCourses.length
        ).toFixed(1)
      : 0;

  // Get unique categories
  const uniqueCategories = [
    ...new Set(completedCourses.map((course) => course.course_category)),
  ].length;

  const stats = [
    {
      value: totalCourses,
      label: "Courses Completed",
      color: "#3b82f6",
    },
    {
      value: `${totalMonthsLearned}`,
      label: "Months Learned",
      color: "#10b981",
    },
    {
      value: `${averageScore}`,
      label: "Average Score",
      color: "#f59e0b",
    },
    {
      value: uniqueCategories,
      label: "Categories",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Learning Stats</h3>

      {completedCourses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "1rem", color: "#6b7280" }}>
          No courses completed yet
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    color: stat.color,
                    margin: 0,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "0.8rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Achievement */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "0.75rem",
              fontSize: "0.85rem",
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            <strong>Latest:</strong>{" "}
            {completedCourses[completedCourses.length - 1]?.course_name}
          </div>
        </>
      )}
    </div>
  );
}
