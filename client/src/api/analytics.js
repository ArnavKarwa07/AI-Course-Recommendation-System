import http from "./http";
import { useAuth } from "../context/AuthContext";

export function useKPIAPI() {
  const { empId } = useAuth();

  const getKPI = async () => {
    try {
      const response = await http.get(`/kpi/${empId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching KPI:", error);
      throw error;
    }
  };

  return { getKPI };
}

export async function getKPIAPI(empId) {
  try {
    const response = await http.get(`/kpi/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching KPI:", error);
    throw error;
  }
}

export async function getTeamAnalyticsAPI(managerId) {
  try {
    const response = await http.get(`/team-analytics/${managerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching team analytics:", error);
    throw error;
  }
}
