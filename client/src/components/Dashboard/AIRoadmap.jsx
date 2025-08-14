import RoadmapTimeline from "../Dashboard/RoadmapTimeline.jsx";

export default function AIRoadmap({
  roadmapData,
  isLoading,
  onRefresh,
  onGenerate,
}) {
  return (
    <div className="card">
      <div className="ai-roadmap-header">
        <h2 className="ai-roadmap-title">AI Roadmap</h2>
        <div className="ai-roadmap-header-actions">
          <span className="ai-roadmap-curated-text">SkillSense AI Curated</span>
          {roadmapData &&
            (() => {
              // Check for all possible roadmap structures
              const hasRoadmap =
                (roadmapData.output?.roadmap &&
                  Array.isArray(roadmapData.output.roadmap)) ||
                (roadmapData.output && Array.isArray(roadmapData.output)) ||
                (roadmapData.roadmap && Array.isArray(roadmapData.roadmap)) ||
                Array.isArray(roadmapData);
              return hasRoadmap;
            })() && (
              <button
                onClick={onRefresh}
                className="ai-roadmap-refresh-btn"
                title="Refresh AI Roadmap"
              >
                🔄
              </button>
            )}
        </div>
      </div>

      {isLoading ? (
        <div className="ai-roadmap-loading">
          <div className="ai-roadmap-loading-icon">🤖</div>
          <p className="ai-roadmap-loading-text">
            AI is analyzing your learning path...
          </p>
        </div>
      ) : roadmapData ? (
        // Check for different data structures
        (() => {
          // Enhanced structure detection
          const hasValidRoadmap =
            (roadmapData.output?.roadmap &&
              Array.isArray(roadmapData.output.roadmap)) ||
            (roadmapData.output && Array.isArray(roadmapData.output)) ||
            (roadmapData.roadmap && Array.isArray(roadmapData.roadmap)) ||
            Array.isArray(roadmapData);

          if (roadmapData.error) {
            return (
              <div className="ai-roadmap-error">
                <div className="ai-roadmap-error-icon">⚠️</div>
                <p className="ai-roadmap-error-text">{roadmapData.error}</p>
              </div>
            );
          }

          if (hasValidRoadmap) {
            // Determine the correct roadmap data structure to pass
            let roadmapToPass;

            if (
              roadmapData.output?.roadmap &&
              Array.isArray(roadmapData.output.roadmap)
            ) {
              // Case 1: Nested structure - pass just the roadmap array
              roadmapToPass = roadmapData.output.roadmap;
            } else if (
              roadmapData.output &&
              Array.isArray(roadmapData.output)
            ) {
              // Case 2: Output is directly an array
              roadmapToPass = roadmapData.output;
            } else if (
              roadmapData.roadmap &&
              Array.isArray(roadmapData.roadmap)
            ) {
              // Case 3: Direct roadmap property
              roadmapToPass = roadmapData.roadmap;
            } else if (Array.isArray(roadmapData)) {
              // Case 4: Data is directly an array
              roadmapToPass = roadmapData;
            }

            return (
              <div>
                {/* Warning message for invalid roadmap */}
                {!roadmapData.valid && (
                  <div className="ai-roadmap-warning">
                    <span className="ai-roadmap-warning-icon">⚠️</span>
                    <div>
                      <p className="ai-roadmap-warning-text">
                        This roadmap may not be fully accurate
                      </p>
                    </div>
                  </div>
                )}

                <RoadmapTimeline roadmapData={roadmapToPass} />
              </div>
            );
          }

          // If no valid roadmap structure found, show debug info
          return (
            <div className="ai-roadmap-debug">
              <div className="ai-roadmap-debug-icon">🔍</div>
              <p className="ai-roadmap-debug-text">
                Roadmap data received but structure not recognized
              </p>
              <button onClick={onGenerate} className="ai-roadmap-try-again-btn">
                Try Generate Again
              </button>
            </div>
          );
        })()
      ) : (
        <div className="ai-roadmap-empty">
          <div className="ai-roadmap-empty-icon">🤖</div>
          <p className="ai-roadmap-empty-text">
            Ready to discover your personalized learning path?
          </p>
          <button className="ai-roadmap-generate-btn" onClick={onGenerate}>
            Generate AI Roadmap
          </button>
        </div>
      )}
    </div>
  );
}
