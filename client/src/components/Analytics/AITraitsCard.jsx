export default function AITraitsCard({ behaviorTraits }) {
  return (
    <div className="card ai-traits-card">
      <div className="ai-traits-content">
        <h3 className="ai-traits-title">AI Identified Traits</h3>
        {behaviorTraits && behaviorTraits.length > 0 ? (
          <div className="ai-traits-data">
            <div className="ai-traits-count">{behaviorTraits.length}</div>
            <p className="ai-traits-count-label">Traits identified</p>
            <div className="ai-traits-list">
              {behaviorTraits.map((trait, index) => (
                <span key={index} className="ai-trait-tag">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="ai-traits-placeholder">
            <div className="ai-traits-placeholder-icon">...</div>
            <p className="ai-traits-placeholder-text">Analyzing behavior</p>
            <p className="ai-traits-placeholder-subtext">
              AI insights coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
