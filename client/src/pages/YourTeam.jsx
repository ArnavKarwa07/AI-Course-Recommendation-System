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

// Import tab components
import TeamOverview from "../components/YourTeam/TeamOverview";
import TeamPerformance from "../components/YourTeam/TeamPerformance";
import TeamSkills from "../components/YourTeam/TeamSkills";
import TeamMembers from "../components/yourteam/TeamMembers";
import ProjectReadiness from "../components/YourTeam/ProjectReadiness";
import "../styles/YourTeam.css";

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
  const [userProjects, setUserProjects] = useState([]); // Add this line

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
            recommendations: data.recommendations || null,
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
          recommendations: null,
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

  // Enhanced Skills Analytics with individual gaps from recommendations
  const getSkillAnalytics = () => {
    const skillMap = {};
    const individualSkillGaps = {};

    // Analyze current skills
    teamMembers.forEach((member) => {
      const memberData = teamMembersData[member.emp_id];
      const memberSkills = memberData?.employee?.skills || {};

      // Initialize individual gaps for this member
      individualSkillGaps[member.emp_id] = {
        name: member.name,
        gaps: [],
        role: member.role,
        skillsAfterCompletion: null,
      };

      // Get skill gaps from recommendations data - ENHANCED
      const recommendations = memberData?.recommendations;
      if (recommendations) {
        // Check both roadmap and courses recommendations
        const roadmapRec = recommendations?.roadmap;
        const coursesRec = recommendations?.courses;

        // Get skill gaps from either roadmap or courses recommendation
        const analysisData = roadmapRec?.analysis || coursesRec?.analysis;

        if (analysisData?.skill_gaps) {
          const skillGaps = analysisData.skill_gaps;

          // Transform skill gaps data
          if (Array.isArray(skillGaps)) {
            skillGaps.forEach((gap) => {
              // Handle both string and object formats
              if (typeof gap === "string") {
                individualSkillGaps[member.emp_id].gaps.push({
                  skill: gap,
                  currentLevel: memberSkills[gap] || 0,
                  requiredLevel: 3,
                  gap: 3 - (memberSkills[gap] || 0),
                  priority: "medium",
                });
              } else {
                individualSkillGaps[member.emp_id].gaps.push({
                  skill: gap.skill || gap.name || gap,
                  currentLevel:
                    gap.current_level ||
                    gap.currentLevel ||
                    memberSkills[gap.skill] ||
                    0,
                  requiredLevel: gap.required_level || gap.requiredLevel || 3,
                  gap:
                    gap.gap ||
                    (gap.required_level || 3) -
                      (gap.current_level || memberSkills[gap.skill] || 0),
                  priority: gap.priority || "medium",
                });
              }
            });
          }
        }

        // Alternative: Check if skill_gaps is directly in recommendations
        if (!analysisData?.skill_gaps && recommendations.skill_gaps) {
          recommendations.skill_gaps.forEach((gap) => {
            if (typeof gap === "string") {
              individualSkillGaps[member.emp_id].gaps.push({
                skill: gap,
                currentLevel: memberSkills[gap] || 0,
                requiredLevel: 3,
                gap: 3 - (memberSkills[gap] || 0),
                priority: "medium",
              });
            }
          });
        }

        // Get skills after completion from roadmap
        if (roadmapRec?.output?.skills_after_completion) {
          individualSkillGaps[member.emp_id].skillsAfterCompletion =
            roadmapRec.output.skills_after_completion;
        }
      }

      // Process existing skills for team analytics
      Object.entries(memberSkills).forEach(([skill, level]) => {
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
        skillMap[skill].members.push({
          name: member.name,
          level,
          empId: member.emp_id,
        });
        skillMap[skill].levels.push(level);

        if (level >= 4) {
          skillMap[skill].experts.push(member.name);
        }
      });
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

    const finalSkillGaps = Object.values(individualSkillGaps).filter(
      (member) => member.gaps.length > 0
    );

    return {
      skillDistribution,
      expertiseMap: skillMap,
      individualSkillGaps: finalSkillGaps,
    };
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

  // Add function to get user's managed projects
  const getUserManagedProjects = () => {
    const managedProjects = [];

    // Collect all unique projects from team members where user is manager
    teamMembers.forEach((member) => {
      const memberData = teamMembersData[member.emp_id];
      if (memberData?.projects) {
        memberData.projects.forEach((project) => {
          // Check if this project isn't already in our list and if user is the manager
          if (
            !managedProjects.find((p) => p.project_id === project.project_id) &&
            (project.manager_id === empId || project.project_manager === empId)
          ) {
            managedProjects.push(project);
          }
        });
      }
    });

    return managedProjects;
  };

  // Add useEffect to update user projects when team data is loaded
  useEffect(() => {
    if (Object.keys(teamMembersData).length > 0) {
      const projects = getUserManagedProjects();
      setUserProjects(projects);
    }
  }, [teamMembersData, empId]);

  // Loading and Error States
  if (loading) {
    return (
      <div className="your-team-loading">
        <div className="your-team-loading-icon">🔄</div>
        <p className="your-team-loading-text">Loading your team dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="your-team-error">
        <div className="your-team-error-icon">⚠️</div>
        <p className="your-team-error-text">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="your-team-retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="your-team-no-data">
        <div className="your-team-no-data-icon">👥</div>
        <p className="your-team-no-data-text">
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

  // Update Tab Navigation
  const tabs = [
    { id: "overview", label: "Team Overview" },
    { id: "performance", label: "Performance Analytics" },
    { id: "skills", label: "Skills Analysis" },
    { id: "projects", label: "Project Readiness" },
    { id: "members", label: "Team Members" },
  ];

  return (
    <div className="your-team-container">
      {/* Navigation */}
      <div className="your-team-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`your-team-tab-button ${
              activeTab === tab.id ? "active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <TeamOverview
          teamMembers={teamMembers}
          kpiAnalytics={kpiAnalytics}
          performanceDistribution={performanceDistribution}
          skillAnalytics={skillAnalytics}
          learningAnalytics={learningAnalytics}
        />
      )}

      {activeTab === "performance" && (
        <TeamPerformance
          enhancedPerformance={enhancedPerformance}
          teamMembersData={teamMembersData}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
        />
      )}

      {activeTab === "skills" && (
        <TeamSkills
          skillAnalytics={skillAnalytics}
          skillsHeatmapData={skillsHeatmapData}
          teamMembers={teamMembers}
        />
      )}

      {activeTab === "members" && (
        <TeamMembers
          teamMembers={teamMembers}
          teamMembersData={teamMembersData}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
        />
      )}

      {activeTab === "projects" && (
        <ProjectReadiness
          teamMembers={teamMembers}
          teamMembersData={teamMembersData}
          userProjects={userProjects}
        />
      )}
    </div>
  );
}
