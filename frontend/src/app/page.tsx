"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const generateRiskTrend = () =>
  Array.from({ length: 12 }, (_, i) => ({
    time: `${i + 1}h`,
    risk: Math.floor(Math.random() * 60 + 10),
  }));

export default function Overview() {
  const [trend, setTrend] = useState(generateRiskTrend());

  const [stats, setStats] = useState({
    fraudulent: 4,
    suspicious: 8,
    legitimate: 48,
    meanRisk: 31,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTrend(generateRiskTrend());

      setStats({
        fraudulent: Math.floor(Math.random() * 8 + 2),
        suspicious: Math.floor(Math.random() * 12 + 4),
        legitimate: Math.floor(Math.random() * 30 + 40),
        meanRisk: Math.floor(Math.random() * 40 + 20),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const pieData = [
    {
      name: "Legitimate",
      value: stats.legitimate,
      color: "#22c55e",
    },
    {
      name: "Suspicious",
      value: stats.suspicious,
      color: "#f59e0b",
    },
    {
      name: "Fraudulent",
      value: stats.fraudulent,
      color: "#ef4444",
    },
  ];

  const statCards = [
    {
      label: "Fraudulent TX",
      value: stats.fraudulent,
      sub: "Critical alerts",
      color: "#ef4444",
      glow: "rgba(239,68,68,0.35)",
    },
    {
      label: "Suspicious TX",
      value: stats.suspicious,
      sub: "Under investigation",
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.35)",
    },
    {
      label: "Legitimate TX",
      value: stats.legitimate,
      sub: "Verified safe",
      color: "#22c55e",
      glow: "rgba(34,197,94,0.35)",
    },
    {
      label: "Mean Risk",
      value: `${stats.meanRisk}%`,
      sub: "Risk confidence",
      color: "#8b5cf6",
      glow: "rgba(139,92,246,0.35)",
    },
  ];

  return (
    <div
      style={{
        padding: "32px",
        background: "radial-gradient(circle at top, #111827 0%, #050816 100%)",
        minHeight: "100vh",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "800",
              color: "#fff",
              margin: 0,
            }}
          >
            Threat Overview
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#94a3b8",
              marginTop: "8px",
            }}
          >
            Real-time blockchain fraud detection intelligence
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.2)",
            padding: "10px 18px",
            borderRadius: "999px",
            color: "#22c55e",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 18px #22c55e",
            }}
          />
          Live Monitoring
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))",
          gap: "18px",
          marginBottom: "24px",
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "24px",
              padding: "24px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px)",
              transition: "0.3s ease",
              boxShadow: `0 0 30px ${card.glow}`,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: card.glow,
                filter: "blur(60px)",
              }}
            />

            <p
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              {card.label}
            </p>

            <h2
              style={{
                fontSize: "44px",
                margin: "12px 0",
                color: card.color,
                fontWeight: 800,
              }}
            >
              {card.value}
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "13px",
                margin: 0,
              }}
            >
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >

        <div
          style={{
            borderRadius: "28px",
            padding: "24px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                color: "#fff",
                fontSize: "18px",
                margin: 0,
              }}
            >
              Mean Risk Score Trend
            </h3>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                marginTop: "6px",
              }}
            >
              AI-calculated threat fluctuations
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />

              <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} />

              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />

              <Tooltip
                contentStyle={{
                  background: "#111827",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />

              <Line
                type="monotone"
                dataKey="risk"
                stroke="#8b5cf6"
                strokeWidth={4}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            borderRadius: "28px",
            padding: "24px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontSize: "18px",
              marginBottom: "24px",
            }}
          >
            Detection Distribution
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            {pieData.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: item.color,
                  }}
                />

                <span
                  style={{
                    color: "#cbd5e1",
                    fontSize: "13px",
                  }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
