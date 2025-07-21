import "./RoadmapTimeline.css";

const RoadmapTimeline = ({ roadmapData }) => {
  // Sort courses by order to ensure proper timeline sequence
  const sortedCourses = roadmapData
    ? [...roadmapData].sort((a, b) => a.order - b.order)
    : [];

  const formatDuration = (months) => {
    return months === 1 ? "1 month" : `${months} months`;
  };

  return (
    <div className="roadmap-timeline">
      <div className="timeline-container">
        <div className="timeline-line"></div>
        {sortedCourses.map((course, index) => (
          <div
            key={index}
            className="timeline-item"
          >
            <div className="timeline-card">
              <div className="timeline-card-header">
                <h3 className="course-name">{course.c_name}</h3>
                <span className="course-reason">{course.reason}</span>
              </div>
              <div className="timeline-card-body">
                <p className="course-description">{course.desc}</p>
                <div className="course-meta">
                  <div className="duration">
                    <i className="icon-clock"></i>
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                </div>
              </div>

              <div className="timeline-card-footer">
                <button className="start-course-btn">Start Course</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedCourses.length === 0 && (
        <div className="timeline-empty">
          <p>No roadmap data available</p>
        </div>
      )}
    </div>
  );
};

export default RoadmapTimeline;
