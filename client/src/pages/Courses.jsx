import { useState, useEffect, useCallback } from "react";
import {
  getCoursesAPI,
  useCourseRecommendationAPI,
  useRefreshCoursesAPI,
} from "../api/apis";
import { useAuth } from "../context/AuthContext";
import AllCourseCard from "../components/AllCourseCard";
import RecommendedCourseCard from "../components/RecommendedCourseCard";

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

      if (response?.valid) {
        const recommendations = response.output || [];

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
          const found = recommendations.some(
            (rec) => rec.course_id === courseId
          );
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
      } else {
        console.warn("Invalid recommendation response");
        setRecommendedCourses([]);
        setRecommendationError(true);
        setActiveFilter("recommended");
      }
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

      if (response?.valid) {
        const recommendations = response.output || [];

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
          const found = recommendations.some(
            (rec) => rec.course_id === courseId
          );
          return found;
        });

        // Check if no courses were found after filtering
        if (filteredCourses.length === 0) {
          console.warn(
            "No matching courses found for refreshed recommendations"
          );
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
      } else {
        console.warn("Invalid refreshed recommendation response");
        setRecommendedCourses([]);
        setRecommendationError(true);
        setActiveFilter("recommended");
      }
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
    <div
      style={{
        textAlign: "center",
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
        border: "1px solid #f59e0b",
        borderRadius: "12px",
        margin: "2rem 0",
        color: "#92400e",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          margin: "0 0 1rem 0",
          color: "#92400e",
        }}
      >
        Unable to Load Recommended Courses
      </h3>
      <p
        style={{
          fontSize: "1rem",
          lineHeight: "1.6",
          margin: "0 0 1.5rem 0",
          color: "#a16207",
        }}
      >
        We're having trouble generating personalized course recommendations for
        you right now. This could be due to limited profile data or a temporary
        service issue.
      </p>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => {
            setRecommendationError(false);
            setRecommendationsLoaded(false);
            setRecommendedCourses([]);
            handleFetchRecommended();
          }}
          style={{
            background: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 1.5rem",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#d97706";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#f59e0b";
          }}
        >
          🔄 Try Again
        </button>
        <button
          onClick={() => setActiveFilter("all")}
          style={{
            background: "transparent",
            color: "#92400e",
            border: "2px solid #f59e0b",
            borderRadius: "8px",
            padding: "0.75rem 1.5rem",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#f59e0b";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#92400e";
          }}
        >
          📚 Browse All Courses
        </button>
      </div>
    </div>
  );

  return (
    <div className="courses-page">
      <div
        className="filter-buttons"
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1rem",
          padding: "0.5rem",
          borderRadius: "12px",
          width: "fit-content",
        }}
      >
        <button
          className={activeFilter === "all" ? "active" : ""}
          onClick={() => setActiveFilter("all")}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: activeFilter === "all" ? "#3b82f6" : "transparent",
            color: activeFilter === "all" ? "white" : "#6b7280",
            ...(activeFilter === "all"
              ? {
                  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                }
              : {}),
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== "all") {
              e.target.style.background = "#f1f5f9";
              e.target.style.color = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== "all") {
              e.target.style.background = "transparent";
              e.target.style.color = "#6b7280";
            }
          }}
        >
          All Courses
        </button>
        <button
          className={activeFilter === "recommended" ? "active" : ""}
          onClick={handleFetchRecommended}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background:
              activeFilter === "recommended" ? "#3b82f6" : "transparent",
            color: activeFilter === "recommended" ? "white" : "#6b7280",
            ...(activeFilter === "recommended"
              ? {
                  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                }
              : {}),
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== "recommended") {
              e.target.style.background = "#f1f5f9";
              e.target.style.color = "#374151";
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== "recommended") {
              e.target.style.background = "transparent";
              e.target.style.color = "#6b7280";
            }
          }}
        >
          AI Recommended Courses
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "absolute",
            right: "30px",
          }}
        >
          {recommendationsLoaded && recommendedCourses.length > 0 && (
            <button
              onClick={handleRefreshRecommended}
              style={{
                background: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                padding: "0.5rem",
                cursor: "pointer",
                color: "#6b7280",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f9fafb";
                e.target.style.borderColor = "#9ca3af";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.borderColor = "#d1d5db";
              }}
              title="Refresh Course Recommendations"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🤖</div>
          <p>Loading courses...</p>
        </div>
      ) : (
        <div>
          {activeFilter === "recommended" &&
          (recommendationError || recommendedCourses.length === 0) ? (
            renderRecommendationFailsafe()
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {(activeFilter === "all" ? allCourses : recommendedCourses).map(
                renderCourseCard
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
