/* eslint-disable react-hooks/exhaustive-deps */
import {
  useRoadmapRecommendationAPI,
  useRefreshRoadmapAPI,
  useOngoingCoursesAPI,
} from "../api/apis";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import WelcomeHeader from "../components/WelcomeHeader";
import StatsCards from "../components/StatsCards";
import CurrentLearningJourney from "../components/CurrentLearningJourney";
import AIRoadmap from "../components/AIRoadmap";
import LearningStreak from "../components/LearningStreak";
import Achievements from "../components/Achievements";

export default function Dashboard() {
  const { empId } = useAuth();
  const { recommendRoadmap } = useRoadmapRecommendationAPI();
  const { refreshRoadmap } = useRefreshRoadmapAPI();
  const { getOngoingCourses } = useOngoingCoursesAPI();

  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapLoaded, setRoadmapLoaded] = useState(false);

  // New state for ongoing courses
  const [ongoingCoursesData, setOngoingCoursesData] = useState([]);
  const [ongoingCoursesLoading, setOngoingCoursesLoading] = useState(true);
  const [ongoingCoursesError, setOngoingCoursesError] = useState(null);

  // Fetch roadmap when empId is available
  useEffect(() => {
    if (empId && !roadmapLoaded) {
      fetchRoadmap();
    }
  }, [empId]);

  // Fetch ongoing courses when empId is available
  useEffect(() => {
    if (empId) {
      fetchOngoingCourses();
    }
  }, [empId]);

  const fetchOngoingCourses = useCallback(async () => {
    if (!empId) {
      console.log("No empId available for ongoing courses yet, waiting...");
      return;
    }

    setOngoingCoursesLoading(true);
    setOngoingCoursesError(null);

    try {
      const response = await getOngoingCourses();

      if (response.data && response.data.length > 0) {
        setOngoingCoursesData(response.data);
      } else {
        setOngoingCoursesData([]);
      }
    } catch (error) {
      console.error("Error fetching ongoing courses:", error);
      setOngoingCoursesError("No ongoing courses found or an error occurred.");
      setOngoingCoursesData([]);
    } finally {
      setOngoingCoursesLoading(false);
    }
  }, [empId, getOngoingCourses]);

  const fetchRoadmap = useCallback(async () => {
    if (!empId) {
      console.log("No empId available yet, waiting...");
      return;
    }

    setIsLoading(true);
    try {
      const data = await recommendRoadmap();

      // Check if the server returned an error
      if (data.error || (data.message && !data.output)) {
        const errorData = {
          error: `Server error: ${data.error || data.message}`,
          serverResponse: data,
        };
        setRoadmapData(errorData);
      } else {
        setRoadmapData(data);
        setRoadmapLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      console.error("Error details:", error.response?.data || error.message);
      const errorData = { error: error.message || "Failed to fetch roadmap" };
      setRoadmapData(errorData);
    } finally {
      setIsLoading(false);
    }
  }, [empId, recommendRoadmap]);

  const handleRefreshRoadmap = useCallback(async () => {
    if (!empId) {
      console.log("No empId available for refresh");
      return;
    }

    setIsLoading(true);
    try {
      const data = await refreshRoadmap();

      // Check if the server returned an error
      if (data.error || (data.message && !data.output)) {
        const errorData = {
          error: `Server error: ${data.error || data.message}`,
          serverResponse: data,
        };
        setRoadmapData(errorData);
      } else {
        setRoadmapData(data);
        setRoadmapLoaded(true);
      }
    } catch (error) {
      console.error("Error refreshing roadmap:", error);
      console.error("Error details:", error.response?.data || error.message);
      const errorData = { error: error.message || "Failed to refresh roadmap" };
      setRoadmapData(errorData);
    } finally {
      setIsLoading(false);
    }
  }, [empId, refreshRoadmap]);

  return (
    <>
      <WelcomeHeader />
      <StatsCards />
      {/* Two-column layout for main content */}
      <div className="dashboard-grid">
        {/* Left Column - Learning Journey and AI Roadmap */}
        <div>
          <CurrentLearningJourney
            ongoingCoursesData={ongoingCoursesData}
            loading={ongoingCoursesLoading}
            error={ongoingCoursesError}
          />
          <AIRoadmap
            roadmapData={roadmapData}
            isLoading={isLoading}
            onRefresh={handleRefreshRoadmap}
            onGenerate={fetchRoadmap}
          />
        </div>

        {/* Right Column - Individual Sidebar Components */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <LearningStreak />
          <Achievements />
        </div>
      </div>
    </>
  );
}
