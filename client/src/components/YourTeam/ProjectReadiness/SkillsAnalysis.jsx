import SkillCard from "./SkillCard";

export default function SkillsAnalysis({ project }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h4 style={{ margin: "0 0 0.75rem 0", color: "#374151" }}>
        Required Skills vs Available Skills{" "}
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        {project.skillsAnalysis && project.skillsAnalysis.length > 0 ? (
          project.skillsAnalysis.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))
        ) : (
          <div style={{ color: "#6b7280", fontStyle: "italic" }}>
            No skill requirements defined for this project
          </div>
        )}
      </div>
    </div>
  );
}
