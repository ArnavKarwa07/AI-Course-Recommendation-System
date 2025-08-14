import { useState, useEffect, useCallback } from "react";
import {
  getCoursesAPI,
  useCourseRecommendationAPI,
  useRefreshCoursesAPI,
} from "../api/apis";
import { useAuth } from "../context/AuthContext";
import AllCourseCard from "../components/Courses/AllCourseCard";
import RecommendedCourseCard from "../components/Courses/RecommendedCourseCard";
import "../styles/courses.css";

export default function Courses() {
  const { empId } = useAuth();
  const { recommendCourses } = useCourseRecommendationAPI();
  const { refreshCourses } = useRefreshCoursesAPI();
  const [activeFilter, setActiveFilter] = useState("all");
  const [allCourses, setAllCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(false);
  const [recommendationError, setRecommendationError] = useState(false);
  const [isValidRecommendation, setIsValidRecommendation] = useState(true);

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setLoading(true);
        const response = await getCoursesAPI();

        // Handle the API response structure { data: courses }
        const coursesData = response?.data || [];

        setAllCourses(coursesData);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCourses();
  }, []);

  // Re-filter recommendations when allCourses becomes available
  useEffect(() => {
    if (
      allCourses.length > 0 &&
      recommendedCourses.length > 0 &&
      recommendedCourses[0]?.course_id
    ) {
      // Check if we have raw recommendations (with course_id) that need filtering
      const hasRawRecommendations = recommendedCourses.some(
        (rec) => rec.course_id && !rec.name
      );

      if (hasRawRecommendations) {
        const filteredCourses = allCourses.filter((course) => {
          const courseId = course.id || course.course_id || course.c_id;
          const found = recommendedCourses.some(
            (rec) => rec.course_id === courseId
          );
          return found;
        });

        const coursesWithReasons = filteredCourses.map((course) => {
          const courseId = course.id || course.course_id || course.c_id;
          const recommendation = recommendedCourses.find(
            (rec) => rec.course_id === courseId
          );
          return {
            ...course,
            reason: recommendation?.reason || "Recommended",
          };
        });

        setRecommendedCourses(coursesWithReasons);
      }
    }
  }, [allCourses, recommendedCourses]);

  // Fetch recommended courses
  const handleFetchRecommended = useCallback(async () => {
    // Check if we already have loaded recommendations
    if (recommendationsLoaded && recommendedCourses.length > 0) {
      setActiveFilter("recommended");
      return;
    }

    if (!empId) {
      console.log("No empId available yet, waiting...");
      return;
    }

    setLoading(true);
    setRecommendationError(false);
    try {
      const response = await recommendCourses();

      // Store the validity flag
      setIsValidRecommendation(response?.valid || false);

      // Modified: Show recommendations even if not valid, but with disclaimer
      const recommendations = response?.output || [];

      // Check if recommendations is empty
      if (recommendations.length === 0) {
        console.warn("No course recommendations returned");
        setRecommendedCourses([]);
        setRecommendationError(true);
        setActiveFilter("recommended");
        return;
      }

      // If allCourses is empty, wait for it to be populated
      if (allCourses.length === 0) {
        setRecommendedCourses(recommendations);
        setRecommendationsLoaded(true);
        setActiveFilter("recommended");
        return;
      }

      // Filter all courses based on course_id from recommendations
      const filteredCourses = allCourses.filter((course) => {
        const courseId = course.id || course.course_id || course.c_id;
        const found = recommendations.some((rec) => rec.course_id === courseId);
        return found;
      });

      // Check if no courses were found after filtering
      if (filteredCourses.length === 0) {
        console.warn("No matching courses found for recommendations");
        setRecommendedCourses([]);
        setRecommendationError(true);
        setActiveFilter("recommended");
        return;
      }

      // Add recommendation reasons to the filtered courses
      const coursesWithReasons = filteredCourses.map((course) => {
        const courseId = course.id || course.course_id || course.c_id;
        const recommendation = recommendations.find(
          (rec) => rec.course_id === courseId
        );
        return {
          ...course,
          reason: recommendation?.reason || "Recommended",
        };
      });

      setRecommendedCourses(coursesWithReasons);
      setRecommendationsLoaded(true);
      setRecommendationError(false);
      setActiveFilter("recommended");
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setRecommendedCourses([]);
      setRecommendationError(true);
    } finally {
      setLoading(false);
    }
  }, [
    empId,
    recommendCourses,
    allCourses,
    recommendationsLoaded,
    recommendedCourses.length,
  ]);

  // Add refresh recommended courses function
  const handleRefreshRecommended = useCallback(async () => {
    if (!empId) {
      console.log("No empId available for refresh");
      return;
    }

    setLoading(true);
    setRecommendationError(false);
    try {
      const response = await refreshCourses();

      // Store the validity flag
      setIsValidRecommendation(response?.valid || false);

      // Modified: Show recommendations even if not valid, but with disclaimer
      const recommendations = response?.output || [];

      // Check if recommendations is empty
      if (recommendations.length === 0) {
        console.warn("No refreshed course recommendations returned");
        setRecommendedCourses([]);
        setRecommendationError(true);
        return;
      }

      // Filter all courses based on course_id from recommendations
      const filteredCourses = allCourses.filter((course) => {
        const courseId = course.id || course.course_id || course.c_id;
        const found = recommendations.some((rec) => rec.course_id === courseId);
        return found;
      });

      // Check if no courses were found after filtering
      if (filteredCourses.length === 0) {
        console.warn("No matching courses found for refreshed recommendations");
        setRecommendedCourses([]);
        setRecommendationError(true);
        return;
      }

      // Add recommendation reasons to the filtered courses
      const coursesWithReasons = filteredCourses.map((course) => {
        const courseId = course.id || course.course_id || course.c_id;
        const recommendation = recommendations.find(
          (rec) => rec.course_id === courseId
        );
        return {
          ...course,
          reason: recommendation?.reason || "Recommended",
        };
      });

      setRecommendedCourses(coursesWithReasons);
      setRecommendationsLoaded(true);
      setRecommendationError(false);
      setActiveFilter("recommended");
    } catch (err) {
      console.error("Error refreshing recommendations:", err);
      setRecommendedCourses([]);
      setRecommendationError(true);
    } finally {
      setLoading(false);
    }
  }, [empId, refreshCourses, allCourses]);

  const renderCourseCard = (course) => {
    if (activeFilter === "recommended") {
      return (
        <RecommendedCourseCard
          key={course.id || course.course_id}
          course={course}
        />
      );
    } else {
      return (
        <AllCourseCard key={course.id || course.course_id} course={course} />
      );
    }
  };

  const renderRecommendationFailsafe = () => (
    <div className="recommendation-failsafe">
      <div className="recommendation-failsafe-icon">⚠️</div>
      <h3 className="recommendation-failsafe-title">
        Unable to Load Recommended Courses
      </h3>
      <p className="recommendation-failsafe-text">
        We're having trouble generating personalized course recommendations for
        you right now. This could be due to limited profile data or a temporary
        service issue.
      </p>
      <div className="recommendation-failsafe-buttons">
        <button
          onClick={() => {
            setRecommendationError(false);
            setRecommendationsLoaded(false);
            setRecommendedCourses([]);
            handleFetchRecommended();
          }}
          className="recommendation-failsafe-button-primary"
        >
          🔄 Try Again
        </button>
        <button
          onClick={() => setActiveFilter("all")}
          className="recommendation-failsafe-button-secondary"
        >
          📚 Browse All Courses
        </button>
      </div>
    </div>
  );

  return (
    <div className="courses-page">
      <div className="filter-buttons">
        <button
          className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All Courses
        </button>
        <button
          className={`filter-button ${
            activeFilter === "recommended" ? "active" : ""
          }`}
          onClick={handleFetchRecommended}
        >
          AI Recommended Courses
        </button>
        <div className="refresh-button-container">
          {recommendationsLoaded && recommendedCourses.length > 0 && (
            <button
              onClick={handleRefreshRecommended}
              className="refresh-button"
              title="Refresh Course Recommendations"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="courses-loading">
          <div className="courses-loading-icon">🤖</div>
          <p>Loading courses...</p>
        </div>
      ) : (
        <div>
          {activeFilter === "recommended" &&
          (recommendationError || recommendedCourses.length === 0) ? (
            renderRecommendationFailsafe()
          ) : (
            <div>
              {/* Show disclaimer if recommendations are not valid - similar to roadmap */}
              {activeFilter === "recommended" &&
                recommendedCourses.length > 0 &&
                !isValidRecommendation && (
                  <div className="recommendation-disclaimer">
                    <span className="recommendation-disclaimer-icon">⚠️</span>
                    <div>
                      <p className="recommendation-disclaimer-text">
                        These course recommendations may not be fully accurate
                      </p>
                    </div>
                  </div>
                )}
              <div className="courses-grid">
                {(activeFilter === "all" ? allCourses : recommendedCourses).map(
                  renderCourseCard
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
