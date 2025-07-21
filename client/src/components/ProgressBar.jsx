export default function ProgressBar({ percent }) {
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${percent}%`, fontFamily: "monospace" }}
      >
        {percent}%
      </div>
    </div>
  );
}
