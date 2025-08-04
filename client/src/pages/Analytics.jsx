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
import MetricsGrid from "../components/analytics/MetricsGrid";
import CareerGrowthInsights from "../components/analytics/CareerGrowthInsights";

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
      <>
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
      </>
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
      <MetricsGrid
        averageKPI={getAverageKPI()}
        kpiDataLength={kpiData?.length}
        skillGaps={getSkillGaps()}
        behaviorTraits={roadmapData?.analysis?.behavior_traits}
      />

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
      <CareerGrowthInsights
        employeeDetails={employeeDetails}
        timeSinceLastPromotion={getTimeSinceLastPromotion()}
        promotionCycle={getPromotionCycle()}
      />
    </div>
  );
}
