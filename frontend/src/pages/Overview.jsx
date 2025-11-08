import { useState, useRef, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EventsThisYear from "../components/EventsThisYear.jsx";
import GoalProgress2025 from "../components/GoalProgress2025.jsx";
import ResearchMilestones from "../components/ResearchMilestones.jsx";
import ResearchTimeline from "../components/ResearchTimeline.jsx";
import StoriesOfHope from "../components/StoriesOfHope.jsx";

const FUNDRAISING_YEARS = [
  { year: 2018, amount: 425000 },
  { year: 2019, amount: 510000 },
  { year: 2020, amount: 465000 },
  { year: 2021, amount: 590000 },
  { year: 2022, amount: 720000 },
  { year: 2023, amount: 870000 },
  { year: 2024, amount: 2290000 },
];

export default function Overview() {
  const firstYear = FUNDRAISING_YEARS[0].year;
  const [selectedYear, setSelectedYear] = useState(firstYear);

  // control chart animation when it enters viewport
  const chartContainerRef = useRef(null);
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    const node = chartContainerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateChart(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div>
      <ResearchTimeline
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#000",
            textAlign: "center",
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          Yearly Fundraising
        </h2>

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* container observed so animation starts when chart scrolls into view */}
          <div ref={chartContainerRef}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={FUNDRAISING_YEARS}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="year"
                  stroke="#64748b"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={formatYAxis}
                />
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Amount",
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "8px 12px",
                  }}
                />
                {FUNDRAISING_YEARS.some(
                  (entry) => entry.year === selectedYear
                ) && (
                  <ReferenceLine
                    x={selectedYear}
                    stroke="#1E88E5"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                )}
                <Bar
                  dataKey="amount"
                  radius={[4, 4, 0, 0]}
                  // only animate when the chart is visible
                  isAnimationActive={animateChart}
                  animationBegin={80}
                  animationDuration={1200}
                  animationEasing="ease"
                >
                  {FUNDRAISING_YEARS.map((entry) => (
                    <Cell
                      key={entry.year}
                      fill={entry.year === selectedYear ? "#1E88E5" : "#c8dbf8"}
                      stroke={entry.year === selectedYear ? "#1565C0" : "none"}
                      strokeWidth={entry.year === selectedYear ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <StoriesOfHope />

        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#000",
            textAlign: "center",
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          Foundation Highlights
        </h2>

        {/* Three metric cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginTop: "1.5rem",
          }}
        >
          <EventsThisYear />
          <ResearchMilestones />
          <GoalProgress2025 />
        </div>
      </div>
    </div>
  );
}
