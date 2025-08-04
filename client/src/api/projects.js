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

export const getProjectAssignmentsAPI = async (projectId) => {
  try {
    const response = await http.get(`/projects/${projectId}/assignments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project assignments:", error);
    throw error;
  }
};

export const getProjectSkillRequirementsAPI = async (projectId) => {
  try {
    const response = await http.get(`/projects/${projectId}/skills`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project skill requirements:", error);
    throw error;
  }
};
