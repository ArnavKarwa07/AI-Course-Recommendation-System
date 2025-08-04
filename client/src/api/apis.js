import http from "./http";
import { useAuth } from "../context/AuthContext";

export function useCourseRecommendationAPI() {
  const { empId } = useAuth();

  const recommendCourses = async () => {
    try {
      const response = await http.post("/recommend", {
        emp_id: empId,
        goal: "courses",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching course recommendations:", error);
      throw error;
    }
  };

  return { recommendCourses };
}

export function useRoadmapRecommendationAPI() {
  const { empId } = useAuth();

  const recommendRoadmap = async () => {
    try {
      const response = await http.post("/recommend", {
        emp_id: empId,
        goal: "roadmap",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching roadmap recommendations:", error);
      throw error;
    }
  };

  return { recommendRoadmap };
}

export function useRefreshRoadmapAPI() {
  const { empId } = useAuth();
  const refreshRoadmap = async () => {
    try {
      const response = await http.post("/refresh_recommendation", {
        emp_id: empId,
        goal: "roadmap",
      });
      return response.data;
    } catch (error) {
      console.error("Error refreshing roadmap:", error);
      throw error;
    }
  };
  return { refreshRoadmap };
}

export function useRefreshCoursesAPI() {
  const { empId } = useAuth();
  const refreshCourses = async () => {
    try {
      const response = await http.post("/refresh_recommendation", {
        emp_id: empId,
        goal: "courses",
      });
      return response.data;
    } catch (error) {
      console.error("Error refreshing courses:", error);
      throw error;
    }
  };
  return { refreshCourses };
}

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

export async function getCoursesAPI() {
  try {
    const response = await http.get("/courses");
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
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

export function useCourseCompletionAPI() {
  const { empId } = useAuth();

  const getCourseCompletion = async () => {
    try {
      const response = await http.get(`/completion/${empId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course completion:", error);
      throw error;
    }
  };

  return { getCourseCompletion };
}

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

export function useChatAPI() {
  const { empId } = useAuth();

  const sendMessage = async (message) => {
    try {
      const response = await http.post("/chat", {
        emp_id: empId,
        message,
      });
      return response.data.response;
    } catch (error) {
      console.error("Error sending message:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  };

  return { sendMessage };
}

export function useOngoingCoursesAPI() {
  const { empId } = useAuth();

  const getOngoingCourses = async () => {
    try {
      const response = await http.get(`/ongoing_courses/${empId}`);
      console.log("Ongoing courses data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching ongoing courses:", error);
      throw error;
    }
  };

  return { getOngoingCourses };
}

export async function getTeamMembersAPI(managerId) {
  try {
    const response = await http.get(`/team/${managerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching team members:", error);
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

export async function getEmployeeDetailsAPI(empId) {
  try {
    const response = await http.get(`/employee/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee details:", error);
    throw error;
  }
}

export async function getCourseCompletionAPI(empId) {
  try {
    const response = await http.get(`/completion/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course completion:", error);
    throw error;
  }
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

export async function getProjectsAPI(empId) {
  try {
    const response = await http.get(`/projects/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

// New API functions

// Get projects where user is a manager
export const getManagerProjectsAPI = async (empId) => {
  try {
    const response = await http.get(`/projects/manager/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching manager projects:", error);
    throw error;
  }
};

// Get project assignments for specific project
export const getProjectAssignmentsAPI = async (projectId) => {
  try {
    const response = await http.get(`/projects/${projectId}/assignments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project assignments:", error);
    throw error;
  }
};

// Get project skill requirements
export const getProjectSkillRequirementsAPI = async (projectId) => {
  try {
    const response = await http.get(`/projects/${projectId}/skills`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project skill requirements:", error);
    throw error;
  }
};
