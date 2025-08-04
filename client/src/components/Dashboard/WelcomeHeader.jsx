export default function WelcomeHeader() {
  return (
    <div
      className="card"
      style={{
        background:
          "linear-gradient(90deg,rgb(36, 113, 255) 0%,rgb(70, 46, 176) 100%)",
        color: "white",
        fontWeight: "100",
        fontSize: "1.2rem",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {" "}
      <h2 style={{ fontWeight: "100" }}>Welcome to the SkillSense AI</h2>{" "}
      <p>
        {" "}
        AI-powered learning recommendations • Sensing Skills, Shaping Futures{" "}
      </p>{" "}
    </div>
  );
}
