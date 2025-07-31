/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getTeamMembersAPI,
  getBulkEmployeeDataAPI,
  getCoursesAPI,
  getRolesAPI,
} from "../api/apis";
import KPIDashboard from "../components/KPIDashboard";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import LearningStats from "../components/LearningStats";

export default function YourTeam() {
  const { empId } = useAuth();

  // State Management
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMembersData, setTeamMembersData] = useState({});
  const [availableCourses, setAvailableCourses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMember, setSelectedMember] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Initialize data loading
  useEffect(() => {
    const initializeData = async () => {
      if (!empId) return;

      try {
        setLoading(true);
        setError(null);

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

        // If we have team members, load their bulk data
        if (members.length > 0) {
          await loadBulkTeamMemberData(members);
        }
      } catch (err) {
        console.error("Error initializing team data:", err);
        setError("Failed to load team data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [empId]);

  // Load bulk data for all team members efficiently
  const loadBulkTeamMemberData = async (members) => {
    try {
      const empIds = members.map((member) => member.emp_id);
      const bulkDataResponse = await getBulkEmployeeDataAPI(empIds);

      if (bulkDataResponse.data) {
        // Transform the bulk data to match the expected format
        const transformedData = {};

        Object.entries(bulkDataResponse.data).forEach(([empId, data]) => {
          transformedData[empId] = {
            employee: data.employee,
            kpi: data.kpi || [],
            courses: data.courses || [],
            projects: data.projects || [],
            ongoing_courses: data.ongoing_courses || [],
            loaded: true,
          };
        });

        setTeamMembersData(transformedData);
      }
    } catch (err) {
      console.error("Error loading bulk team member data:", err);
      // Create empty data structure for failed loads
      const emptyData = {};
      members.forEach((member) => {
        emptyData[member.emp_id] = {
          employee: null,
          kpi: [],
          courses: [],
          projects: [],
          ongoing_courses: [],
          loaded: false,
        };
      });
      setTeamMembersData(emptyData);
    }
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

    // Analyze current skills
    teamMembers.forEach((member) => {
      const memberData = teamMembersData[member.emp_id];
      if (memberData?.employee?.skills) {
        Object.entries(memberData.employee.skills).forEach(([skill, level]) => {
          if (!skillMap[skill]) {
            skillMap[skill] = {
              total: 0,
              count: 0,
              members: [],
              experts: [],
              levels: [],
            };
          }
          skillMap[skill].total += level;
          skillMap[skill].count += 1;
          skillMap[skill].members.push({ name: member.name, level });
          skillMap[skill].levels.push(level);

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
        members: data.members,
        levels: data.levels,
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

          const category =
            course.category || course.course_category || "General";
          if (!learningStats.coursesByCategory[category]) {
            learningStats.coursesByCategory[category] = [];
          }
          learningStats.coursesByCategory[category].push({
            courseName: course.course_name,
            memberName: member.name,
            score: course.score,
            completionDate: course.end_date,
          });
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

  // Create Skills Heatmap Data
  const createSkillsHeatmapData = () => {
    const skillAnalytics = getSkillAnalytics();
    const maxMembers = teamMembers.length;

    return skillAnalytics.skillDistribution.map((skill) => ({
      skill: skill.skill,
      coverage: parseInt(skill.coverage),
      averageLevel: parseFloat(skill.averageLevel),
      memberCount: skill.memberCount,
      size: (skill.memberCount / maxMembers) * 100, // For bubble size
      color:
        skill.averageLevel >= 4
          ? "#10b981"
          : skill.averageLevel >= 3
          ? "#f59e0b"
          : "#ef4444",
    }));
  };

  // Enhanced Performance Analytics
  const getEnhancedPerformanceAnalytics = () => {
    const memberPerformance = teamMembers
      .map((member) => {
        const memberData = teamMembersData[member.emp_id];
        if (memberData?.kpi && memberData.kpi.length > 0) {
          const kpiScores = memberData.kpi.map((kpi) => kpi.kpi_score);
          const avgKPI =
            kpiScores.reduce((sum, score) => sum + score, 0) / kpiScores.length;
          const kpiByMetric = {};

          memberData.kpi.forEach((kpi) => {
            kpiByMetric[kpi.kpi_metric] = kpi.kpi_score;
          });

          return {
            name: member.name,
            avgKPI: parseFloat(avgKPI.toFixed(2)),
            kpiMetrics: kpiByMetric,
            empId: member.emp_id,
          };
        }
        return null;
      })
      .filter(Boolean);

    // Group by performance ranges for better visualization
    const performanceRanges = {
      "4.5-5.0": memberPerformance.filter((m) => m.avgKPI >= 4.5),
      "4.0-4.4": memberPerformance.filter(
        (m) => m.avgKPI >= 4.0 && m.avgKPI < 4.5
      ),
      "3.5-3.9": memberPerformance.filter(
        (m) => m.avgKPI >= 3.5 && m.avgKPI < 4.0
      ),
      "3.0-3.4": memberPerformance.filter(
        (m) => m.avgKPI >= 3.0 && m.avgKPI < 3.5
      ),
      "2.5-2.9": memberPerformance.filter(
        (m) => m.avgKPI >= 2.5 && m.avgKPI < 3.0
      ),
      "Below 2.5": memberPerformance.filter((m) => m.avgKPI < 2.5),
    };

    return { memberPerformance, performanceRanges };
  };

  // Tab Navigation (removed career and projects)
  const tabs = [
    { id: "overview", label: "Team Overview" },
    { id: "performance", label: "Performance Analytics" },
    { id: "skills", label: "Skills Analysis" },
    { id: "learning", label: "Learning Progress" },
    { id: "members", label: "Team Members" },
  ];

  // Loading and Error States
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🔄 Loading...
        </div>
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
          ⚠️ Error
        </div>
        <p style={{ color: "#ef4444" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          👥 No Team Data
        </div>
        <p style={{ color: "#6b7280" }}>
          No team members found for your account. You may not have any direct
          reports or the data hasn't been synced yet.
        </p>
      </div>
    );
  }

  // Analytics Data
  const kpiAnalytics = getTeamKPIAnalytics();
  const performanceDistribution = getPerformanceDistribution();
  const skillAnalytics = getSkillAnalytics();
  const learningAnalytics = getLearningAnalytics();
  const skillsHeatmapData = createSkillsHeatmapData();
  const enhancedPerformance = getEnhancedPerformanceAnalytics();

  return (
    <div style={{ margin: "0 0" }}>
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
          justifyContent: "space-around",
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
          {/* Key Metrics Grid - Removed Career Development */}
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
                📊 KPI
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
                👥 Team
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
                Active Learners: {learningAnalytics.activelearners}
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
                🎯 Skills
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
          </div>

          {/* Quick Insights - Removed Career Development */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
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
          </div>
        </div>
      )}

      {activeTab === "performance" && (
        <div>
          {/* Enhanced Performance Distribution */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Performance Distribution by Ranges
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {Object.entries(enhancedPerformance.performanceRanges).map(
                ([range, members]) => (
                  <div
                    key={range}
                    style={{
                      padding: "1rem",
                      background:
                        range.includes("4.5") || range.includes("5.0")
                          ? "#dcfce7"
                          : range.includes("4.0")
                          ? "#fef3c7"
                          : range.includes("3.5")
                          ? "#fef9e7"
                          : range.includes("3.0")
                          ? "#fef2e2"
                          : range.includes("2.5")
                          ? "#fecaca"
                          : "#fee2e2",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 1rem 0",
                        color:
                          range.includes("4.5") || range.includes("5.0")
                            ? "#166534"
                            : range.includes("4.0")
                            ? "#92400e"
                            : range.includes("3.5")
                            ? "#a16207"
                            : range.includes("3.0")
                            ? "#c2410c"
                            : range.includes("2.5")
                            ? "#991b1b"
                            : "#7f1d1d",
                      }}
                    >
                      📊 {range} ({members.length})
                    </h4>
                    {members.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem",
                        }}
                      >
                        {members.map((member, index) => (
                          <div
                            key={index}
                            style={{
                              fontSize: "0.875rem",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>
                              <strong>{member.name}</strong>
                            </span>
                            <span>{member.avgKPI}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        style={{
                          color: "#6b7280",
                          fontSize: "0.875rem",
                          margin: 0,
                        }}
                      >
                        No members in this range
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Individual Performance Metrics */}
          <div className="card">
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Individual Performance Overview
            </h3>
            <div
              style={{
                display: "grid",
                gap: "0.75rem",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {enhancedPerformance.memberPerformance.map((member, index) => (
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
                      {member.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Metrics: {Object.keys(member.kpiMetrics).length} evaluated
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "0.5rem 1rem",
                      background:
                        member.avgKPI >= 4.0
                          ? "#dcfce7"
                          : member.avgKPI >= 3.0
                          ? "#fef3c7"
                          : "#fecaca",
                      color:
                        member.avgKPI >= 4.0
                          ? "#166534"
                          : member.avgKPI >= 3.0
                          ? "#92400e"
                          : "#991b1b",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                    }}
                  >
                    {member.avgKPI}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div>
          {/* Skills Bubble Chart/Heatmap */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Team Skills Heatmap
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "1rem",
                padding: "1rem",
                background: "#f8fafc",
                borderRadius: "8px",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {skillsHeatmapData.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    borderRadius: "50%",
                    background: skill.color,
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    textAlign: "center",
                    width: `${Math.max(60, skill.size)}px`,
                    height: `${Math.max(60, skill.size)}px`,
                    position: "relative",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    margin: "0 auto",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                  }}
                  title={`${skill.skill}: ${skill.memberCount}/${teamMembers.length} members (${skill.coverage}% coverage), Avg Level: ${skill.averageLevel}`}
                >
                  <div style={{ fontSize: "0.7rem" }}>{skill.skill}</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                    {skill.averageLevel}
                  </div>
                  <div style={{ fontSize: "0.6rem" }}>{skill.coverage}%</div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#10b981",
                  }}
                ></div>
                <span style={{ fontSize: "0.875rem" }}>
                  Expert Level (4.0+)
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#f59e0b",
                  }}
                ></div>
                <span style={{ fontSize: "0.875rem" }}>
                  Intermediate (3.0-3.9)
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                ></div>
                <span style={{ fontSize: "0.875rem" }}>
                  Beginner (Below 3.0)
                </span>
              </div>
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
                ✅ No critical skill gaps identified
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
                📚 Courses
              </div>
              <div className="metric-number">
                {learningAnalytics.completedCourses}
              </div>
              <p className="metric-label">Total Completed</p>
            </div>

            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                👨‍🎓 Active
              </div>
              <div className="metric-number">
                {learningAnalytics.activelearners}
              </div>
              <p className="metric-label">Learning Members</p>
            </div>

            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                📊 Rate
              </div>
              <div className="metric-number">
                {learningAnalytics.engagementRate}%
              </div>
              <p className="metric-label">Engagement</p>
            </div>

            <div className="card-dashboard">
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                ⭐ Score
              </div>
              <div className="metric-number">
                {learningAnalytics.averageScore}
              </div>
              <p className="metric-label">Average Performance</p>
            </div>
          </div>

          {/* Expandable Course Categories */}
          <div className="card">
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
              Learning by Category
            </h3>
            {Object.keys(learningAnalytics.coursesByCategory).length > 0 ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                {Object.entries(learningAnalytics.coursesByCategory).map(
                  ([category, courses]) => (
                    <div
                      key={category}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "1rem",
                          background: "#f8fafc",
                          cursor: "pointer",
                          borderBottom: expandedCategories[category]
                            ? "1px solid #e5e7eb"
                            : "none",
                        }}
                        onClick={() =>
                          setExpandedCategories((prev) => ({
                            ...prev,
                            [category]: !prev[category],
                          }))
                        }
                      >
                        <div>
                          <span style={{ fontWeight: "600" }}>{category}</span>
                          <span
                            style={{ marginLeft: "0.5rem", color: "#6b7280" }}
                          >
                            ({courses.length} courses)
                          </span>
                        </div>
                        <div
                          style={{
                            padding: "0.25rem 0.5rem",
                            background: "#3b82f6",
                            color: "white",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                          }}
                        >
                          {expandedCategories[category] ? "−" : "+"}
                        </div>
                      </div>

                      {expandedCategories[category] && (
                        <div style={{ padding: "1rem", background: "white" }}>
                          <div style={{ display: "grid", gap: "0.5rem" }}>
                            {courses.map((course, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "0.75rem",
                                  background: "#f9fafb",
                                  borderRadius: "6px",
                                  border: "1px solid #f3f4f6",
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontWeight: "500",
                                      color: "#374151",
                                    }}
                                  >
                                    {course.courseName}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "0.875rem",
                                      color: "#6b7280",
                                    }}
                                  >
                                    Completed by: {course.memberName}
                                  </div>
                                  {course.completionDate && (
                                    <div
                                      style={{
                                        fontSize: "0.75rem",
                                        color: "#9ca3af",
                                      }}
                                    >
                                      Completed:{" "}
                                      {new Date(
                                        course.completionDate
                                      ).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                                {course.score && (
                                  <div
                                    style={{
                                      padding: "0.25rem 0.75rem",
                                      background:
                                        course.score >= 4
                                          ? "#dcfce7"
                                          : course.score >= 3
                                          ? "#fef3c7"
                                          : "#fecaca",
                                      color:
                                        course.score >= 4
                                          ? "#166534"
                                          : course.score >= 3
                                          ? "#92400e"
                                          : "#991b1b",
                                      borderRadius: "12px",
                                      fontSize: "0.875rem",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {course.score}/5
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p style={{ color: "#6b7280" }}>
                  No course completion data available.
                </p>
              </div>
            )}
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
                                  avgKPI !== "N/A"
                                    ? avgKPI >= 4
                                      ? "#10b981"
                                      : avgKPI >= 3
                                      ? "#f59e0b"
                                      : "#ef4444"
                                    : "#6b7280",
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

                    {/* Expanded Details - Moved Learning Stats to left, Projects to right */}
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
                        {memberData?.loaded ? (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "2rem",
                            }}
                          >
                            <div>
                              <LearningStats
                                completedCourses={memberData.courses}
                              />
                              <div style={{ marginTop: "1rem" }}>
                                <Skills employeeData={memberData.employee} />
                              </div>
                            </div>
                            <div>
                              <Projects projectsData={memberData.projects} />
                              {memberData.kpi && memberData.kpi.length > 0 && (
                                <div style={{ marginTop: "1rem" }}>
                                  <KPIDashboard kpiData={memberData.kpi} />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              textAlign: "center",
                              color: "#ef4444",
                              padding: "2rem",
                            }}
                          >
                            ⚠️ Error loading member data
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
