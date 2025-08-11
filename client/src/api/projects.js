import http from "./http";
import { useAuth } from "../context/AuthContext";

export function useProjectsAPI() {
  const { empId } = useAuth();

  const getProjects = async () => {
    try {
      const response = await http.get(`/projects/${empId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  };

  return { getProjects };
}

export async function getProjectsAPI(empId) {
  try {
    const response = await http.get(`/projects/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export const getManagerProjectsAPI = async (empId) => {
  try {
    const response = await http.get(`/projects/manager/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching manager projects:", error);
    throw error;
  }
};

export const getProjectAssessmentAPI = async (empId, projectId) => {
  try {
    const response = await http.post("/assess-project-readiness", {
      emp_id: empId,
      project_id: projectId,
    });
    console.log("Project assessment response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error assessing project readiness:", error);
    throw error;
  }
};