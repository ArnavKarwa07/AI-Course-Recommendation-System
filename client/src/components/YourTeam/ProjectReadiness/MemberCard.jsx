export default function MemberCard({ member, processMemberSkills }) {
  const formatMemberSkills = (skills) => {
    if (!skills) return "N/A";

    // If it's an object, format it properly
    if (typeof skills === "object" && !Array.isArray(skills)) {
      return (
        Object.entries(skills)
          .map(([skill, level]) => `${skill}(${level})`)
          .join(", ") || "N/A"
      );
    }

    // Fallback for other formats
    const memberSkills = processMemberSkills(skills);
    const skillsDisplay = Object.values(memberSkills)
      .map((skill) => `${skill.originalName}(${skill.proficiency})`)
      .join(", ");
    return skillsDisplay || "N/A";
  };

  return (
    <div
      style={{
        padding: "0.75rem 1.25rem",
        background: "#f3f4f6",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        minWidth: "180px",
      }}
    >
      <div style={{ fontWeight: 600, color: "#374151" }}>
        {member.name || "Unknown"}
      </div>
      <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
        {member.role || member.assignment_role || "No role specified"}
      </div>
      <div
        style={{
          color: "#6b7280",
          fontSize: "0.85rem",
          marginTop: "0.25rem",
        }}
      >
        Skills: {formatMemberSkills(member.skills)}
      </div>
    </div>
  );
}
