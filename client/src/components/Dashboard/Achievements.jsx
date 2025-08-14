export default function Achievements() {
  const achievements = [
    {
      icon: "🏆",
      iconClass: "gold",
      title: "Course Completion Master",
      description: "Completed 5 courses this month",
    },
    {
      icon: "🎯",
      iconClass: "purple",
      title: "Skill Focus Champion",
      description: "Maintained focus on ML for 2 weeks",
    },
    {
      icon: "🚀",
      iconClass: "green",
      title: "Fast Learner",
      description: "Completed Python basics in record time",
    },
  ];

  return (
    <div className="card">
      <h3 className="achievements-title">Recent Achievements</h3>
      {achievements.map((achievement, index) => (
        <div key={index} className="achievement-item">
          <div className={`achievement-icon ${achievement.iconClass}`}>
            {achievement.icon}
          </div>
          <div className="achievement-text">
            <p className="achievement-title">{achievement.title}</p>
            <p className="achievement-desc">{achievement.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
