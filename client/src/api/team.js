import http from "./http";

export async function getTeamMembersAPI(managerId) {
  try {
    const response = await http.get(`/team/${managerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
}
