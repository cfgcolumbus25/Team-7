import { useMemo, useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { ResearchTileCard } from "../components/ResearchTimeline.jsx";

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
      style={{ background: "transparent", borderRadius: 12 }}
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
            stroke="#e0e0e0"
            strokeDasharray="4 4"
          />
        ))}

        {/* axes */}
        <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#d0d0d0" />

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
                  fill="#000000"
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
                fill="#666666"
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

// Helper to format money - ensures it has $ sign
function formatMoney(amountDisplay) {
  if (!amountDisplay || amountDisplay.trim() === '') return '$0';
  return amountDisplay.startsWith('$') ? amountDisplay : `$${amountDisplay}`;
}

export default function AdminDashboard() {
  // Get user state from context
  const { user } = useUser();
  
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

  // ---- Admin panel state (optional upload) ----
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [file, setFile] = useState(null);

  // ---- Preview dialog state ----
  const [showPreview, setShowPreview] = useState(false);
  const [previewProject, setPreviewProject] = useState(null);

  // Get user info from context
  const username = user?.username || 'user';
  const IS_ADMIN = user?.isAdmin || user?.username === 'ADMIN';

  // Set profile picture based on user role
  // Admin uses /profile.jpeg, regular users use /user-profile.jpeg
  const profileSrc = IS_ADMIN ? "/profile.jpeg" : "/user-profile.jpeg";
  const golfBadge = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Golf_green_flag_icon.svg/240px-Golf_green_flag_icon.svg.png";
  const tieBadge = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Black_necktie_icon.svg/240px-Black_necktie_icon.svg.png";

  return (
    <>
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        color: "#000000",
        display: "grid",
        gridTemplateColumns: "520px 1fr",
        gap: 24,
        padding: 24,
      }}
    >
      {/* Left: profile card */}
      <aside
        style={{
          background: "transparent",
          border: "1px solid #e0e0e0",
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
            decoding="async"
            loading="lazy"
            onError={(e) => {
              // Fallback to a bundled placeholder if the image path is wrong or missing
              e.currentTarget.onerror = null; // prevent infinite loop
              e.currentTarget.src = "/LBF.svg";
            }}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <h1 style={{ margin: "20px 0 0", fontSize: 32, fontWeight: 800, color: "#000000" }}>{username}</h1>
        </div>

        <hr style={{ margin: "24px 0", border: 0, height: 1, background: "#e0e0e0" }} />

        <div>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 16, color: "#000000" }}>Achievements</div>
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
          background: "transparent",
          border: "1px solid #e0e0e0",
          borderRadius: 12,
          padding: 28,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#000000" }}>Donation History</h2>
          <div style={{ color: "#666666", marginTop: 6 }}>Annual contributions over time</div>
        </div>
        <div style={{ marginTop: 18 }}>
          <BarChart data={donations} />
        </div>

        {/* Footer stats */}
        <hr style={{ margin: "18px 0 18px", border: 0, height: 1, background: "#e0e0e0" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ color: "#666666" }}>Total Donated</div>
            <div style={{ fontWeight: 900, fontSize: 28, color: "#000000" }}>{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
          </div>
          <div>
            <div style={{ color: "#666666" }}>Years Active</div>
            <div style={{ fontWeight: 900, fontSize: 28, color: "#000000" }}>{yearsActive}</div>
          </div>
        </div>
      </main>
  </div>
  {/* Admin-only panel at bottom */}
    {IS_ADMIN && (
      <section
        style={{
          marginTop: 40,
          background: 'transparent',
          borderTop: '1px solid #e0e0e0',
          padding: '32px 24px 80px',
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '480px 1fr',
            gap: 32,
            alignItems: 'flex-start',
          }}
        >
          {/* Left: upload card */}
          <div
            style={{
              background: 'transparent',
              border: '1px solid #e0e0e0',
              borderRadius: 12,
              padding: 28,
              position: 'relative',
            }}
          >
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#000000' }}>Automatically Add Research</h3>
            <p style={{ margin: '10px 0 18px', color: '#666666', fontSize: 14 }}>
              Upload a PDF or paste text to ingest and summarize research data. The structured
              summary will appear to the right.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="file"
                accept="application/pdf,text/plain"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setUploadResult(null);
                  setUploadError(null);
                }}
                style={{
                  color: '#000000',
                  fontSize: 14,
                }}
              />
              <textarea
                placeholder="Or paste raw text here..."
                rows={6}
                style={{
                  resize: 'vertical',
                  width: '100%',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  border: '1px solid #e0e0e0',
                  borderRadius: 8,
                  padding: 10,
                  outline: 'none',
                  background: '#ffffff',
                  color: '#000000',
                }}
                className="dashboard-textarea"
                onChange={(e) => {
                  const val = e.target.value.trim();
                  if (val) {
                    setFile(null); // prefer text if provided
                  }
                }}
                id="admin-raw-text"
              />
              <button
                type="button"
                onClick={async () => {
                  setUploadError(null);
                  setUploadResult(null);
                  const textEl = document.getElementById('admin-raw-text');
                  const rawText = textEl?.value.trim();
                  if (!file && !rawText) {
                    setUploadError('Select a file or paste raw text first.');
                    return;
                  }
                  const form = new FormData();
                  if (file) form.append('file', file);
                  if (rawText) form.append('raw_text', rawText);
                  form.append('source_label', 'Admin Upload');
                  form.append('source_date', new Date().toISOString().slice(0, 10));
                  setUploading(true);
                  try {
                    const resp = await fetch('http://localhost:8000/ingest-and-summarize', {
                      method: 'POST',
                      body: form,
                    });
                    const data = await resp.json();
                    if (!resp.ok) throw new Error(data.error || 'Upload failed');
                    setUploadResult(data);
                    
                    // Show preview if we have projects
                    if (data.projects && data.projects.length > 0) {
                      // Use the first project for preview
                      setPreviewProject(data.projects[0]);
                      setShowPreview(true);
                    }
                  } catch (err) {
                    setUploadError(err.message);
                  } finally {
                    setUploading(false);
                  }
                }}
                disabled={uploading}
                style={{
                  background: uploading ? '#93c5fd' : '#2563eb',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 18px',
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 8,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  gap: 8,
                  alignItems: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                {uploading ? 'Processing…' : 'Automatically Add Research'}
              </button>
              {uploadError && (
                <div style={{ color: '#ff6b6b', fontSize: 13 }}>{uploadError}</div>
              )}
              {!uploadError && uploadResult && (
                <div style={{ color: '#51cf66', fontSize: 13 }}>
                  Upload complete. See parsed output to the right.
                </div>
              )}
              <small style={{ color: '#666666' }}>
                Supported: PDF (extracted text) or pasted raw text. Large files will be chunked
                server‑side.
              </small>
            </div>
          </div>
          {/* Right: placeholder for parsed output */}
          <div
            style={{
              background: 'transparent',
              border: '1px solid #e0e0e0',
              borderRadius: 12,
              padding: 28,
              minHeight: 380,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
            }}
          >
            {!uploadResult && !uploading && (
              <div style={{ color: '#666666' }}>
                Parsed research JSON will appear here after a successful upload.
              </div>
            )}
            {uploading && (
              <div style={{ color: '#000000' }}>Processing upload…</div>
            )}
            {uploadResult && (
              <code style={{ color: '#000000' }}>{JSON.stringify(uploadResult, null, 2)}</code>
            )}
          </div>
        </div>
      </section>
    )}
    
    {/* Preview Dialog */}
    {showPreview && previewProject && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={() => setShowPreview(false)}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 28,
            maxWidth: 600,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800 }}>
            Review Research Tile
          </h3>
          <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: 14 }}>
            Please review how this will appear and confirm if it looks correct
          </p>
          
          <div style={{ marginBottom: 24 }}>
            <ResearchTileCard
              title={previewProject.title || "Untitled Project"}
              impact={previewProject.timeline_snippet || "No timeline available"}
              money={formatMoney(previewProject.fund_usage?.amount_display)}
              summary={previewProject.layman_summary || "No summary available"}
            />
          </div>
          
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setShowPreview(false);
                setPreviewProject(null);
              }}
              style={{
                background: '#fff',
                border: '1px solid #d1d5db',
                color: '#374151',
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Not Correct
            </button>
            <button
              type="button"
              onClick={() => {
                // Save approved tile to localStorage
                const approvedTiles = JSON.parse(localStorage.getItem('approvedResearchTiles') || '[]');
                const tileData = {
                  id: `approved-${Date.now()}`,
                  title: previewProject.title || "Untitled Project",
                  impact: previewProject.timeline_snippet || "No timeline available",
                  money: formatMoney(previewProject.fund_usage?.amount_display),
                  summary: previewProject.layman_summary || "No summary available",
                  year: uploadResult?.project_year || new Date().getFullYear(),
                  // Store full project data for reference
                  projectData: previewProject,
                };
                approvedTiles.push(tileData);
                localStorage.setItem('approvedResearchTiles', JSON.stringify(approvedTiles));
                
                setShowPreview(false);
                setPreviewProject(null);
                // Show success message
                alert('Research tile approved and added to timeline!');
              }}
              style={{
                background: '#2563eb',
                border: 'none',
                color: '#fff',
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Looks Good
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
