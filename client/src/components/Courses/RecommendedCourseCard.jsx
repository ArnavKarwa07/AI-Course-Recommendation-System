export default function RecommendedCourseCard({ course }) {
  return (
    <div className="recommended-course-card">
      {/* Header with title and reason */}
      <div className="recommended-course-card-header">
        <h3 className="recommended-course-card-title">
          {course.name || course.c_name || `Course ${course.course_id}`}
        </h3>
        {course.reason && (
          <span className="recommended-course-card-reason">
            🎯 {course.reason}
          </span>
        )}
      </div>

      {/* Description */}
      {course.desc && (
        <p className="recommended-course-card-description">{course.desc}</p>
      )}

      {/* Course Details Grid */}
      <div className="recommended-course-card-details-grid">
        {/* Category */}
        {course.category && (
          <div className="recommended-course-card-detail-item">
            <span className="recommended-course-card-detail-icon">📂</span>
            <div>
              <p className="recommended-course-card-detail-label">Category</p>
              <p className="recommended-course-card-detail-value">
                {course.category}
              </p>
            </div>
          </div>
        )}

        {/* Level */}
        {course.level && (
          <div className="recommended-course-card-detail-item">
            <span className="recommended-course-card-detail-icon">📊</span>
            <div>
              <p className="recommended-course-card-detail-label">Level</p>
              <p className="recommended-course-card-detail-value">
                {course.level}
              </p>
            </div>
          </div>
        )}

        {/* Duration */}
        {course.duration && (
          <div className="recommended-course-card-detail-item">
            <span className="recommended-course-card-detail-icon">⏱️</span>
            <div>
              <p className="recommended-course-card-detail-label">Duration</p>
              <p className="recommended-course-card-detail-value">
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
          <div className="recommended-course-card-detail-item">
            <span className="recommended-course-card-detail-icon">💻</span>
            <div>
              <p className="recommended-course-card-detail-label">Format</p>
              <p className="recommended-course-card-detail-value">
                {course.format}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Skills Section */}
      {course.skills && Object.keys(course.skills).length > 0 && (
        <div className="recommended-course-card-skills-section">
          <p className="recommended-course-card-skills-title">
            🎯 Skills You'll Learn
          </p>
          <div className="recommended-course-card-skills-list">
            {Object.entries(course.skills).map(([skill, level]) => (
              <span key={skill} className="recommended-course-card-skill-tag">
                {skill} (Level {level})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {course.prerequisite_skills && (
        <div className="recommended-course-card-prerequisites-section">
          <p className="recommended-course-card-prerequisites-title">
            📋 Prerequisites
          </p>
          {typeof course.prerequisite_skills === "string" ? (
            course.prerequisite_skills.trim() === "" ? (
              <p className="recommended-course-card-prerequisites-text">None</p>
            ) : (
              <p className="recommended-course-card-prerequisites-text">
                {course.prerequisite_skills}
              </p>
            )
          ) : typeof course.prerequisite_skills === "object" &&
            course.prerequisite_skills !== null ? (
            Object.keys(course.prerequisite_skills).length === 0 ? (
              <span className="recommended-course-card-prerequisite-tag">None</span>
            ) : (
              <div className="recommended-course-card-prerequisites-list">
                {Object.entries(course.prerequisite_skills).map(
                  ([skill, level]) => (
                    <span
                      key={skill}
                      className="recommended-course-card-prerequisite-tag"
                    >
                      {skill} (Level {level})
                    </span>
                  )
                )}
              </div>
            )
          ) : (
            <p className="recommended-course-card-prerequisite-tag">None</p>
          )}
        </div>
      )}

      {/* Enroll Button */}
      <div className="recommended-course-card-footer">
        <button
          className="recommended-course-card-enroll-btn"
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
