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

  const sendMessageStream = async (message, onChunk) => {
    try {
      const response = await fetch(`${http.defaults.baseURL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...http.defaults.headers.common,
        },
        body: JSON.stringify({
          emp_id: empId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                onChunk(data.chunk);
              } else if (data.done) {
                return;
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      onChunk(
        "I'm having trouble connecting right now. Please try again later."
      );
    }
  };

  return { sendMessage, sendMessageStream };
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