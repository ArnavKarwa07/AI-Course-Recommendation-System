export default function CompletedCourses({ completedCourses }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Completed Courses</h3>
      {completedCourses.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {completedCourses.map((course, index) => (
            <div
              key={course.course_id || index}
              style={{
                padding: "1.5rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                backgroundColor: "#f9fafb",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                      }}
                    >
                      {course.course_name ||
                        course.title ||
                        course.name ||
                        `Course ${index + 1}`}
                    </h4>
                    {course.score && (
                      <div
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor:
                            course.score >= 4.5
                              ? "#dcfce7"
                              : course.score >= 3.5
                              ? "#dbeafe"
                              : "#fef3c7",
                          color:
                            course.score >= 4.5
                              ? "#166534"
                              : course.score >= 3.5
                              ? "#1e40af"
                              : "#92400e",
                          borderRadius: "0.5rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        ⭐ {course.score}/5
                      </div>
                    )}
                  </div>

                  {(course.course_description || course.description) && (
                    <p
                      style={{
                        margin: "0 0 1rem 0",
                        color: "#4b5563",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {course.course_description || course.description}
                    </p>
                  )}

                  {/* Course Tags */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {course.course_category && (
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          backgroundColor: "#e0e7ff",
                          color: "#3730a3",
                          borderRadius: "1rem",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                      >
                        📂 {course.course_category}
                      </span>
                    )}
                    {course.course_level && (
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          backgroundColor: "#f0fdf4",
                          color: "#166534",
                          borderRadius: "1rem",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                      >
                        📊 {course.course_level}
                      </span>
                    )}
                    {course.course_format && (
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          backgroundColor: "#fef7cd",
                          color: "#92400e",
                          borderRadius: "1rem",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                      >
                        💻 {course.course_format}
                      </span>
                    )}
                  </div>

                  {/* Course Skills */}
                  {course.course_skills &&
                    Object.keys(course.course_skills).length > 0 && (
                      <div style={{ marginBottom: "1rem" }}>
                        <p
                          style={{
                            margin: "0 0 0.5rem 0",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "#374151",
                          }}
                        >
                          Skills Gained:
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          {Object.entries(course.course_skills).map(
                            ([skill, level]) => (
                              <span
                                key={skill}
                                style={{
                                  padding: "0.25rem 0.75rem",
                                  backgroundColor: "#f3e8ff",
                                  color: "#7c3aed",
                                  borderRadius: "1rem",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                {skill} (Level {level})
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Course Details */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(100px, 1fr))",
                      gap: "0.75rem",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                    }}
                  >
                    {course.start_date && (
                      <div>
                        <span style={{ fontWeight: "500", color: "#374151" }}>
                          Started:
                        </span>
                        <br />
                        {formatDate(course.start_date)}
                      </div>
                    )}
                    {course.end_date && (
                      <div>
                        <span style={{ fontWeight: "500", color: "#374151" }}>
                          Completed:
                        </span>
                        <br />
                        {formatDate(course.end_date)}
                      </div>
                    )}
                    {course.duration && (
                      <div>
                        <span style={{ fontWeight: "500", color: "#374151" }}>
                          Duration:
                        </span>
                        <br />
                        {course.duration}{" "}
                        {course.duration === 1 ? "month" : "months"}
                      </div>
                    )}
                    {course.expected_duration && (
                      <div>
                        <span style={{ fontWeight: "500", color: "#374151" }}>
                          Expected duration:
                        </span>
                        <br />
                        {course.expected_duration}{" "}
                        {course.expected_duration === 1 ? "month" : "months"}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#dcfce7",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "1rem",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "#166534", fontSize: "1.5rem" }}>
                    ✓
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            padding: "2rem",
          }}
        >
          No completed courses
        </p>
      )}
    </div>
  );
}
