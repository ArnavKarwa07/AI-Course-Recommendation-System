/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  useEmployeeDetailsAPI,
  useCourseCompletionAPI,
  useKPIAPI,
  useProjectsAPI,
  getSkillsAfterCompletionAPI,
} from "../api/apis";
import ProfileHeader from "../components/Profile/ProfileHeader";
import Skills from "../components/Shared/Skills";
import Projects from "../components/Shared/Projects";
import PersonalInformation from "../components/Profile/PersonalInformation";
import LearningProfile from "../components/Profile/LearningProfile";
import KPIs from "../components/Profile/KPIs";
import CompletedCourses from "../components/Profile/CompletedCourses";

export default function Profile() {
  const { empId } = useAuth();
  const { getEmployeeDetails } = useEmployeeDetailsAPI();
  const { getCourseCompletion } = useCourseCompletionAPI();
  const { getKPI } = useKPIAPI();
  const { getProjects } = useProjectsAPI();
  const [skillsAfterCompletion, setSkillsAfterCompletion] = useState({});
  const [employeeData, setEmployeeData] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!empId) return;
      try {
        setLoading(true);
        const [
          employeeResponse,
          coursesResponse,
          kpiResponse,
          projectsResponse,
          skillsAfterCompletionResponse,
        ] = await Promise.all([
          getEmployeeDetails(),
          getCourseCompletion(),
          getKPI(),
          getProjects(),
          getSkillsAfterCompletionAPI(empId),
        ]);

        // console.log("Employee details response:", employeeResponse);
        // console.log("Completed courses response:", coursesResponse);
        // console.log("KPI response:", kpiResponse);
        // console.log("Projects response:", projectsResponse);
        // console.log(
        //   "Skills after completion response:",
        //   skillsAfterCompletionResponse
        // );

        setEmployeeData(employeeResponse?.data || employeeResponse);
        setCompletedCourses(
          coursesResponse?.data?.completedCourses || coursesResponse?.data || []
        );
        setKpiData(kpiResponse?.data || []);
        setProjectsData(projectsResponse?.data || []);
        setSkillsAfterCompletion(skillsAfterCompletionResponse?.skills_after_completion || {});
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [empId]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Unable to load employee data</p>
      </div>
    );
  }

  // Set the skills after completion data to be the combination of current skills and skills after completion
  const combinedSkills = {
    ...employeeData.skills,
  };

    Object.entries(skillsAfterCompletion).forEach(([skill, level]) => {
    if (combinedSkills[skill]) {
      // If skill exists, keep the higher level
      combinedSkills[skill] = Math.max(combinedSkills[skill], level);
    } else {
      // If skill doesn't exist, add it
      combinedSkills[skill] = level;
    }
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <ProfileHeader employeeData={employeeData} />

      {/* Main Content Grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}
      >
        {/* Left Column */}
        <div>
          <PersonalInformation employeeData={employeeData} />
          <LearningProfile employeeData={employeeData} />
          <Skills skills={employeeData.skills} title="Current Skills" />
          <Skills
            skills={combinedSkills}
            title="Skills After Roadmap Completion"
          />
          <CompletedCourses completedCourses={completedCourses} />
        </div>
        {/* Right Column */}
        <div>
          <KPIs kpiData={kpiData} />
          <Projects projectsData={projectsData} />
        </div>
      </div>
    </div>
  );
}
