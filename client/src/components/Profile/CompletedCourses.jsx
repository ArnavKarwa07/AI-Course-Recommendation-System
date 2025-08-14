export default function CompletedCourses({ completedCourses }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getScoreClass = (score) => {
    if (score >= 4.5) return "excellent";
    if (score >= 3.5) return "good";
    return "average";
  };

  return (
    <div className="card">
      <h3 className="completed-courses-title">Completed Courses</h3>
      {completedCourses.length > 0 ? (
        <div className="completed-courses-list">
          {completedCourses.map((course, index) => (
            <div
              key={course.course_id || index}
              className="completed-course-card"
            >
              <div className="completed-course-header">
                <div className="completed-course-content">
                  <div className="completed-course-title-row">
                    <h4 className="completed-course-title">
                      {course.course_name ||
                        course.title ||
                        course.name ||
                        `Course ${index + 1}`}
                    </h4>
                    {course.score && (
                      <div
                        className={`completed-course-score ${getScoreClass(
                          course.score
                        )}`}
                      >
                        ⭐ {course.score}/5
                      </div>
                    )}
                  </div>

                  {(course.course_description || course.description) && (
                    <p className="completed-course-description">
                      {course.course_description || course.description}
                    </p>
                  )}

                  {/* Course Tags */}
                  <div className="completed-course-tags">
                    {course.course_category && (
                      <span className="completed-course-tag category">
                        📂 {course.course_category}
                      </span>
                    )}
                    {course.course_level && (
                      <span className="completed-course-tag level">
                        📊 {course.course_level}
                      </span>
                    )}
                    {course.course_format && (
                      <span className="completed-course-tag format">
                        💻 {course.course_format}
                      </span>
                    )}
                  </div>

                  {/* Course Skills */}
                  {course.course_skills &&
                    Object.keys(course.course_skills).length > 0 && (
                      <div className="completed-course-skills-section">
                        <p className="completed-course-skills-title">
                          Skills Gained:
                        </p>
                        <div className="completed-course-skills-list">
                          {Object.entries(course.course_skills).map(
                            ([skill, level]) => (
                              <span
                                key={skill}
                                className="completed-course-skill-tag"
                              >
                                {skill} (Level {level})
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Course Details */}
                  <div className="completed-course-details-grid">
                    {course.start_date && (
                      <div className="completed-course-detail-item">
                        <span className="completed-course-detail-label">
                          Started:
                        </span>
                        <br />
                        {formatDate(course.start_date)}
                      </div>
                    )}
                    {course.end_date && (
                      <div className="completed-course-detail-item">
                        <span className="completed-course-detail-label">
                          Completed:
                        </span>
                        <br />
                        {formatDate(course.end_date)}
                      </div>
                    )}
                    {course.duration && (
                      <div className="completed-course-detail-item">
                        <span className="completed-course-detail-label">
                          Duration:
                        </span>
                        <br />
                        {course.duration}{" "}
                        {course.duration === 1 ? "month" : "months"}
                      </div>
                    )}
                    {course.expected_duration && (
                      <div className="completed-course-detail-item">
                        <span className="completed-course-detail-label">
                          Expected duration:
                        </span>
                        <br />
                        {course.expected_duration}{" "}
                        {course.expected_duration === 1 ? "month" : "months"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="completed-course-completion-badge">
                  <span className="completed-course-completion-icon">✓</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="completed-courses-empty">No completed courses</p>
      )}
    </div>
  );
}
