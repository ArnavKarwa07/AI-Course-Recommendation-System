/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  useRoadmapRecommendationAPI,
  useEmployeeDetailsAPI,
  useCourseCompletionAPI,
  useKPIAPI,
  useProjectsAPI,
  getCoursesAPI,
  getRolesAPI,
} from "../api/apis";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Skills from "../components/Shared/Skills";
import LearningStats from "../components/Shared/LearningStats";
import KPIDashboard from "../components/Shared/KPIDashboard";

export default function Analytics() {
  const { empId } = useAuth();
  const { recommendRoadmap } = useRoadmapRecommendationAPI();
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
    const recommendedGaps = Array.isArray(
      recommendedCourses?.analysis?.skill_gaps
    )
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

  return (
    <div
      style={{
        padding: "1rem 2rem 2rem 2rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        {/* KPI Average Score */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            color: "#374151",
            border: "1px solid #9d9d9dff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              background: "rgba(59, 130, 246, 0.05)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, padding: "1.5rem" }}>
            <h3
              style={{
                margin: 0,
                fontWeight: "600",
                fontSize: "1.1rem",
                color: "#6b7280",
                marginBottom: "1rem",
              }}
            >
              Performance Score
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "800",
                  color: "#1f2937",
                }}
              >
                {getAverageKPI()}
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                  out of 5.0
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>
                  Based on {kpiData?.length || 0} metrics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Gaps */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            color: "#374151",
            border:
              getSkillGaps().length > 0
                ? "1px solid #fbbf24"
                : "1px solid #10b981",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            minHeight: "200px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-15px",
              right: "-15px",
              width: "60px",
              height: "60px",
              background:
                getSkillGaps().length > 0
                  ? "rgba(251, 191, 36, 0.1)"
                  : "rgba(16, 185, 129, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, padding: "1.5rem" }}>
            <h3
              style={{
                margin: 0,
                fontWeight: "600",
                fontSize: "1.1rem",
                color: "#6b7280",
                marginBottom: "1rem",
              }}
            >
              Skill Analysis
            </h3>
            {getSkillGaps().length > 0 ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                    color: "#f59e0b",
                  }}
                >
                  {getSkillGaps().length}
                </div>
                <p
                  style={{
                    margin: "0 0 1rem 0",
                    fontSize: "0.9rem",
                    color: "#6b7280",
                  }}
                >
                  Skill gaps detected
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    justifyContent: "center",
                    // Remove maxHeight and overflow hidden to show all gaps
                  }}
                >
                  {getSkillGaps()
                    .slice(0)
                    .map((gap, index) => (
                      <span
                        key={index}
                        style={{
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "12px",
                          fontSize: "0.7rem",
                          fontWeight: "500",
                          border: "1px solid #fde68a",
                        }}
                      >
                        {gap}
                      </span>
                    ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                    color: "#10b981",
                  }}
                >
                  0
                </div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                  No skill gaps detected
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                    marginTop: "0.5rem",
                  }}
                >
                  You're on track
                </p>
              </div>
            )}
          </div>
        </div>

        {/* AI Behavior Traits */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            color: "#374151",
            border: "1px solid #bc2cffff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            minHeight: "200px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-25px",
              right: "-25px",
              width: "90px",
              height: "90px",
              background: "rgba(139, 92, 246, 0.05)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, padding: "1.5rem" }}>
            <h3
              style={{
                margin: 0,
                fontWeight: "600",
                fontSize: "1.1rem",
                color: "#6b7280",
                marginBottom: "1rem",
              }}
            >
              AI Identified Traits
            </h3>
            {roadmapData?.analysis?.behavior_traits &&
            roadmapData.analysis.behavior_traits.length > 0 ? (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                    color: "#8b5cf6",
                  }}
                >
                  {roadmapData.analysis.behavior_traits.length}
                </div>
                <p
                  style={{
                    margin: "0 0 1rem 0",
                    fontSize: "0.9rem",
                    color: "#6b7280",
                  }}
                >
                  Traits identified
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.4rem",
                    justifyContent: "center",
                    maxHeight: "60px",
                    overflow: "hidden",
                  }}
                >
                  {roadmapData.analysis.behavior_traits
                    .slice(0)
                    .map((trait, index) => (
                      <span
                        key={index}
                        style={{
                          background: "#f3f4f6",
                          color: "#6b7280",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "12px",
                          fontSize: "0.7rem",
                          fontWeight: "500",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        {trait}
                      </span>
                    ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "0.5rem",
                    color: "#9ca3af",
                  }}
                >
                  ...
                </div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
                  Analyzing behavior
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                    marginTop: "0.5rem",
                  }}
                >
                  AI insights coming soon
                </p>
              </div>
            )}
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
          <LearningStats completedCourses={courseCompletion} />
        </div>

        {/* Right Column */}
        <div>
          <Skills employeeData={employeeDetails} />
        </div>
      </div>

      {/* KPI Dashboard - Full Width */}
      <KPIDashboard kpiData={kpiData} />

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
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "120px",
            height: "120px",
            background:
              "radial-gradient(circle, #10b98122 60%, transparent 100%)",
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
            background:
              "radial-gradient(circle, #3b82f622 60%, transparent 100%)",
            zIndex: 0,
            borderRadius: "50%",
          }}
        />
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
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                color: "#374151",
                fontWeight: 600,
              }}
            >
              Current Role
            </h4>
            <p
              style={{
                margin: 0,
                fontWeight: "600",
                color: "#1f2937",
                fontSize: "1.1rem",
              }}
            >
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
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                color: "#374151",
                fontWeight: 600,
              }}
            >
              Career Goal
            </h4>
            <p
              style={{
                margin: 0,
                fontWeight: "700",
                color: "#10b981",
                fontSize: "1.1rem",
              }}
            >
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
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                color: "#374151",
                fontWeight: 600,
              }}
            >
              Experience
            </h4>
            <p
              style={{
                margin: 0,
                fontWeight: "700",
                color: "#3b82f6",
                fontSize: "1.1rem",
              }}
            >
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
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                color: "#374151",
                fontWeight: 600,
              }}
            >
              Next Promotion
            </h4>
            <p
              style={{
                margin: 0,
                fontWeight: "700",
                color: "#f59e0b",
                fontSize: "1.1rem",
              }}
            >
              ~{Math.max(0, getPromotionCycle() - getTimeSinceLastPromotion())}{" "}
              months
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
