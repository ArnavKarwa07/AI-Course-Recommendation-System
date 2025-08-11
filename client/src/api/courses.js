import http from "./http";
import { useAuth } from "../context/AuthContext";

export async function getCoursesAPI() {
  try {
    const response = await http.get("/courses");
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
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

export async function getCourseCompletionAPI(empId) {
  try {
    const response = await http.get(`/completion/${empId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course completion:", error);
    throw error;
  }
}

export function useOngoingCoursesAPI() {
  const { empId } = useAuth();

  const getOngoingCourses = async () => {
    try {
      const response = await http.get(`/ongoing_courses/${empId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching ongoing courses:", error);
      throw error;
    }
  };

  return { getOngoingCourses };
}
