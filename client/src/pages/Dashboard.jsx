/* eslint-disable react-hooks/exhaustive-deps */
import { useRoadmapRecommendationAPI, useRefreshRoadmapAPI } from "../api/apis";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import WelcomeHeader from "../components/WelcomeHeader";
import StatsCards from "../components/StatsCards";
import LearningJourney from "../components/LearningJourney";
import AIRoadmap from "../components/AIRoadmap";
import LearningStreak from "../components/LearningStreak";
import Achievements from "../components/Achievements";

export default function Dashboard() {
  const { empId } = useAuth();
  const { recommendRoadmap } = useRoadmapRecommendationAPI();
  const { refreshRoadmap } = useRefreshRoadmapAPI();
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapLoaded, setRoadmapLoaded] = useState(false);

  // Fetch roadmap when empId is available
  useEffect(() => {
    if (empId && !roadmapLoaded) {
      fetchRoadmap();
    }
  }, [empId]);

  const fetchRoadmap = useCallback(async () => {
    if (!empId) {
      console.log("No empId available yet, waiting...");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching roadmap for empId:", empId);
      const data = await recommendRoadmap();
      console.log("Roadmap data received:", data);

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
        console.log("Roadmap data set successfully:", data);
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
      console.log("Refreshing roadmap for empId:", empId);
      const data = await refreshRoadmap();
      console.log("Refreshed roadmap data received:", data);

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
        console.log("Refreshed roadmap data set successfully:", data);
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
          <LearningJourney />
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
