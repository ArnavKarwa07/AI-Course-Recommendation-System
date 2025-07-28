/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getTeamMembersAPI,
  useEmployeeDetailsAPI,
  useCourseCompletionAPI,
  useKPIAPI,
  useProjectsAPI,
  getCoursesAPI,
  getRolesAPI,
} from "../api/apis";
import KPIDashboard from "../components/KPIDashboard";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import LearningStats from "../components/LearningStats";

export default function YourTeam() {
  const { empId } = useAuth();
  const { getEmployeeDetails } = useEmployeeDetailsAPI();
  const { getCourseCompletion } = useCourseCompletionAPI();
  const { getKPI } = useKPIAPI();
  const { getProjects } = useProjectsAPI();

  // State Management
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMembersData, setTeamMembersData] = useState({});
  const [availableCourses, setAvailableCourses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMember, setSelectedMember] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});

  // Initialize data loading
  useEffect(() => {
    const initializeData = async () => {
      if (!empId) return;

      try {
        setLoading(true);

        // Load team members and reference data
        const [teamResponse, coursesResponse, rolesResponse] =
          await Promise.all([
            getTeamMembersAPI(empId),
            getCoursesAPI(),
            getRolesAPI(),
          ]);

        const members = teamResponse.data || [];
        setTeamMembers(members);
        setAvailableCourses(coursesResponse.data || []);
        setRoles(rolesResponse.data || []);

        // Load detailed data for all team members
        await loadAllTeamMemberData(members);
      } catch (err) {
        console.error("Error initializing team data:", err);
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [empId]);

  // Load detailed data for all team members
  const loadAllTeamMemberData = async (members) => {
    const memberDataPromises = members.map(async (member) => {
      setLoadingStates((prev) => ({ ...prev, [member.emp_id]: true }));

      try {
        const [employeeData, kpiData, courseData, projectData] =
          await Promise.all([
            getEmployeeDetails(member.emp_id).catch(() => ({ data: null })),
            getKPI(member.emp_id).catch(() => ({ data: [] })),
            getCourseCompletion(member.emp_id).catch(() => ({
              data: { completedCourses: [] },
            })),
            getProjects(member.emp_id).catch(() => ({ data: [] })),
          ]);

        return {
          emp_id: member.emp_id,
          data: {
            employee: employeeData.data,
            kpi: kpiData.data || [],
            courses: courseData.data?.completedCourses || [],
            projects: projectData.data || [],
            loaded: true,
          },
        };
      } catch (err) {
        console.error(`Error loading data for ${member.name}:`, err);
        return {
          emp_id: member.emp_id,
          data: {
            employee: null,
            kpi: [],
            courses: [],
            projects: [],
            loaded: false,
          },
        };
      } finally {
        setLoadingStates((prev) => ({ ...prev, [member.emp_id]: false }));
      }
    });

    const memberDataResults = await Promise.all(memberDataPromises);
    const memberDataMap = {};
    memberDataResults.forEach(({ emp_id, data }) => {
      memberDataMap[emp_id] = data;
    });

    setTeamMembersData(memberDataMap);
  };

  // Analytics Functions
  const getTeamKPIAnalytics = () => {
    const allKPIs = [];
    const kpiByMetric = {};

    teamMembers.forEach((member) => {
      const memberData = teamMembersData[member.emp_id];
      if (memberData?.kpi) {
        memberData.kpi.forEach((kpi) => {
          allKPIs.push({
            ...kpi,
            member_name: member.name,
            member_id: member.emp_id,
          });

          if (!kpiByMetric[kpi.kpi_metric]) {
            kpiByMetric[kpi.kpi_metric] = [];
          }
          kpiByMetric[kpi.kpi_metric].push(kpi.kpi_score);
        });
      }
    });

    const averageScore =
      allKPIs.length > 0
        ? (
            allKPIs.reduce((sum, kpi) => sum + kpi.kpi_score, 0) /
            allKPIs.length
          ).toFixed(2)
        : 0;

    const metricAverages = Object.entries(kpiByMetric).map(
      ([metric, scores]) => ({
        metric,
        average: (
          scores.reduce((sum, score) => sum + score, 0) / scores.length
        ).toFixed(2),
        count: scores.length,
      })
    );

    return {
      averageScore,
      totalKPIs: allKPIs.length,
      metricAverages,
      allKPIs,
      benchmark: 3.5, // Organizational benchmark
    };
  };

  const getPerformanceDistribution = () => {
    const distribution = { excellent: [], good: [], needsImprovement: [] };

    teamMembers.forEach((member) => {
      const memberData = teamMembersData[member.emp_id];
      if (memberData?.kpi && memberData.kpi.length > 0) {
        const avgKPI =
          memberData.kpi.reduce((sum, kpi) => sum + kpi.kpi_score, 0) /
          memberData.kpi.length;

        const memberInfo = { ...member, avgKPI: avgKPI.toFixed(2) };

        if (avgKPI >= 4.0) distribution.excellent.push(memberInfo);
        else if (avgKPI >= 3.0) distribution.good.push(memberInfo);
        else distribution.needsImprovement.push(memberInfo);
      } else {
        distribution.needsImprovement.push({ ...member, avgKPI: "N/A" });
      }
    });

    return distribution;
  };

  const getSkillAnalytics = () => {
    const skillMap = {};
    const roleSkillRequirements = {};

    // Analyze current skills
    teamMembers.forEach((member) => {
      const memberData = teamMembersData[member.emp_id];
      if (memberData?.employee?.skills) {
        Object.entries(memberData.employee.skills).forEach(([skill, level]) => {
          if (!skillMap[skill]) {
            skillMap[skill] = { total: 0, count: 0, members: [], experts: [] };
          }
          skillMap[skill].total += level;
          skillMap[skill].count += 1;
          skillMap[skill].members.push(member.name);

          if (level >= 4) {
            skillMap[skill].experts.push(member.name);
          }
        });
      }
    });

    const skillDistribution = Object.entries(skillMap)
      .map(([skill, data]) => ({
        skill,
        averageLevel: (data.total / data.count).toFixed(1),
        memberCount: data.count,
        coverage: ((data.count / teamMembers.length) * 100).toFixed(0),
        experts: data.experts,
      }))
      .sort((a, b) => b.averageLevel - a.averageLevel);

    // Identify skill gaps based on roles
    const requiredSkillsSet = new Set();
    roles.forEach((role) => {
      if (role.required_skills) {
        role.required_skills.forEach((skill) => requiredSkillsSet.add(skill));
      }
    });

    const skillGaps = Array.from(requiredSkillsSet).filter(
      (skill) =>
        !skillMap[skill] || skillMap[skill].count < teamMembers.length * 0.3
    );

    return { skillDistribution, skillGaps, expertiseMap: skillMap };
  };

  const getLearningAnalytics = () => {
    const learningStats = {
      totalCourses: 0,
      completedCourses: 0,
      activelearners: 0,
      averageScore: 0,
      coursesByCategory: {},
    };

    let totalScores = 0;
    let scoreCount = 0;

    teamMembers.forEach((member) => {
      const memberData = teamMembersData[member.emp_id];
      if (memberData?.courses) {
        const memberCompletedCourses = memberData.courses.length;
        learningStats.completedCourses += memberCompletedCourses;

        if (memberCompletedCourses > 0) {
          learningStats.activelearners += 1;
        }

        memberData.courses.forEach((course) => {
          if (course.score) {
            totalScores += course.score;
            scoreCount += 1;
          }

          const category = course.category || "General";
          if (!learningStats.coursesByCategory[category]) {
            learningStats.coursesByCategory[category] = 0;
          }
          learningStats.coursesByCategory[category] += 1;
        });
      }
    });

    learningStats.averageScore =
      scoreCount > 0 ? (totalScores / scoreCount).toFixed(1) : 0;
    learningStats.engagementRate =
      teamMembers.length > 0
        ? ((learningStats.activelearners / teamMembers.length) * 100).toFixed(0)
        : 0;

    return learningStats;
  };

  const getCareerAnalytics = () => {
    const careerStats = {
      promotionCandidates: [],
      careerGoals: {},
      successionPlan: {},
    };

    teamMembers.forEach((member) => {
      const memberData = teamMembersData[member.emp_id];
      const employee = memberData?.employee;

      if (employee) {
        // Career goals distribution
        const goal = employee.career_goal || "Not specified";
        careerStats.careerGoals[goal] =
          (careerStats.careerGoals[goal] || 0) + 1;

        // Promotion readiness analysis
        const experienceMonths = employee.experience || 0;
        const role = roles.find((r) => r.role_name === employee.role);
        const avgPromotionTime = role?.avg_promotion_time || 24;

        const timeSinceLastPromotion = employee.last_promotion_date
          ? Math.floor(
              (new Date() - new Date(employee.last_promotion_date)) /
                (1000 * 60 * 60 * 24 * 30)
            )
          : experienceMonths;

        if (timeSinceLastPromotion >= avgPromotionTime * 0.8) {
          const avgKPI =
            memberData.kpi && memberData.kpi.length > 0
              ? memberData.kpi.reduce((sum, kpi) => sum + kpi.kpi_score, 0) /
                memberData.kpi.length
              : 0;

          careerStats.promotionCandidates.push({
            ...member,
            readinessScore: avgKPI.toFixed(1),
            monthsEligible: Math.max(
              0,
              timeSinceLastPromotion - avgPromotionTime
            ),
          });
        }

        // Succession planning
        const targetRole = employee.career_goal || `Senior ${employee.role}`;
        if (!careerStats.successionPlan[targetRole]) {
          careerStats.successionPlan[targetRole] = [];
        }
        careerStats.successionPlan[targetRole].push(member);
      }
    });

    careerStats.promotionCandidates.sort(
      (a, b) => b.readinessScore - a.readinessScore
    );

    return careerStats;
  };

  const getProjectAnalytics = () => {
    const projectStats = {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      resourceUtilization: {},
      skillUtilization: {},
      averagePerformance: 0,
    };

    let performanceSum = 0;
    let performanceCount = 0;

    teamMembers.forEach((member) => {
      const memberData = teamMembersData[member.emp_id];
      if (memberData?.projects) {
        projectStats.totalProjects += memberData.projects.length;

        let memberUtilization = 0;

        memberData.projects.forEach((project) => {
          if (project.status === "active") {
            projectStats.activeProjects += 1;
            memberUtilization += project.allocation_percentage || 100;
          } else if (project.status === "completed") {
            projectStats.completedProjects += 1;
            if (project.performance_score) {
              performanceSum += project.performance_score;
              performanceCount += 1;
            }
          }

          // Track skill utilization
          if (project.required_skills) {
            project.required_skills.forEach((skill) => {
              projectStats.skillUtilization[skill] =
                (projectStats.skillUtilization[skill] || 0) + 1;
            });
          }
        });

        projectStats.resourceUtilization[member.name] = memberUtilization;
      }
    });

    projectStats.averagePerformance =
      performanceCount > 0 ? (performanceSum / performanceCount).toFixed(1) : 0;

    return projectStats;
  };

  // Tab Navigation
  const tabs = [
    { id: "overview", label: "Team Overview" },
    { id: "performance", label: "Performance Analytics" },
    { id: "skills", label: "Skills Analysis" },
    { id: "learning", label: "Learning Progress" },
    { id: "career", label: "Career Development" },
    { id: "projects", label: "Project Intelligence" },
    { id: "members", label: "Team Members" },
  ];

  // Loading and Error States
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>Loading...</div>
        <p style={{ color: "#6b7280" }}>Loading your team dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div
          style={{ fontSize: "2rem", marginBottom: "1rem", color: "#ef4444" }}
        >
          Error
        </div>
        <p style={{ color: "#ef4444" }}>{error}</p>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          No Team Data
        </div>
        <p style={{ color: "#6b7280" }}>
          No team members found for your account.
        </p>
      </div>
    );
  }

  // Analytics Data
  const kpiAnalytics = getTeamKPIAnalytics();
  const performanceDistribution = getPerformanceDistribution();
  const skillAnalytics = getSkillAnalytics();
  const learningAnalytics = getLearningAnalytics();
  const careerAnalytics = getCareerAnalytics();
  const projectAnalytics = getProjectAnalytics();

  return (
    <div style={{ maxWidth: "1400px", margin: "0 0" }}>
      {/* Navigation */}
      <div
        style={{
          background: "white",
          padding: "0.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.75rem 1.25rem",
              border: "none",
              borderRadius: "8px",
              background: activeTab === tab.id ? "#667eea" : "transparent",
              color: activeTab === tab.id ? "white" : "#6b7280",
              fontWeight: activeTab === tab.id ? "600" : "400",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "0.875rem",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div>
          {/* Key Metrics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              className="card-dashboard"
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                KPI
              </div>
              <div className="metric-number" style={{ color: "white" }}>
                {kpiAnalytics.averageScore}
              </div>
              <p
                className="metric-label"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Team Average Score
              </p>
              <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                vs Benchmark: {kpiAnalytics.benchmark}
              </div>
            </div>

            <div
              className="card-dashboard"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                color: "white",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                Team
              </div>
              <div className="metric-number" style={{ color: "white" }}>
                {teamMembers.length}
              </div>
              <p
                className="metric-label"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Total Members
              </p>
              <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Active: {learningAnalytics.activelearners}
              </div>
            </div>

            <div
              className="card-dashboard"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "white",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                Skills
              </div>
              <div className="metric-number" style={{ color: "white" }}>
                {skillAnalytics.skillDistribution.length}
              </div>
              <p
                className="metric-label"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Unique Skills
              </p>
              <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Gaps: {skillAnalytics.skillGaps.length}
              </div>
            </div>

            <div
              className="card-dashboard"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "white",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                Projects
              </div>
              <div className="metric-number" style={{ color: "white" }}>
                {projectAnalytics.activeProjects}
              </div>
              <p
                className="metric-label"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Active Projects
              </p>
              <div style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Performance: {projectAnalytics.averagePerformance}
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div className="card">
              <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
                Performance Summary
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>High Performers (4.0+):</span>
                  <span style={{ fontWeight: "600", color: "#10b981" }}>
                    {performanceDistribution.excellent.length}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Good Performers (3.0-3.9):</span>
                  <span style={{ fontWeight: "600", color: "#f59e0b" }}>
                    {performanceDistribution.good.length}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Need Support (below 3.0):</span>
                  <span style={{ fontWeight: "600", color: "#ef4444" }}>
                    {performanceDistribution.needsImprovement.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
                Learning Engagement
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Active Learners:</span>
                  <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                    {learningAnalytics.activelearners}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Engagement Rate:</span>
                  <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                    {learningAnalytics.engagementRate}%
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Average Score:</span>
                  <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                    {learningAnalytics.averageScore}/5.0
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
                Career Development
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Promotion Ready:</span>
                  <span style={{ fontWeight: "600", color: "#8b5cf6" }}>
                    {careerAnalytics.promotionCandidates.length}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Career Goals Set:</span>
                  <span style={{ fontWeight: "600", color: "#8b5cf6" }}>
                    {Object.keys(careerAnalytics.careerGoals).length -
                      (careerAnalytics.careerGoals["Not specified"] ? 1 : 0)}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Succession Plans:</span>
                  <span style={{ fontWeight: "600", color: "#8b5cf6" }}>
                    {Object.keys(careerAnalytics.successionPlan).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "performance" && (
        <div>
          {/* Team KPI Dashboard */}
          <KPIDashboard kpiData={kpiAnalytics.allKPIs} />

          {/* Performance Distribution */}
          <div className="card" style={{ marginTop: "2rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Performance Distribution
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: "#dcfce7",
                  borderRadius: "8px",
                  padding: "1rem",
                }}
              >
                <h4 style={{ color: "#166534", margin: "0 0 1rem 0" }}>
                  Excellent ({performanceDistribution.excellent.length})
                </h4>
                {performanceDistribution.excellent.map((member, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}
                  >
                    <strong>{member.name}</strong> - {member.avgKPI}
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#fef3c7",
                  borderRadius: "8px",
                  padding: "1rem",
                }}
              >
                <h4 style={{ color: "#92400e", margin: "0 0 1rem 0" }}>
                  Good ({performanceDistribution.good.length})
                </h4>
                {performanceDistribution.good.map((member, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}
                  >
                    <strong>{member.name}</strong> - {member.avgKPI}
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#fecaca",
                  borderRadius: "8px",
                  padding: "1rem",
                }}
              >
                <h4 style={{ color: "#991b1b", margin: "0 0 1rem 0" }}>
                  Needs Support (
                  {performanceDistribution.needsImprovement.length})
                </h4>
                {performanceDistribution.needsImprovement.map(
                  (member, index) => (
                    <div
                      key={index}
                      style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}
                    >
                      <strong>{member.name}</strong> - {member.avgKPI}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Metric-Specific Analysis */}
          <div className="card" style={{ marginTop: "2rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              KPI Breakdown by Metric
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {kpiAnalytics.metricAverages.map((metric, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <span style={{ fontWeight: "500" }}>{metric.metric}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>
                      {metric.average}/5.0
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {metric.count} evaluations
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div>
          {/* Skills Heatmap */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Team Skills Heatmap
            </h3>
            <div
              style={{
                display: "grid",
                gap: "0.75rem",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {skillAnalytics.skillDistribution.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {skill.skill}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {skill.memberCount} members • {skill.coverage}% coverage
                    </div>
                    {skill.experts.length > 0 && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#059669",
                          marginTop: "0.25rem",
                        }}
                      >
                        Experts: {skill.experts.join(", ")}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      background:
                        skill.averageLevel >= 4
                          ? "#dcfce7"
                          : skill.averageLevel >= 3
                          ? "#fef3c7"
                          : "#fecaca",
                      color:
                        skill.averageLevel >= 4
                          ? "#166534"
                          : skill.averageLevel >= 3
                          ? "#92400e"
                          : "#991b1b",
                      borderRadius: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Level {skill.averageLevel}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="card">
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Critical Skill Gaps
            </h3>
            {skillAnalytics.skillGaps.length > 0 ? (
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {skillAnalytics.skillGaps.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "0.75rem",
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      color: "#991b1b",
                    }}
                  >
                    <strong>{skill}</strong> - Low team coverage
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  color: "#059669",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                No critical skill gaps identified
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "learning" && (
        <div>
          {/* Learning Overview */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                Courses
              </div>
              <div className="metric-number">
                {learningAnalytics.completedCourses}
              </div>
              <p className="metric-label">Total Completed</p>
            </div>

            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                Active
              </div>
              <div className="metric-number">
                {learningAnalytics.activelearners}
              </div>
              <p className="metric-label">Learning Members</p>
            </div>

            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                Rate
              </div>
              <div className="metric-number">
                {learningAnalytics.engagementRate}%
              </div>
              <p className="metric-label">Engagement</p>
            </div>

            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                Score
              </div>
              <div className="metric-number">
                {learningAnalytics.averageScore}
              </div>
              <p className="metric-label">Average Performance</p>
            </div>
          </div>

          {/* Course Categories */}
          <div className="card">
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Learning by Category
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {Object.entries(learningAnalytics.coursesByCategory).map(
                ([category, count]) => (
                  <div
                    key={category}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>{category}</span>
                    <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                      {count} courses completed
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "career" && (
        <div>
          {/* Promotion Candidates */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Promotion Readiness
            </h3>
            {careerAnalytics.promotionCandidates.length > 0 ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                {careerAnalytics.promotionCandidates.map((candidate, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "1rem",
                      background: "#fef3c7",
                      border: "1px solid #fde68a",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h4 style={{ margin: 0, color: "#92400e" }}>
                          {candidate.name}
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.875rem",
                            color: "#a16207",
                          }}
                        >
                          Performance Score: {candidate.readinessScore}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "700", color: "#92400e" }}>
                          {candidate.monthsEligible > 0
                            ? `${candidate.monthsEligible} mo overdue`
                            : "On track"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  color: "#6b7280",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                No team members are currently promotion-ready
              </p>
            )}
          </div>

          {/* Career Goals */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Career Goal Distribution
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {Object.entries(careerAnalytics.careerGoals).map(
                ([goal, count]) => (
                  <div
                    key={goal}
                    style={{
                      textAlign: "center",
                      padding: "1rem",
                      background: "#f0f9ff",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#0369a1",
                      }}
                    >
                      {count}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "#0c4a6e",
                        fontSize: "0.875rem",
                      }}
                    >
                      {goal}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Succession Planning */}
          <div className="card">
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Succession Planning
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {Object.entries(careerAnalytics.successionPlan).map(
                ([role, candidates]) => (
                  <div
                    key={role}
                    style={{
                      padding: "1rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#374151" }}>
                      {role}
                    </h4>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      Candidates: {candidates.map((c) => c.name).join(", ")}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div>
          {/* Project Overview */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                Active
              </div>
              <div className="metric-number">
                {projectAnalytics.activeProjects}
              </div>
              <p className="metric-label">Projects</p>
            </div>

            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                Completed
              </div>
              <div className="metric-number">
                {projectAnalytics.completedProjects}
              </div>
              <p className="metric-label">Projects</p>
            </div>

            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                Performance
              </div>
              <div className="metric-number">
                {projectAnalytics.averagePerformance}
              </div>
              <p className="metric-label">Average Score</p>
            </div>
          </div>

          {/* Resource Utilization */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Resource Allocation
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {Object.entries(projectAnalytics.resourceUtilization).map(
                ([member, utilization]) => (
                  <div
                    key={member}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>{member}</span>
                    <div
                      style={{
                        padding: "0.25rem 0.75rem",
                        background:
                          utilization > 100
                            ? "#fecaca"
                            : utilization > 80
                            ? "#fef3c7"
                            : "#dcfce7",
                        color:
                          utilization > 100
                            ? "#991b1b"
                            : utilization > 80
                            ? "#92400e"
                            : "#166534",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                      }}
                    >
                      {utilization}% allocated
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Skill Utilization */}
          <div className="card">
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Skill Utilization in Projects
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {Object.entries(projectAnalytics.skillUtilization).map(
                ([skill, count]) => (
                  <div
                    key={skill}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ fontWeight: "500" }}>{skill}</span>
                    <span style={{ color: "#6b7280" }}>
                      Used in {count} project{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div>
          <div className="card">
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Individual Team Member Analysis
            </h3>

            <div style={{ display: "grid", gap: "1rem" }}>
              {teamMembers.map((member) => {
                const memberData = teamMembersData[member.emp_id];
                const isLoading = loadingStates[member.emp_id];
                const isExpanded = selectedMember === member.emp_id;

                // Calculate member metrics
                const avgKPI =
                  memberData?.kpi && memberData.kpi.length > 0
                    ? (
                        memberData.kpi.reduce(
                          (sum, kpi) => sum + kpi.kpi_score,
                          0
                        ) / memberData.kpi.length
                      ).toFixed(1)
                    : "N/A";

                return (
                  <div key={member.emp_id}>
                    {/* Member Header */}
                    <div
                      style={{
                        padding: "1rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        background: "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() =>
                        setSelectedMember(isExpanded ? null : member.emp_id)
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #667eea, #764ba2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                            }}
                          >
                            {member.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </div>
                          <div>
                            <h4
                              style={{
                                margin: 0,
                                fontWeight: "600",
                                color: "#1f2937",
                              }}
                            >
                              {member.name}
                            </h4>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.875rem",
                                color: "#6b7280",
                              }}
                            >
                              {member.role} • {member.dept}
                            </p>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <div
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color:
                                  avgKPI >= 4
                                    ? "#10b981"
                                    : avgKPI >= 3
                                    ? "#f59e0b"
                                    : "#ef4444",
                              }}
                            >
                              {avgKPI}
                            </div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "0.75rem",
                                color: "#6b7280",
                              }}
                            >
                              Avg KPI
                            </p>
                          </div>

                          <div
                            style={{
                              padding: "0.5rem",
                              borderRadius: "50%",
                              background: isExpanded ? "#667eea" : "#e5e7eb",
                              color: isExpanded ? "white" : "#6b7280",
                            }}
                          >
                            {isExpanded ? "−" : "+"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "1.5rem",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                        }}
                      >
                        {isLoading ? (
                          <div
                            style={{
                              textAlign: "center",
                              padding: "2rem",
                              color: "#6b7280",
                            }}
                          >
                            Loading member details...
                          </div>
                        ) : memberData?.loaded ? (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "2rem",
                            }}
                          >
                            <div>
                              <Skills employeeData={memberData.employee} />
                              <Projects projectsData={memberData.projects} />
                            </div>
                            <div>
                              <LearningStats
                                completedCourses={memberData.courses}
                              />
                              {memberData.kpi && memberData.kpi.length > 0 && (
                                <div style={{ marginTop: "1rem" }}>
                                  <KPIDashboard kpiData={memberData.kpi} />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{ textAlign: "center", color: "#ef4444" }}
                          >
                            Error loading member data
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
