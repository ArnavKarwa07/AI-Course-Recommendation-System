export default function CareerGrowthInsights({
  employeeDetails,
  timeSinceLastPromotion,
  promotionCycle,
}) {
  return (
    <div className="card career-growth-insights">
      <h2 className="career-growth-title">Career Growth Insights</h2>

      <div className="career-growth-grid">
        {/* Current Role */}
        <div className="career-growth-card current-role">
          <span
            className="career-growth-icon current-role"
            role="img"
            aria-label="role"
          >
            🧑‍💼
          </span>
          <h4 className="career-growth-card-title">Current Role</h4>
          <p className="career-growth-card-value current-role">
            {employeeDetails?.role}
          </p>
          <p className="career-growth-card-subtitle">
            {employeeDetails?.dept} Department
          </p>
        </div>

        {/* Career Goal */}
        <div className="career-growth-card career-goal">
          <span
            className="career-growth-icon career-goal"
            role="img"
            aria-label="goal"
          >
            🎯
          </span>
          <h4 className="career-growth-card-title">Career Goal</h4>
          <p className="career-growth-card-value career-goal">
            {employeeDetails?.career_goal}
          </p>
          <p className="career-growth-card-subtitle">Target Position</p>
        </div>

        {/* Experience */}
        <div className="career-growth-card experience">
          <span
            className="career-growth-icon experience"
            role="img"
            aria-label="experience"
          >
            ⏳
          </span>
          <h4 className="career-growth-card-title">Experience</h4>
          <p className="career-growth-card-value experience">
            {employeeDetails?.experience} months
          </p>
          <p className="career-growth-card-subtitle">Total Experience</p>
        </div>

        {/* Next Promotion */}
        <div className="career-growth-card next-promotion">
          <span
            className="career-growth-icon next-promotion"
            role="img"
            aria-label="promotion"
          >
            📈
          </span>
          <h4 className="career-growth-card-title">Next Promotion</h4>
          <p className="career-growth-card-value next-promotion">
            ~{Math.max(0, promotionCycle - timeSinceLastPromotion)} months
          </p>
          <p className="career-growth-card-subtitle">Estimated Timeline</p>
        </div>
      </div>
    </div>
  );
}
