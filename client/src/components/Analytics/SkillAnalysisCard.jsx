export default function SkillAnalysisCard({ skillGaps }) {
  const hasGaps = skillGaps.length > 0;

  return (
    <div
      className={`card skill-analysis-card ${hasGaps ? "has-gaps" : "no-gaps"}`}
    >
      <div className="skill-analysis-content">
        <h3 className="skill-analysis-title">Skill Analysis</h3>
        {hasGaps ? (
          <div className="skill-analysis-data">
            <div className="skill-analysis-count has-gaps">
              {skillGaps.length}
            </div>
            <p className="skill-analysis-label">Skill gaps detected</p>
            <div className="skill-gaps-list">
              {skillGaps.map((gap, index) => (
                <span key={index} className="skill-gap-tag">
                  {gap}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="skill-analysis-no-gaps">
            <div className="skill-analysis-count no-gaps">0</div>
            <p className="skill-analysis-label">No skill gaps detected</p>
            <p className="skill-analysis-subtext">You're on track</p>
          </div>
        )}
      </div>
    </div>
  );
}
