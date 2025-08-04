import MemberCard from "./MemberCard";

export default function ProjectMembers({ project, processMemberSkills }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h4 style={{ margin: "0 0 0.75rem 0", color: "#374151" }}>
        Assigned Team Members ({project.assignedMembers?.length || 0} members)
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {project.assignedMembers && project.assignedMembers.length === 0 && (
          <span style={{ color: "#ef4444" }}>No team members assigned.</span>
        )}
        {project.assignedMembers &&
          project.assignedMembers.map((member) => (
            <MemberCard
              key={member.emp_id || member.id}
              member={member}
              processMemberSkills={processMemberSkills}
            />
          ))}
      </div>
    </div>
  );
}
