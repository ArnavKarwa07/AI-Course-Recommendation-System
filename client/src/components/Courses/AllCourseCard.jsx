export default function AllCourseCard({ course }) {
  return (
    <div className="all-course-card">
      {/* Header with title */}
      <div className="all-course-card-header">
        <h3 className="all-course-card-title">
          {course.name || course.c_name || `Course ${course.course_id}`}
        </h3>
      </div>

      {/* Description */}
      {course.desc && (
        <p className="all-course-card-description">{course.desc}</p>
      )}

      {/* Course Details Grid */}
      <div className="all-course-card-details-grid">
        {/* Category */}
        {course.category && (
          <div className="all-course-card-detail-item">
            <span className="all-course-card-detail-icon">📂</span>
            <div>
              <p className="all-course-card-detail-label">Category</p>
              <p className="all-course-card-detail-value">{course.category}</p>
            </div>
          </div>
        )}

        {/* Level */}
        {course.level && (
          <div className="all-course-card-detail-item">
            <span className="all-course-card-detail-icon">📊</span>
            <div>
              <p className="all-course-card-detail-label">Level</p>
              <p className="all-course-card-detail-value">{course.level}</p>
            </div>
          </div>
        )}

        {/* Duration */}
        {course.duration && (
          <div className="all-course-card-detail-item">
            <span className="all-course-card-detail-icon">⏱️</span>
            <div>
              <p className="all-course-card-detail-label">Duration</p>
              <p className="all-course-card-detail-value">
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
          <div className="all-course-card-detail-item">
            <span className="all-course-card-detail-icon">💻</span>
            <div>
              <p className="all-course-card-detail-label">Format</p>
              <p className="all-course-card-detail-value">{course.format}</p>
            </div>
          </div>
        )}
      </div>

      {/* Skills Section */}
      {course.skills && Object.keys(course.skills).length > 0 && (
        <div className="all-course-card-skills-section">
          <p className="all-course-card-skills-title">🎯 Skills You'll Learn</p>
          <div className="all-course-card-skills-list">
            {Object.entries(course.skills).map(([skill, level]) => (
              <span key={skill} className="all-course-card-skill-tag">
                {skill} (Level {level})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites */}
      <div className="all-course-card-prerequisites-section">
        <p className="all-course-card-prerequisites-title">📋 Prerequisites</p>
        {course.prerequisite_skills ? (
          typeof course.prerequisite_skills === "string" ? (
            <p className="all-course-card-prerequisites-text">
              {course.prerequisite_skills}
            </p>
          ) : typeof course.prerequisite_skills === "object" &&
            course.prerequisite_skills !== null &&
            Object.keys(course.prerequisite_skills).length > 0 ? (
            <div className="all-course-card-prerequisites-list">
              {Object.entries(course.prerequisite_skills).map(
                ([skill, level]) => (
                  <span
                    key={skill}
                    className="all-course-card-prerequisite-tag"
                  >
                    {skill} (Level {level})
                  </span>
                )
              )}
            </div>
          ) : (
            <p className="all-course-card-prerequisites-none">None</p>
          )
        ) : (
          <p className="all-course-card-prerequisites-none">None</p>
        )}
      </div>

      {/* Enroll Button */}
      <div className="all-course-card-footer">
        <button
          className="all-course-card-enroll-btn"
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
