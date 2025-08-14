export default function LearningProfile({ employeeData }) {
  return (
    <div className="card">
      <h3 className="learning-profile-title">Learning Profile</h3>
      <div className="learning-profile-section">
        <p className="learning-profile-label">Learning Preference:</p>
        <span className="learning-profile-tag preference">
          {employeeData.learning_preferences}
        </span>
      </div>
      <div className="learning-profile-section">
        <p className="learning-profile-label">Interests:</p>
        <span className="learning-profile-tag interests">
          {employeeData.interests}
        </span>
      </div>
      <div className="learning-profile-section">
        <p className="learning-profile-label">Career Goal:</p>
        <span className="learning-profile-tag career-goal">
          {employeeData.career_goal}
        </span>
      </div>
    </div>
  );
}
