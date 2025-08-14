/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import ProgressBar from "../Shared/ProgressBar";

export default function CurrentLearningJourney({
  ongoingCoursesData,
  loading,
  error,
}) {
  const [learningItems, setLearningItems] = useState([]);

  useEffect(() => {
    if (ongoingCoursesData && ongoingCoursesData.length > 0) {
      // Use the data as-is, only generate description if missing
      const formattedCourses = ongoingCoursesData.map((course) => ({
        ...course,
        description:
          course.description && course.description.length > 0
            ? course.description
            : formatDescription(course),
      }));
      setLearningItems(formattedCourses);
    } else {
      setLearningItems([]);
    }
  }, [ongoingCoursesData]);

  const formatDescription = (course) => {
    const progress = course.progress ?? 0;
    const duration = course.duration ?? 1;
    const level = course.level || "N/A";
    const format = course.format || "N/A";
    const startDate = course.startDate
      ? new Date(course.startDate).toLocaleDateString()
      : "N/A";
    const remainingTime = calculateRemainingTime(progress, duration);
    return `${level} • ${format} • Started: ${startDate} • ${remainingTime} remaining`;
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
        <h2 className="current-learning-journey-title">
          Current Learning Journey
        </h2>
        <div className="current-learning-journey-loading">
          Loading your ongoing courses...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="current-learning-journey-title">
          Current Learning Journey
        </h2>
        <div className="current-learning-journey-error">{error}</div>
      </div>
    );
  }

  if (learningItems.length === 0) {
    return (
      <div className="card">
        <h2 className="current-learning-journey-title">
          Current Learning Journey
        </h2>
        <div className="current-learning-journey-empty">
          No ongoing courses found. Start a new course to see your progress
          here!
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="current-learning-journey-title">
        Current Learning Journey
      </h2>

      <div className="current-learning-journey-list">
        {learningItems.map((item, index) => (
          <div key={item.courseId || index} className="learning-item">
            <div className="current-learning-journey-item-header">
              <div className="current-learning-journey-item-info">
                <h4>{item.title}</h4>
                <span className="current-learning-journey-item-category">
                  {item.category}
                </span>
              </div>
              <span className="current-learning-journey-item-progress">
                {item.progress}%
              </span>
            </div>
            <ProgressBar percent={item.progress} />
            <p className="current-learning-journey-item-description">
              {item.description}
            </p>
            {item.skills && formatSkills(item.skills) && (
              <div className="current-learning-journey-item-skills">
                <span className="current-learning-journey-item-skills-text">
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
