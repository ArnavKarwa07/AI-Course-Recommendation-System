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
      <h3 style={{ marginTop: 0 }}>Personal Information</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Join Date:</span>
          <strong>{formatDate(employeeData.join_date)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Experience:</span>
          <strong>{employeeData.experience} months</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Last Promotion:</span>
          <strong>{formatDate(employeeData.last_promotion_date)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Languages:</span>
          <strong>{employeeData.languages}</strong>
        </div>
      </div>
    </div>
  );
}
