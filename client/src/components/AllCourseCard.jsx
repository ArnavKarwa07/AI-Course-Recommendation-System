export default function AllCourseCard({ course }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "1rem",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)";
        e.currentTarget.style.borderColor = "#0ea5e9";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 4px 15px rgba(0, 0, 0, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)";
        e.currentTarget.style.borderColor = "#e2e8f0";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 1px 3px rgba(0, 0, 0, 0.1)";
      }}
    >
      {/* Header with title */}
      <div style={{ marginBottom: "0.75rem" }}>
        <h3
          style={{
            fontWeight: "700",
            color: "#1e293b",
            margin: 0,
            fontSize: "1.1rem",
            lineHeight: "1.3",
          }}
        >
          {course.name || course.c_name || `Course ${course.course_id}`}
        </h3>
      </div>

      {/* Description */}
      {course.desc && (
        <p
          style={{
            color: "#64748b",
            marginBottom: "1rem",
            fontSize: "0.85rem",
            lineHeight: "1.5",
          }}
        >
          {course.desc}
        </p>
      )}

      {/* Course Details Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        {/* Category */}
        {course.category && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>📂</span>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Category
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#374151",
                  fontWeight: "600",
                }}
              >
                {course.category}
              </p>
            </div>
          </div>
        )}

        {/* Level */}
        {course.level && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>📊</span>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Level
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#374151",
                  fontWeight: "600",
                }}
              >
                {course.level}
              </p>
            </div>
          </div>
        )}

        {/* Duration */}
        {course.duration && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>⏱️</span>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Duration
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#374151",
                  fontWeight: "600",
                }}
              >
                {course.duration}{" "}
                {typeof course.duration === "number"
                  ? course.duration === 1
                    ? "week"
                    : "weeks"
                  : ""}
              </p>
            </div>
          </div>
        )}

        {/* Format */}
        {course.format && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>💻</span>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Format
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#374151",
                  fontWeight: "600",
                }}
              >
                {course.format}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Skills Section */}
      {course.skills && Object.keys(course.skills).length > 0 && (
        <div style={{ marginBottom: "0.75rem" }}>
          <p
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "0.7rem",
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            🎯 Skills You'll Learn
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
            }}
          >
            {Object.entries(course.skills).map(([skill, level]) => (
              <span
                key={skill}
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontWeight: "500",
                  border: "1px solid #e5e7eb",
                }}
              >
                {skill} (Level {level})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {course.prerequisite_skills && (
        <div style={{ marginBottom: "0.75rem" }}>
          <p
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "0.7rem",
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            📋 Prerequisites
          </p>
          {typeof course.prerequisite_skills === "string" ? (
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#374151",
              }}
            >
              {course.prerequisite_skills}
            </p>
          ) : typeof course.prerequisite_skills === "object" &&
            course.prerequisite_skills !== null ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
              }}
            >
              {Object.entries(course.prerequisite_skills).map(
                ([skill, level]) => (
                  <span
                    key={skill}
                    style={{
                      background: "#fef3c7",
                      color: "#92400e",
                      padding: "0.2rem 0.4rem",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      fontWeight: "500",
                      border: "1px solid #fde68a",
                    }}
                  >
                    {skill} (Level {level})
                  </span>
                )
              )}
            </div>
          ) : (
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#374151",
              }}
            >
              {String(course.prerequisite_skills)}
            </p>
          )}
        </div>
      )}

      {/* Enroll Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "0.75rem",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <button
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "0.4rem 0.8rem",
            fontSize: "0.8rem",
            fontWeight: "500",
            transition: "all 0.2s ease",
            position: "absolute",
            bottom: "10px",
            right: "10px",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#1d4ed8";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#3b82f6";
            e.target.style.transform = "translateY(0)";
          }}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Enroll in course:", course.name);
          }}
        >
          Enroll
        </button>
      </div>
    </div>
  );
}