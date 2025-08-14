import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function TeamSkills({
  skillAnalytics,
  skillsHeatmapData,
  teamMembers,
}) {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 1000, height: 500 });

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;

        // Use almost full container width with minimal padding
        const width = Math.max(800, containerWidth - 20); // Increased min width for 6-7 bubbles horizontally
        const height = Math.max(400, Math.min(window.innerHeight * 0.4, 500)); // Keep height reasonable

        setDimensions({ width, height });
      }
    };

    // Initial calculation
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!skillsHeatmapData || skillsHeatmapData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;
    const margin = 10; // Minimal margin

    svg.attr("width", width).attr("height", height);

    // Prepare data for pack layout with adjusted sizing for horizontal spread
    const packData = {
      children: skillsHeatmapData.map((d) => ({
        ...d,
        value: d.memberCount * 8 + d.coverage, // Slightly reduced multiplier for better distribution
      })),
    };

    // Create pack layout optimized for horizontal spread
    const pack = d3
      .pack()
      .size([width - margin * 2, height - margin * 2])
      .padding(Math.max(1, width * 0.002)); // Minimal padding for maximum space usage

    const root = d3
      .hierarchy(packData)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    pack(root);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.9)")
      .style("color", "white")
      .style("padding", "12px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Create bubble groups
    const bubbles = svg
      .selectAll(".bubble")
      .data(root.children)
      .enter()
      .append("g")
      .attr("class", "bubble")
      .attr("transform", (d) => `translate(${d.x + margin},${d.y + margin})`);

    // Add circles
    bubbles
      .append("circle")
      .attr("r", (d) => d.r)
      .style("fill", (d) => d.data.color)
      .style("opacity", 0.8)
      .style("stroke", "#fff")
      .style("stroke-width", Math.max(1, width * 0.001)) // Thinner stroke for more space
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        const skillData = skillAnalytics.expertiseMap[d.data.skill];
        const membersList = skillData?.members
          ?.map((m) => `${m.name} (${m.level})`)
          .join(", ");

        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `
            <div><strong>${d.data.skill}</strong></div>
            <div>Coverage: ${d.data.coverage}% (${d.data.memberCount}/${teamMembers.length} members)</div>
            <div>Average Level: ${d.data.averageLevel}</div>
            <div style="margin-top: 8px;"><strong>Team Members:</strong></div>
            <div>${membersList}</div>
            `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add skill names with optimized font sizing
    bubbles
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em") // Increased margin from -0.3em
      .style("fill", "white")
      .style("font-weight", "bold")
      .style("font-size", (d) => {
        const baseFontSize = Math.min(d.r / 4, Math.max(8, width * 0.01)); // Reduced from /3 and 0.012
        return Math.min(baseFontSize, 16) + "px"; // Reduced max from 18px
      })
      .style("pointer-events", "none")
      .text((d) => {
        // More generous text length for wider layout
        const maxLength = Math.floor(d.r / 4.5);
        return d.data.skill.length > maxLength
          ? d.data.skill.substring(0, maxLength) + "..."
          : d.data.skill;
      });

    // Add member count with optimized sizing
    bubbles
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.6em") // Increased margin from 0.4em
      .style("fill", "white")
      .style("font-weight", "600")
      .style("font-size", (d) => {
        const baseFontSize = Math.min(d.r / 5, Math.max(6, width * 0.008)); // Reduced from /4 and 0.01
        return Math.min(baseFontSize, 13) + "px"; // Reduced max from 15px
      })
      .style("pointer-events", "none")
      .text((d) => {
        if (d.r < 12) return "";
        return `${d.data.memberCount} members`;
      });

    // Add coverage percentage
    bubbles
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2em")
      .style("fill", "white")
      .style("font-weight", "500")
      .style("font-size", (d) => {
        const baseFontSize = Math.min(d.r / 6, Math.max(5, width * 0.006)); // Reduced from /5 and 0.008
        return Math.min(baseFontSize, 11) + "px"; // Reduced max from 13px
      })
      .style("pointer-events", "none")
      .text((d) => {
        if (d.r < 10) return "";
        return `${d.data.coverage}%`;
      });

    // Cleanup
    return () => {
      d3.select(".tooltip").remove();
    };
  }, [skillsHeatmapData, skillAnalytics, teamMembers, dimensions]);

  return (
    <div>
      {/* Skills Bubble Chart */}
      <div className="card team-skills-card">
        <h3 className="team-skills-title">Team Skills Distribution</h3>
        <div ref={containerRef} className="team-skills-chart-container">
          <svg ref={svgRef} className="team-skills-chart-svg"></svg>
        </div>

        {/* Responsive Legend */}
        <div className="team-skills-legend">
          <div className="team-skills-legend-item">
            <div className="team-skills-legend-circle expert"></div>
            <span className="team-skills-legend-text">Expert Level (4.0)</span>
          </div>
          <div className="team-skills-legend-item">
            <div className="team-skills-legend-circle intermediate"></div>
            <span className="team-skills-legend-text">
              Intermediate (3.0-3.9)
            </span>
          </div>
          <div className="team-skills-legend-item">
            <div className="team-skills-legend-circle beginner"></div>
            <span className="team-skills-legend-text">
              Beginner (Below 3.0)
            </span>
          </div>
        </div>

        {/* Chart Description */}
        <div className="team-skills-chart-description">
          Bubble size represents skill coverage • Hover for detailed information
        </div>
      </div>

      {/* AI Identified Skill Gaps */}
      <div className="card">
        <h3 className="team-skills-gaps-title">AI Identified Skill Gaps</h3>
        {skillAnalytics.individualSkillGaps.length > 0 ? (
          <div className="team-skills-gaps-container">
            {skillAnalytics.individualSkillGaps.map((member, index) => (
              <div key={index} className="team-skills-gap-card">
                <div className="team-skills-gap-member">
                  {member.name} ({member.role})
                </div>
                <div className="team-skills-gap-skills">
                  {member.gaps.map((gap, gapIndex) => (
                    <span key={gapIndex} className="team-skills-gap-skill">
                      {gap.skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="team-skills-no-gaps">
            <div className="team-skills-no-gaps-icon">✅</div>
            <h4 className="team-skills-no-gaps-title">
              No Skill Gaps Identified
            </h4>
            <p className="team-skills-no-gaps-text">
              All team members meet the required skill levels for their roles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
