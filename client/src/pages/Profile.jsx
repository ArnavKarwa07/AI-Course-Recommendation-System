/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  useEmployeeDetailsAPI,
  useCourseCompletionAPI,
  useKPIAPI,
  useProjectsAPI,
} from "../api/apis";
import ProfileHeader from "../components/ProfileHeader";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import PersonalInformation from "../components/PersonalInformation";
import LearningProfile from "../components/LearningProfile";
import LearningStats from "../components/LearningStats";
import KPIs from "../components/KPIs";
import CompletedCourses from "../components/CompletedCourses";

export default function Profile() {
  const { empId } = useAuth();
  const { getEmployeeDetails } = useEmployeeDetailsAPI();
  const { getCourseCompletion } = useCourseCompletionAPI();
  const { getKPI } = useKPIAPI();
  const { getProjects } = useProjectsAPI();
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
        ] = await Promise.all([
          getEmployeeDetails(),
          getCourseCompletion(),
          getKPI(),
          getProjects(),
        ]);

        console.log("Employee details response:", employeeResponse);
        console.log("Completed courses response:", coursesResponse);
        console.log("KPI response:", kpiResponse);
        console.log("Projects response:", projectsResponse);

        setEmployeeData(employeeResponse?.data || employeeResponse);
        setCompletedCourses(
          coursesResponse?.data?.completedCourses || coursesResponse?.data || []
        );
        setKpiData(kpiResponse?.data || []);
        setProjectsData(projectsResponse?.data || []);
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
          <Skills employeeData={employeeData} />
          <Projects projectsData={projectsData} />
          <PersonalInformation employeeData={employeeData} />
          <LearningProfile employeeData={employeeData} />
        </div>
        {/* Right Column */}
        <div>
          <CompletedCourses completedCourses={completedCourses} />
          <KPIs kpiData={kpiData} />
        </div>
      </div>
    </div>
  );
}
