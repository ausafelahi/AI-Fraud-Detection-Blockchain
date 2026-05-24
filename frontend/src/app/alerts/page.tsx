"use client";

import { useState, useEffect } from "react";

interface Alert {
  id: string;
  transactionHash: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  reason: string;
  amount: string;
  from: string;
  time: string;
  acknowledged: boolean;
}

const reasons = [
  "Amount matches structured money-laundering bucket. Counterparty linked to Lazarus cluster.",
  "Gas premium 8x network median. Possible MEV sandwich attempt.",
  "Destination contract was deployed 4 minutes ago. Unverified bytecode + honeypot heuristics.",
  "Sender wallet flagged on 3 blacklists. Rapid fan-out pattern matches mixer signature.",
  "Velocity spike: 34 outgoing tx in 90s from cold wallet.",
  "Transaction value exceeds 3 standard deviations from wallet baseline.",
  "Known phishing address detected in recipient field.",
  "Circular transaction pattern detected across 5 wallets.",
];

function generateAlerts(): Alert[] {
  const severities: ("CRITICAL" | "HIGH" | "MEDIUM")[] = [
    "CRITICAL",
    "HIGH",
    "MEDIUM",
  ];

  return Array.from({ length: Math.floor(Math.random() * 6 + 5) }, () => {
    const minutesAgo = Math.floor(Math.random() * 60 + 1);
    const severity = severities[Math.floor(Math.random() * severities.length)];

    return {
      id: `ALERT-${Math.floor(Math.random() * 9000 + 1000)}`,
      transactionHash:
        "0x" +
        Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16),
        ).join(""),
      severity,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      amount: (Math.random() * 100 + 1).toFixed(4),
      from:
        "0x" +
        Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16),
        ).join(""),
      time: `${minutesAgo}m ago`,
      acknowledged: false,
    };
  });
}

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setAlerts(generateAlerts());

    const interval = setInterval(() => {
      setAlerts(generateAlerts());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const acknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, acknowledged: true } : alert,
      ),
    );
  };

  const critical = alerts.filter((a) => a.severity === "CRITICAL").length;

  const high = alerts.filter((a) => a.severity === "HIGH").length;

  const medium = alerts.filter((a) => a.severity === "MEDIUM").length;

  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;

  const stats = [
    {
      label: "Critical",
      value: critical,
      color: "#ef4444",
    },
    {
      label: "High",
      value: high,
      color: "#f97316",
    },
    {
      label: "Medium",
      value: medium,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      style={{
        padding: "32px",
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #111827 0%, #050816 100%)",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "34px",
            fontWeight: 800,
            color: "#fff",
            margin: 0,
          }}
        >
          Fraud Alerts
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#94a3b8",
            marginTop: "8px",
          }}
        >
          {unacknowledged} unacknowledged alerts
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              borderRadius: "24px",
              padding: "24px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px)",
              boxShadow: `0 0 30px ${stat.color}25`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {stat.label}
            </p>

            <h2
              style={{
                margin: "12px 0 0",
                fontSize: "42px",
                fontWeight: 800,
                color: stat.color,
              }}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {alerts.map((alert) => {
          const severityColor =
            alert.severity === "CRITICAL"
              ? "#ef4444"
              : alert.severity === "HIGH"
                ? "#f97316"
                : "#f59e0b";

          return (
            <div
              key={alert.id}
              style={{
                borderRadius: "26px",
                padding: "24px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(18px)",
                opacity: alert.acknowledged ? 0.45 : 1,
                transition: "0.3s",
                borderLeft: `4px solid ${severityColor}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginBottom: "14px",
                    }}
                  >
                    <span
                      style={{
                        padding: "8px 14px",
                        borderRadius: "999px",
                        background: `${severityColor}20`,
                        color: severityColor,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {alert.severity}
                    </span>

                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                      }}
                    >
                      {alert.id}
                    </span>

                    <span
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                      }}
                    >
                      {alert.time}
                    </span>
                  </div>

                  <p
                    style={{
                      color: "#fff",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      marginBottom: "16px",
                    }}
                  >
                    {alert.reason}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      flexWrap: "wrap",
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    <span>
                      TX:{" "}
                      <a
                        href={`https://etherscan.io/tx/${alert.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#8b5cf6",
                          textDecoration: "none",
                          fontFamily: "monospace",
                        }}
                      >
                        {alert.transactionHash.slice(0, 12)}
                        ...
                      </a>
                    </span>

                    <span>Amount: {alert.amount} ETH</span>

                    <span>
                      From: {alert.from.slice(0, 6)}
                      ...
                      {alert.from.slice(-4)}
                    </span>
                  </div>
                </div>

                {!alert.acknowledged ? (
                  <button
                    onClick={() => acknowledge(alert.id)}
                    style={{
                      padding: "12px 18px",
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Acknowledge
                  </button>
                ) : (
                  <span
                    style={{
                      color: "#22c55e",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    ✓ Acknowledged
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
