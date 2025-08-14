export default function ProfileHeader({ employeeData }) {
  if (!employeeData) return null;

  return (
    <div className="profile-header">
      <div className="profile-header-content">
        <div className="profile-header-avatar">
          {employeeData.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "N/A"}
        </div>
        <div className="profile-header-info">
          <p className="profile-header-name">
            {employeeData.name}{" "}
            <span className="profile-header-role">- {employeeData.role}</span>
          </p>
          <p className="profile-header-department">
            Department: {employeeData.dept}
          </p>
          <div className="profile-header-id">ID: {employeeData.emp_id}</div>
        </div>
      </div>
    </div>
  );
}
