"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

const COLORS = {
  fraud: "#ef4444",
  suspicious: "#f59e0b",
  legit: "#10b981",
  purple: "#8b5cf6",
};

const generateDailyData = () =>
  Array.from({ length: 30 }, (_, i) => ({
    day: `May ${i + 1}`,
    fraud: Math.floor(Math.random() * 15 + 2),
    suspicious: Math.floor(Math.random() * 25 + 5),
    legitimate: Math.floor(Math.random() * 80 + 40),
  }));

const generateHourlyRisk = () =>
  Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    risk: Math.floor(Math.random() * 60 + 10),
    volume: Math.floor(Math.random() * 100 + 20),
  }));

const generateChainData = () => [
  {
    name: "Ethereum",
    fraud: Math.floor(Math.random() * 20 + 5),
    suspicious: Math.floor(Math.random() * 30 + 10),
    legit: Math.floor(Math.random() * 100 + 50),
  },
  {
    name: "Bitcoin",
    fraud: Math.floor(Math.random() * 15 + 3),
    suspicious: Math.floor(Math.random() * 20 + 8),
    legit: Math.floor(Math.random() * 80 + 40),
  },
];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    color: "var(--text-primary)",
  },
};

export default function Analytics() {
  const [dailyData, setDailyData] = useState(generateDailyData());
  const [hourlyRisk, setHourlyRisk] = useState(generateHourlyRisk());
  const [chainData, setChainData] = useState(generateChainData());

  const totalFraud = dailyData.reduce((a, d) => a + d.fraud, 0);
  const totalSuspicious = dailyData.reduce((a, d) => a + d.suspicious, 0);
  const totalLegit = dailyData.reduce((a, d) => a + d.legitimate, 0);

  const total = totalFraud + totalSuspicious + totalLegit;

  const pieData = [
    {
      name: "Legitimate",
      value: totalLegit,
      color: COLORS.legit,
    },
    {
      name: "Suspicious",
      value: totalSuspicious,
      color: COLORS.suspicious,
    },
    {
      name: "Fraudulent",
      value: totalFraud,
      color: COLORS.fraud,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyData(generateDailyData());
      setHourlyRisk(generateHourlyRisk());
      setChainData(generateChainData());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            margin: 0,
            color: "var(--text-primary)",
          }}
        >
          Analytics
        </h1>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginTop: "6px",
          }}
        >
          Real-time fraud detection statistics across Ethereum and Bitcoin
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Analyzed",
            value: total,
            color: COLORS.purple,
          },
          {
            label: "Fraud Detected",
            value: totalFraud,
            color: COLORS.fraud,
          },
          {
            label: "Suspicious",
            value: totalSuspicious,
            color: COLORS.suspicious,
          },
          {
            label: "Legitimate",
            value: totalLegit,
            color: COLORS.legit,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              minHeight: "145px",
              borderLeft: `4px solid ${s.color}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {s.label}
            </p>

            <h2
              style={{
                fontSize: "34px",
                fontWeight: "700",
                margin: "12px 0 8px",
                color: s.color,
              }}
            >
              {s.value.toLocaleString()}
            </h2>

            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              {((s.value / total) * 100).toFixed(1)}% of total
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div className="card">
          <h3
            style={{
              fontSize: "14px",
              marginBottom: "20px",
              color: "var(--text-primary)",
            }}
          >
            30-Day Detection Trend
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyData}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip {...tooltipStyle} />
              <Legend />

              <Area
                type="monotone"
                dataKey="legitimate"
                stroke={COLORS.legit}
                fillOpacity={0.2}
                fill={COLORS.legit}
              />

              <Area
                type="monotone"
                dataKey="suspicious"
                stroke={COLORS.suspicious}
                fillOpacity={0.2}
                fill={COLORS.suspicious}
              />

              <Area
                type="monotone"
                dataKey="fraud"
                stroke={COLORS.fraud}
                fillOpacity={0.2}
                fill={COLORS.fraud}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3
            style={{
              fontSize: "14px",
              marginBottom: "20px",
              color: "var(--text-primary)",
            }}
          >
            Overall Distribution
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={85}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "16px",
        }}
      >
        <div className="card">
          <h3
            style={{
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Hourly Risk Score
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={hourlyRisk}>
              <XAxis dataKey="hour" interval={3} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip {...tooltipStyle} />

              <Line
                type="monotone"
                dataKey="risk"
                stroke={COLORS.purple}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3
            style={{
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Chain Comparison
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chainData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Legend />

              <Bar dataKey="fraud" fill={COLORS.fraud} radius={[8, 8, 0, 0]} />

              <Bar
                dataKey="suspicious"
                fill={COLORS.suspicious}
                radius={[8, 8, 0, 0]}
              />

              <Bar dataKey="legit" fill={COLORS.legit} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
