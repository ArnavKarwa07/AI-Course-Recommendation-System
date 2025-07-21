export default function RecommendedCourseCard({ course }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        border: "1px solid #bbf7d0",
        borderRadius: "12px",
        padding: "1rem",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(34, 197, 94, 0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)";
        e.currentTarget.style.borderColor = "#22c55e";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)";
        e.currentTarget.style.borderColor = "#bbf7d0";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(34, 197, 94, 0.1)";
      }}
    >
      {/* Header with title and reason */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <h3
          style={{
            fontWeight: "700",
            color: "#14532d",
            margin: 0,
            fontSize: "1.1rem",
            lineHeight: "1.3",
            flex: "1",
            minWidth: "160px",
          }}
        >
          {course.name || course.c_name || `Course ${course.course_id}`}
        </h3>
        {course.reason && (
          <span
            style={{
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              color: "#92400e",
              padding: "0.3rem 0.8rem",
              borderRadius: "9999px",
              fontSize: "0.7rem",
              fontWeight: "700",
              border: "1px solid #f59e0b",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 2px rgba(245, 158, 11, 0.2)",
            }}
          >
            🎯 {course.reason}
          </span>
        )}
      </div>
      {/* Description */}
      {course.desc && (
        <p
          style={{
            color: "#166534",
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
                  color: "#15803d",
                  fontWeight: "500",
                }}
              >
                Category
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#14532d",
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
                  color: "#15803d",
                  fontWeight: "500",
                }}
              >
                Level
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#14532d",
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
                  color: "#15803d",
                  fontWeight: "500",
                }}
              >
                Duration
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#14532d",
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
                  color: "#15803d",
                  fontWeight: "500",
                }}
              >
                Format
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#14532d",
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
              color: "#15803d",
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
                  background: "#63dede",
                  color: "#166534",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontWeight: "500",
                  border: "1px solid #bbf7d0",
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
              color: "#15803d",
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
                color: "#14532d",
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
                color: "#14532d",
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
        }}
      >
        <button
          style={{
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "0.4rem 0.8rem",
            fontSize: "0.8rem",
            fontWeight: "600",
            transition: "all 0.2s ease",
            position: "absolute",
            bottom: "10px",
            right: "10px",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(34, 197, 94, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, #16a34a 0%, #15803d 100%)";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 2px 6px rgba(34, 197, 94, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 1px 3px rgba(34, 197, 94, 0.3)";
          }}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Enroll in recommended course:", course.name);
          }}
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}
