/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  useRoadmapRecommendationAPI,
  useRefreshRoadmapAPI,
  useCourseRecommendationAPI,
  useRefreshCoursesAPI,
  useEmployeeDetailsAPI,
  useCourseCompletionAPI,
  useKPIAPI,
  useProjectsAPI,
  getCoursesAPI,
  getRolesAPI,
} from "../api/apis";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import ProfileHeader from "../components/ProfileHeader";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import PersonalInformation from "../components/PersonalInformation";
import LearningProfile from "../components/LearningProfile";
import LearningStats from "../components/LearningStats";
import CompletedCourses from "../components/CompletedCourses";
import AIRoadmap from "../components/AIRoadmap";
import RecommendedCourseCard from "../components/RecommendedCourseCard";
import KPIDashboard from "../components/KPIDashboard";

export default function Analytics() {
  const { empId } = useAuth();
  const { recommendRoadmap } = useRoadmapRecommendationAPI();
  const { refreshRoadmap } = useRefreshRoadmapAPI();
  const { recommendCourses } = useCourseRecommendationAPI();
  const { refreshCourses } = useRefreshCoursesAPI();
  const { getEmployeeDetails } = useEmployeeDetailsAPI();
  const { getCourseCompletion } = useCourseCompletionAPI();
  const { getKPI } = useKPIAPI();
  const { getProjects } = useProjectsAPI();

  const [roadmapData, setRoadmapData] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [courseCompletion, setCourseCompletion] = useState(null);
  const [kpiData, setKpiData] = useState(null);
  const [projects, setProjects] = useState(null);
  const [courses, setCourses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!empId) return;
      try {
        setLoading(true);
        const [
          employeeResponse,
          courseCompletionResponse,
          kpiResponse,
          projectsResponse,
          coursesResponse,
          rolesResponse,
          roadmapResponse,
          recommendedCoursesResponse,
        ] = await Promise.all([
          getEmployeeDetails(),
          getCourseCompletion(),
          getKPI(),
          getProjects(),
          getCoursesAPI(),
          getRolesAPI(),
          recommendRoadmap(),
          recommendCourses(),
        ]);

        setEmployeeDetails(employeeResponse?.data || employeeResponse);
        setCourseCompletion(
          courseCompletionResponse?.data?.completedCourses ||
            courseCompletionResponse?.data ||
            []
        );
        setKpiData(kpiResponse?.data || kpiResponse || []);
        setProjects(projectsResponse?.data || projectsResponse || []);
        setCourses(coursesResponse?.data || coursesResponse || []);
        setRoles(rolesResponse?.data || rolesResponse || []);
        setRoadmapData(roadmapResponse?.data || roadmapResponse || null);
        setRecommendedCourses(
          recommendedCoursesResponse?.data || recommendedCoursesResponse || []
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [empId]);

  // Helper functions
  const getTimeSinceLastPromotion = () => {
    if (!employeeDetails?.last_promotion_date) return 0;
    const lastPromotion = new Date(employeeDetails.last_promotion_date);
    const now = new Date();
    return Math.floor((now - lastPromotion) / (1000 * 60 * 60 * 24 * 30));
  };

  const getPromotionCycle = () => {
    const currentRole = roles.find(
      (role) => role.role_id === employeeDetails?.role_id
    );
    return currentRole?.avg_promotion_time || 24;
  };

  // Get skill gaps from roadmap and recommended courses analysis
  const getSkillGaps = () => {
    // Collect skill gaps from both roadmapData and recommendedCourses
    const roadmapGaps = Array.isArray(roadmapData?.analysis?.skill_gaps)
      ? roadmapData.analysis.skill_gaps
      : [];
    const recommendedGaps = Array.isArray(recommendedCourses?.analysis?.skill_gaps)
      ? recommendedCourses.analysis.skill_gaps
      : [];

    // Combine, flatten, and deduplicate by string value
    const combined = [...roadmapGaps, ...recommendedGaps];
    return Array.from(new Set(combined.map(String)));
  };

  const getAverageKPI = () => {
    if (!kpiData || !Array.isArray(kpiData)) return 0;
    const total = kpiData.reduce((sum, kpi) => sum + kpi.kpi_score, 0);
    return (total / kpiData.length).toFixed(1);
  };

  const getPromotionProgress = () => {
    const timeSince = getTimeSinceLastPromotion();
    const cycle = getPromotionCycle();
    return Math.min((timeSince / cycle) * 100, 100);
  };

  const handleRefreshRoadmap = async () => {
    try {
      setRoadmapLoading(true);
      const response = await refreshRoadmap();
      setRoadmapData(response?.data || response || null);
    } catch (err) {
      console.error("Error refreshing roadmap:", err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleRefreshCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await refreshCourses();
      setRecommendedCourses(response?.data || response || []);
    } catch (err) {
      console.error("Error refreshing courses:", err);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Get full course details for recommended courses
  const getRecommendedCoursesWithDetails = () => {
    if (!recommendedCourses?.output || !courses) return [];

    return recommendedCourses.output.map((recCourse) => {
      const fullCourse = courses.find(
        (course) => course.course_id === recCourse.course_id
      );
      return {
        ...recCourse,
        ...fullCourse,
        reason: recCourse.reason, // Keep the recommendation reason
      };
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ fontSize: "2rem" }}>🤖</div>
        <p style={{ color: "#6b7280" }}>Loading analytics data...</p>
      </div>
    );
  }

  // Loading component for individual sections
  const SectionLoader = ({ message }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "3rem",
        flexDirection: "column",
        gap: "1rem",
        background: "#f9fafb",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          animation: "spin 1s linear infinite",
        }}
      >
        🤖
      </div>
      <p style={{ color: "#6b7280", margin: 0, fontSize: "1rem" }}>
        {message}
      </p>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );

  return (
    <div
      style={{
        padding: "1rem 2rem 2rem 2rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      {/* <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 0 0",
          }}
        >
          Analytics Dashboard
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1.1rem",
            margin: 0,
          }}
        >
          Comprehensive insights into your performance and growth
        </p>
      </div> */}
      {/* Key Metrics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        <div className="card">
          <h3 style={{ margin: "0 0 1rem 0", color: "#1f2937" }}>
            Average KPI Score
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                color:
                  getAverageKPI() >= 4.0
                    ? "#10b981"
                    : getAverageKPI() >= 3.0
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            >
              {getAverageKPI()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                out of 5.0
              </p>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                Based on {kpiData?.length || 0} metrics
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ margin: "0 0 1rem 0", color: "#1f2937" }}>Skill Gaps</h3>
          {getSkillGaps().length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
              {getSkillGaps().map((gap, index) => (
                  <span
                    key={index}
                    style={{
                      background: "#fef3c7",
                      color: "#92400e",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                    }}
                  >
                    {gap}
                  </span>
                ))}
            </div>
          ) : (
            <p
              style={{
                color: "#10b981",
                fontWeight: "600",
                margin: 0,
                fontSize: "1.1rem",
              }}
            >
              No skill gaps detected!
            </p>
          )}
        </div>

        <div className="card">
          <h3 style={{ margin: "0 0 1rem 0", color: "#1f2937" }}>
            Learning Activity
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#3b82f6",
                }}
              >
                {courseCompletion?.length || 0}
              </div>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>
                Completed
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#10b981",
                }}
              >
                {roadmapData?.output?.length || 0}
              </div>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>
                In Roadmap
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#f59e0b",
                }}
              >
                {recommendedCourses?.output?.length || 0}
              </div>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>
                Recommended
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          marginBottom: "1rem",
        }}
      >
        {/* Left Column */}
        <div>
          <Skills employeeData={employeeDetails} />
          <Projects projectsData={projects} />
          <LearningStats completedCourses={courseCompletion} />
        </div>

        {/* Right Column */}
        <div>
          <CompletedCourses completedCourses={courseCompletion} />
        </div>
      </div>

      {/* KPI Dashboard - Full Width */}
      <KPIDashboard kpiData={kpiData} />

      {/* AI Roadmap Section */}
      <div style={{ marginTop: "2rem" }}>
        {roadmapLoading ? (
          <SectionLoader message="Refreshing your AI roadmap..." />
        ) : (
          <AIRoadmap
            roadmapData={roadmapData}
            isLoading={false}
            onRefresh={handleRefreshRoadmap}
            onGenerate={handleRefreshRoadmap}
          />
        )}
      </div>

      {/* Recommended Courses */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontWeight: "600",
              color: "#1f2937",
              margin: 0,
            }}
          >
            AI Recommended Courses
          </h2>
          <button
            onClick={handleRefreshCourses}
            disabled={coursesLoading}
            style={{
              background: "transparent",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              padding: "0.5rem",
              cursor: coursesLoading ? "not-allowed" : "pointer",
              color: coursesLoading ? "#9ca3af" : "#6b7280",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: coursesLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!coursesLoading) {
                e.target.style.background = "#f9fafb";
                e.target.style.borderColor = "#9ca3af";
              }
            }}
            onMouseLeave={(e) => {
              if (!coursesLoading) {
                e.target.style.background = "transparent";
                e.target.style.borderColor = "#d1d5db";
              }
            }}
            title="Refresh Course Recommendations"
          >
            {coursesLoading ? (
              <span style={{ animation: "spin 1s linear infinite" }}>🔄</span>
            ) : (
              "🔄"
            )}
          </button>
        </div>

        {coursesLoading ? (
          <SectionLoader message="Refreshing course recommendations..." />
        ) : recommendedCourses?.output && recommendedCourses.output.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1rem",
            }}
          >
            {getRecommendedCoursesWithDetails().map((course, index) => (
              <RecommendedCourseCard key={index} course={course} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "#6b7280",
              background: "#f9fafb",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🤖</div>
            <p>
              No course recommendations available. Try refreshing to get new
              suggestions!
            </p>
          </div>
        )}
      </div>

      {/* Career Growth Insights */}
      <div
        className="card"
        style={{
          marginTop: "2rem",
          border: "none",
          padding: "2.5rem 2rem",
          borderRadius: "18px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background shapes */}
        {/* <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, #10b98122 60%, transparent 100%)",
            zIndex: 0,
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "80px",
            height: "80px",
            background: "radial-gradient(circle, #3b82f622 60%, transparent 100%)",
            zIndex: 0,
            borderRadius: "50%",
          }}
        /> */}
        <h2
          style={{
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 2.5rem 0",
            letterSpacing: "0.01em",
            fontSize: "2rem",
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Career Growth Insights
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Current Role */}
          <div
            style={{
              padding: "1.5rem",
              background: "#fff",
              borderRadius: "14px",
              boxShadow: "0 2px 8px 0 rgba(31,41,55,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1.5px solid #d1fae5",
              minHeight: "140px",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: "1.7rem",
                marginBottom: "0.5rem",
                color: "#10b981",
              }}
              role="img"
              aria-label="role"
            >
              🧑‍💼
            </span>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#374151", fontWeight: 600 }}>
              Current Role
            </h4>
            <p style={{ margin: 0, fontWeight: "600", color: "#1f2937", fontSize: "1.1rem" }}>
              {employeeDetails?.role}
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280" }}>
              {employeeDetails?.dept} Department
            </p>
          </div>

          {/* Career Goal */}
          <div
            style={{
              padding: "1.5rem",
              background: "#f0fdfa",
              borderRadius: "14px",
              boxShadow: "0 2px 8px 0 rgba(16,185,129,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1.5px solid #a7f3d0",
              minHeight: "140px",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: "1.7rem",
                marginBottom: "0.5rem",
                color: "#10b981",
              }}
              role="img"
              aria-label="goal"
            >
              🎯
            </span>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#374151", fontWeight: 600 }}>
              Career Goal
            </h4>
            <p style={{ margin: 0, fontWeight: "700", color: "#10b981", fontSize: "1.1rem" }}>
              {employeeDetails?.career_goal}
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280" }}>
              Target Position
            </p>
          </div>

          {/* Experience */}
          <div
            style={{
              padding: "1.5rem",
              background: "#eff6ff",
              borderRadius: "14px",
              boxShadow: "0 2px 8px 0 rgba(59,130,246,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1.5px solid #bfdbfe",
              minHeight: "140px",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: "1.7rem",
                marginBottom: "0.5rem",
                color: "#3b82f6",
              }}
              role="img"
              aria-label="experience"
            >
              ⏳
            </span>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#374151", fontWeight: 600 }}>
              Experience
            </h4>
            <p style={{ margin: 0, fontWeight: "700", color: "#3b82f6", fontSize: "1.1rem" }}>
              {employeeDetails?.experience} months
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280" }}>
              Total Experience
            </p>
          </div>

          {/* Next Promotion */}
          <div
            style={{
              padding: "1.5rem",
              background: "#fef3c7",
              borderRadius: "14px",
              boxShadow: "0 2px 8px 0 rgba(251,191,36,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1.5px solid #fde68a",
              minHeight: "140px",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: "1.7rem",
                marginBottom: "0.5rem",
                color: "#f59e0b",
              }}
              role="img"
              aria-label="promotion"
            >
              📈
            </span>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#374151", fontWeight: 600 }}>
              Next Promotion
            </h4>
            <p style={{ margin: 0, fontWeight: "700", color: "#f59e0b", fontSize: "1.1rem" }}>
              ~{Math.max(0, getPromotionCycle() - getTimeSinceLastPromotion())} months
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280" }}>
              Estimated Timeline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}