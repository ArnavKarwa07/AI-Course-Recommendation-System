/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getManagerProjectsAPI,
  getProjectAssignmentsAPI,
  getProjectSkillRequirementsAPI,
} from "../../api/apis";
import ProjectCard from "./ProjectReadiness/ProjectCard";

export default function ProjectReadiness() {
  const { empId } = useAuth();
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  // Helper function to normalize skill names for comparison
  const normalizeSkillName = (skillName) => {
    return skillName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "");
  };

  // Helper function to process member skills - handles JSON object format
  const processMemberSkills = (memberSkills) => {
    const skillsMap = {};

    // Handle different skill data formats
    if (!memberSkills) {
      return skillsMap;
    }

    // If it's already an object (JSON from database)
    if (typeof memberSkills === "object" && !Array.isArray(memberSkills)) {
      Object.entries(memberSkills).forEach(([skillName, proficiency]) => {
        if (skillName && skillName.trim()) {
          const normalized = normalizeSkillName(skillName);
          if (normalized) {
            skillsMap[normalized] = {
              originalName: skillName.trim(),
              proficiency: parseInt(proficiency) || 0,
            };
          }
        }
      });
      return skillsMap;
    }

    // Handle array format
    let skillsArray = [];
    if (Array.isArray(memberSkills)) {
      skillsArray = memberSkills;
    } else if (typeof memberSkills === "string" && memberSkills.trim()) {
      // Handle comma-separated string format like "JavaScript(4), Python(3)"
      skillsArray = memberSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    skillsArray.forEach((skill) => {
      if (typeof skill === "string") {
        // Parse skills like "JavaScript(4)" or "JavaScript 4"
        const match = skill.match(/^(.+?)[\s(]*(\d+)[\s)]*$/);
        if (match) {
          const skillName = match[1].trim();
          const proficiency = parseInt(match[2]) || 0;
          const normalized = normalizeSkillName(skillName);
          if (normalized) {
            skillsMap[normalized] = {
              originalName: skillName,
              proficiency: proficiency,
            };
          }
        } else {
          // No proficiency specified, use default
          const normalized = normalizeSkillName(skill);
          if (normalized) {
            skillsMap[normalized] = {
              originalName: skill.trim(),
              proficiency: 3, // default proficiency
            };
          }
        }
      }
    });

    return skillsMap;
  };

  useEffect(() => {
    const fetchProjectsAndAssignments = async () => {
      setLoading(true);
      setError(null);

      try {
        const projectsRes = await getManagerProjectsAPI(empId);

        const projects = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : [];

        const projectsWithDetails = await Promise.all(
          projects.map(async (project) => {
            try {
              // Get project assignments
              const assignmentsRes = await getProjectAssignmentsAPI(
                project.project_id
              );

              const assignedMembers = Array.isArray(assignmentsRes.data)
                ? assignmentsRes.data
                : [];

              // Get required skills
              let requiredSkills = [];
              try {
                const skillsRes = await getProjectSkillRequirementsAPI(
                  project.project_id
                );

                if (Array.isArray(skillsRes.data)) {
                  requiredSkills = skillsRes.data
                    .map((skill) => {
                      if (typeof skill === "object" && skill.skill_name) {
                        return {
                          name: skill.skill_name,
                          required_level:
                            skill.proficiency_level ||
                            skill.required_level ||
                            1,
                        };
                      } else if (typeof skill === "string") {
                        return { name: skill.trim(), required_level: 1 };
                      }
                      return null;
                    })
                    .filter((skill) => skill && skill.name);
                } else if (
                  skillsRes.data &&
                  typeof skillsRes.data === "object"
                ) {
                  // Handle when skills come as an object like {"JavaScript": 4, "Python": 3}
                  requiredSkills = Object.entries(skillsRes.data).map(
                    ([skillName, level]) => ({
                      name: skillName,
                      required_level: parseInt(level) || 1,
                    })
                  );
                }
              } catch (err) {
                console.warn(
                  "Skills API failed for project",
                  project.project_id,
                  err
                );
              }

              // CREATE TOTAL AVAILABLE SKILLS OBJECT FROM ALL TEAM MEMBERS
              const allAvailableSkills = {};

              assignedMembers.forEach((member) => {
                const memberSkills = processMemberSkills(member.skills);

                // Add each member's skills to the total available skills
                Object.keys(memberSkills).forEach((normalizedSkill) => {
                  const skillData = memberSkills[normalizedSkill];

                  if (!allAvailableSkills[normalizedSkill]) {
                    allAvailableSkills[normalizedSkill] = {
                      originalName: skillData.originalName,
                      maxProficiency: 0,
                      members: [],
                    };
                  }

                  // Add this member to the skill
                  allAvailableSkills[normalizedSkill].members.push({
                    name: member.name,
                    proficiency: skillData.proficiency,
                  });

                  // Update max proficiency if this member has higher skill level
                  if (
                    skillData.proficiency >
                    allAvailableSkills[normalizedSkill].maxProficiency
                  ) {
                    allAvailableSkills[normalizedSkill].maxProficiency =
                      skillData.proficiency;
                  }
                });
              });

              // ANALYZE SKILL COVERAGE WITH PARTIAL COMPLETION
              const skillsAnalysis = requiredSkills.map((reqSkill) => {
                const normalizedReqSkill = normalizeSkillName(reqSkill.name);
                // Check if this skill is available in the team
                const availableSkill = allAvailableSkills[normalizedReqSkill];

                if (availableSkill) {
                  // Calculate coverage percentage with partial completion
                  const coveragePercentage = Math.min(
                    100,
                    Math.round(
                      (availableSkill.maxProficiency /
                        reqSkill.required_level) *
                        100
                    )
                  );

                  const isCovered =
                    availableSkill.maxProficiency >= reqSkill.required_level;
                  const proficiencyGap = Math.max(
                    0,
                    reqSkill.required_level - availableSkill.maxProficiency
                  );

                  return {
                    name: reqSkill.name,
                    required_level: reqSkill.required_level,
                    available: availableSkill,
                    maxAvailableProficiency: availableSkill.maxProficiency,
                    isCovered,
                    proficiencyGap,
                    coveragePercentage,
                  };
                } else {
                  // Skill not available at all
                  return {
                    name: reqSkill.name,
                    required_level: reqSkill.required_level,
                    available: null,
                    maxAvailableProficiency: 0,
                    isCovered: false,
                    proficiencyGap: reqSkill.required_level,
                    coveragePercentage: 0,
                  };
                }
              });

              // Calculate overall project readiness
              const overallReadiness =
                requiredSkills.length > 0
                  ? Math.round(
                      skillsAnalysis.reduce(
                        (sum, skill) => sum + skill.coveragePercentage,
                        0
                      ) / skillsAnalysis.length
                    )
                  : 100; // 100% if no skills required

              const skillsCoveredCount = skillsAnalysis.filter(
                (skill) => skill.isCovered
              ).length;

              return {
                ...project,
                assignedMembers,
                requiredSkills,
                allAvailableSkills,
                skillsAnalysis,
                skillsCovered: skillsCoveredCount,
                readiness: overallReadiness,
              };
            } catch (err) {
              console.error(
                "Failed to load details for project",
                project.project_id,
                err
              );
              return null;
            }
          })
        );

        setUserProjects(projectsWithDetails.filter(Boolean));
      } catch (err) {
        setError("Failed to load project data");
        console.error("Project readiness fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (empId) fetchProjectsAndAssignments();
  }, [empId]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🔄 Loading...
        </div>
        <p style={{ color: "#6b7280" }}>Analyzing project readiness...</p>
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
      </div>
    );
  }

  if (userProjects.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
        <h3 style={{ color: "#6b7280", margin: "0 0 1rem 0" }}>
          No Projects Found
        </h3>
        <p style={{ color: "#9ca3af", margin: 0 }}>
          You are not currently managing any projects, or your team members
          haven't been assigned to projects yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {userProjects.map((project) => (
        <ProjectCard
          key={project.project_id}
          project={project}
          isExpanded={expandedProject === project.project_id}
          onToggleExpand={() =>
            setExpandedProject(
              expandedProject === project.project_id ? null : project.project_id
            )
          }
          processMemberSkills={processMemberSkills}
        />
      ))}
    </div>
  );
}
