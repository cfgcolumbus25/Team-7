import { useMemo, useState } from "react";

// Tiny tooltip component
function Tooltip({ label, children }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {children}
      <div
        className="tooltip"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "120%",
          background: "#111",
          color: "#fff",
          padding: "6px 8px",
          borderRadius: 6,
          fontSize: 12,
          whiteSpace: "nowrap",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.15s ease",
        }}
      >
        {label}
      </div>
      <style>{`
        .achv:hover .tooltip { opacity: 1; }
      `}</style>
    </div>
  );
}

// Simple SVG bar chart; pass data like [{year: 2022, amount: 1200}, ...]
function BarChart({ width = 800, height = 360, data = [] }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const padding = 48;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const max = Math.max(1, ...data.map((d) => d.amount));
  const barW = innerW / Math.max(1, data.length);

  const gridCount = 4;
  const gridYs = Array.from({ length: gridCount + 1 }, (_, i) => (innerH / gridCount) * i);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      style={{ background: "#fff", borderRadius: 12 }}
    >
      <g transform={`translate(${padding}, ${padding})`}>
        {/* horizontal grid */}
        {gridYs.map((gy, i) => (
          <line
            key={i}
            x1={0}
            y1={gy}
            x2={innerW}
            y2={gy}
            stroke="#e5e7eb"
            strokeDasharray="4 4"
          />
        ))}

        {/* axes */}
        <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#dadde3" />

        {/* bars */}
        {data.map((d, i) => {
          const h = (d.amount / max) * (innerH - 10);
          const x = i * barW + barW * 0.15;
          const y = innerH - h;
          const isHovered = hoverIndex === i;
          return (
            <g
              key={d.year}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x}
                y={y}
                width={barW * 0.7}
                height={h}
                fill={isHovered ? "#0b63ff" : "#1677ff"}
                rx={10}
              />
              {/* Native title tooltip for quick hover details */}
              <title>{`$${d.amount.toLocaleString()} in ${d.year}`}</title>

              {/* Hover amount label above bar */}
              {isHovered && (
                <text
                  x={x + barW * 0.35}
                  y={y - 10}
                  fill="#111827"
                  fontSize={14}
                  fontWeight={700}
                  textAnchor="middle"
                >
                  {`$${d.amount.toLocaleString()}`}
                </text>
              )}
              <text
                x={x + barW * 0.35}
                y={innerH + 24}
                fill="#6b7280"
                fontSize={14}
                textAnchor="middle"
              >
                {d.year}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default function AdminDashboard() {
  // Example data; replace with API data later
  const donations = useMemo(
    () => [
      { year: 2020, amount: 15 },
      { year: 2021, amount: 120 },
      { year: 2022, amount: 99 },
      { year: 2023, amount: 44 },
      { year: 2024, amount: 172 },
    ],
    []
  );
  const total = donations.reduce((s, d) => s + d.amount, 0);
  const yearsActive = donations.length;

  // Replace these with your uploaded images (e.g., from /public)
  const profileSrc = "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop";
  const golfBadge = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Golf_green_flag_icon.svg/240px-Golf_green_flag_icon.svg.png";
  const tieBadge = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Black_necktie_icon.svg/240px-Black_necktie_icon.svg.png";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111827",
        display: "grid",
        gridTemplateColumns: "520px 1fr",
        gap: 24,
        padding: 24,
      }}
    >
      {/* Left: profile card */}
      <aside
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={profileSrc}
            alt="Profile"
            width={220}
            height={220}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <h1 style={{ margin: "20px 0 0", fontSize: 32, fontWeight: 800 }}>John Donor</h1>
        </div>

        <hr style={{ margin: "24px 0", border: 0, height: 1, background: "#e5e7eb" }} />

        <div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Achievements</div>
          <div style={{ display: "flex", gap: 20 }}>
            <div className="achv" style={{ position: "relative" }}>
              <Tooltip label="Board Member – Golf Charity Classic">
                <img
                  src={golfBadge}
                  alt="Golf Achievement"
                  width={96}
                  height={96}
                  style={{ borderRadius: "50%", border: "1px solid #e5e7eb", objectFit: "cover", background: "#f3f4f6" }}
                />
              </Tooltip>
            </div>
            <div className="achv" style={{ position: "relative" }}>
              <Tooltip label="Gala Chair – Annual Black Tie Event">
                <img
                  src={tieBadge}
                  alt="Black Tie Achievement"
                  width={96}
                  height={96}
                  style={{ borderRadius: "50%", border: "1px solid #e5e7eb", objectFit: "cover", background: "#f3f4f6" }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </aside>

      {/* Right: donations card */}
      <main
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 28,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 32, fontWeight: 800 }}>Donation History</h2>
          <div style={{ color: "#6b7280", marginTop: 6 }}>Annual contributions over time</div>
        </div>
        <div style={{ marginTop: 18 }}>
          <BarChart data={donations} />
        </div>

        {/* Footer stats */}
        <hr style={{ margin: "18px 0 18px", border: 0, height: 1, background: "#e5e7eb" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ color: "#6b7280" }}>Total Donated</div>
            <div style={{ fontWeight: 900, fontSize: 28 }}>{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
          </div>
          <div>
            <div style={{ color: "#6b7280" }}>Years Active</div>
            <div style={{ fontWeight: 900, fontSize: 28 }}>{yearsActive}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
