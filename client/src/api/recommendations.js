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
