import http from "./http";
import { useAuth } from "../context/AuthContext";

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
