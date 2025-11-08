import ResearchTimeline from "../components/ResearchTimeline.jsx";

export default function Overview() {
  return (
    <div>
      <header className="header">
        <h1>Lilabean Foundation Dashboard</h1>
        <div className="header-actions">
          <button className="donate-btn">Donate</button>
        </div>
      </header>
      <ResearchTimeline />
    </div>
  );
}
