import http from "./http";
import { useAuth } from "../context/AuthContext";

export function useEmployeeDetailsAPI() {
  const { empId } = useAuth();

  const getEmployeeDetails = async () => {
    try {
      const response = await http.get(`/employee/${empId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employee details:", error);
      throw error;
    }
  };

  return { getEmployeeDetails };
}

export async function getEmployeeDetailsAPI(empId) {
  try {
    const response = await http.get(`/employee/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee details:", error);
    throw error;
  }
}

export async function getBulkEmployeeDataAPI(empIds) {
  try {
    const empIdsString = Array.isArray(empIds) ? empIds.join(",") : empIds;
    const response = await http.get(
      `/bulk-employee-data?emp_ids=${empIdsString}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching bulk employee data:", error);
    throw error;
  }
}

export async function getRolesAPI() {
  try {
    const response = await http.get("/roles");
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

export async function getSkillsAfterCompletionAPI(empId) {
  try {
    const response = await http.get(`/skills_after_completion/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching skills after completion:", error);
    throw error;
  }
}
