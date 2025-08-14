export default function PersonalInformation({ employeeData }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="card">
      <h3 className="personal-information-title">Personal Information</h3>
      <div className="personal-information-container">
        <div className="personal-information-item">
          <span className="personal-information-label">Join Date:</span>
          <strong className="personal-information-value">
            {formatDate(employeeData.join_date)}
          </strong>
        </div>
        <div className="personal-information-item">
          <span className="personal-information-label">Experience:</span>
          <strong className="personal-information-value">
            {employeeData.experience} months
          </strong>
        </div>
        <div className="personal-information-item">
          <span className="personal-information-label">Last Promotion:</span>
          <strong className="personal-information-value">
            {formatDate(employeeData.last_promotion_date)}
          </strong>
        </div>
        <div className="personal-information-item">
          <span className="personal-information-label">Languages:</span>
          <strong className="personal-information-value">
            {employeeData.languages}
          </strong>
        </div>
      </div>
    </div>
  );
}
