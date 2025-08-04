import PerformanceScoreCard from "./PerformanceScoreCard";
import SkillAnalysisCard from "./SkillAnalysisCard";
import AITraitsCard from "./AITraitsCard";

export default function MetricsGrid({
  averageKPI,
  kpiDataLength,
  skillGaps,
  behaviorTraits,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
        marginBottom: "1rem",
        textAlign: "center",
      }}
    >
      <PerformanceScoreCard
        averageKPI={averageKPI}
        kpiDataLength={kpiDataLength}
      />
      <SkillAnalysisCard skillGaps={skillGaps} />
      <AITraitsCard behaviorTraits={behaviorTraits} />
    </div>
  );
}
