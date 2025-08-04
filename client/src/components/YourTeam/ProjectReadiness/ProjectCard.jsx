import ProjectHeader from "./ProjectHeader";
import ProjectDetails from "./ProjectDetails";
import SkillsAnalysis from "./SkillsAnalysis";
import ProjectMembers from "./ProjectMembers";

export default function ProjectCard({
  project,
  isExpanded,
  onToggleExpand,
  processMemberSkills,
}) {
  return (
    <div
      style={{
        width: "100%",
        marginBottom: "1.5rem",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        boxShadow: isExpanded
          ? "0 4px 24px rgba(0,0,0,0.10)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        background: "#fff",
        transition: "box-shadow 0.2s",
      }}
    >
      <ProjectHeader
        project={project}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />

      {isExpanded && (
        <div style={{ padding: "2rem" }}>
          <ProjectDetails project={project} />
          <SkillsAnalysis project={project} />
          <ProjectMembers
            project={project}
            processMemberSkills={processMemberSkills}
          />
        </div>
      )}
    </div>
  );
}
