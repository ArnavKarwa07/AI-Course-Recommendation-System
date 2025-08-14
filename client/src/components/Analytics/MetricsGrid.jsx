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
    <div className="metrics-grid">
      <PerformanceScoreCard
        averageKPI={averageKPI}
        kpiDataLength={kpiDataLength}
      />
      <SkillAnalysisCard skillGaps={skillGaps} />
      <AITraitsCard behaviorTraits={behaviorTraits} />
    </div>
  );
}
