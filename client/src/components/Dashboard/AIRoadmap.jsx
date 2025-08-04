import RoadmapTimeline from "../Dashboard/RoadmapTimeline.jsx";

export default function AIRoadmap({
  roadmapData,
  isLoading,
  onRefresh,
  onGenerate,
}) {

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontWeight: "600",
            color: "#1f2937",
            margin: 0,
            paddingLeft: "0.5rem",
          }}
        >
          AI Roadmap
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              fontStyle: "italic",
            }}
          >
            SkillSense AI Curated
          </span>
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
                style={{
                  background: "transparent",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  padding: "0.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#f9fafb";
                  e.target.style.borderColor = "#9ca3af";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "#d1d5db";
                }}
                title="Refresh AI Roadmap"
              >
                🔄
              </button>
            )}
        </div>
      </div>

      {isLoading ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🤖</div>
          <p>AI is analyzing your learning path...</p>
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
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  background: "#fee2e2",
                  borderRadius: "8px",
                  border: "1px solid #fecaca",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  ⚠️
                </div>
                <p style={{ color: "#dc2626", fontWeight: "500" }}>
                  {roadmapData.error}
                </p>
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
                  <div
                    style={{
                      background: "#fef3c7",
                      border: "1px solid #f59e0b",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.75rem",
                          color: "#92400e",
                        }}
                      >
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
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "#f3f4f6",
                borderRadius: "8px",
                color: "#6b7280",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                🔍
              </div>
              <p style={{ marginBottom: "1rem" }}>
                Roadmap data received but structure not recognized
              </p>
              <button
                onClick={onGenerate}
                style={{
                  marginTop: "1rem",
                  background: "#3b82f6",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                Try Generate Again
              </button>
            </div>
          );
        })()
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "#f3f4f6",
            borderRadius: "8px",
            color: "#6b7280",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🤖</div>
          <p style={{ marginBottom: "1rem" }}>
            Ready to discover your personalized learning path?
          </p>
          <button
            className="btn-primary"
            onClick={onGenerate}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#1d4ed8";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#3b82f6";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Generate AI Roadmap
          </button>
        </div>
      )}
    </div>
  );
}
