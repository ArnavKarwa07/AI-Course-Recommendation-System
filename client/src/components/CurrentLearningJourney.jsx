/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";

export default function CurrentLearningJourney({
  ongoingCoursesData,
  loading,
  error,
}) {
  const [learningItems, setLearningItems] = useState([]);

  useEffect(() => {
    if (ongoingCoursesData && ongoingCoursesData.length > 0) {
      const formattedCourses = ongoingCoursesData.map((course) => ({
        title: course.course_name,
        progress: course.current_progress,
        description: formatDescription(course),
        courseId: course.course_id,
        level: course.course_level,
        format: course.course_format,
        duration: course.course_duration,
        category: course.course_category,
        startDate: course.start_date,
        skills: course.course_skills,
      }));
      setLearningItems(formattedCourses);
    } else {
      setLearningItems([]);
    }
  }, [ongoingCoursesData]);

  const formatDescription = (course) => {
    const remainingTime = calculateRemainingTime(
      course.current_progress,
      course.course_duration
    );
    const startDate = course.start_date
      ? new Date(course.start_date).toLocaleDateString()
      : "N/A";
    return `${course.course_level} • ${course.course_format} • Started: ${startDate} • ${remainingTime} remaining`;
  };

  const calculateRemainingTime = (progress, totalDuration) => {
    if (progress >= 100) return "Completed";

    const remainingProgress = 100 - progress;
    const remainingMonths = (remainingProgress / 100) * totalDuration;

    if (remainingMonths < 1) {
      const remainingWeeks = Math.ceil(remainingMonths * 4);
      return `${remainingWeeks} week${remainingWeeks !== 1 ? "s" : ""}`;
    } else {
      const months = Math.ceil(remainingMonths);
      return `${months} month${months !== 1 ? "s" : ""}`;
    }
  };

  const formatSkills = (skills) => {
    if (!skills || typeof skills !== "object") return null;
    return Object.keys(skills).slice(0, 3).join(", ");
  };

  if (loading) {
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
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          Loading your ongoing courses...
        </div>
      </div>
    );
  }

  if (error) {
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
        <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
          {error}
        </div>
      </div>
    );
  }

  if (learningItems.length === 0) {
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
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          No ongoing courses found. Start a new course to see your progress
          here!
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2
        style={{ fontWeight: "600", color: "#1f2937", marginBottom: "1.5rem" }}
      >
        Current Learning Journey
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {learningItems.map((item, index) => (
          <div key={item.courseId || index} className="learning-item">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontWeight: "500", color: "#374151" }}>
                  {item.title}
                </h4>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {item.category}
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#3b82f6",
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
            {item.skills && formatSkills(item.skills) && (
              <div style={{ marginTop: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#9ca3af",
                    fontWeight: "500",
                  }}
                >
                  Skills: {formatSkills(item.skills)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
