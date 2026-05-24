"use client";

import { useState, useEffect } from "react";
import { getAuditRecords } from "@/lib/contract";

interface AuditRecord {
  transactionId: string;
  verdict: string;
  riskScore: number;
  timestamp: number;
  reportedBy: string;
}

export default function AuditPage() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAuditRecords();
        setRecords(data);
      } catch {
        setError(
          "Failed to load audit records. Make sure Hardhat node is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const fraud = records.filter((r) => r.verdict === "FRAUD").length;

  const legit = records.filter((r) => r.verdict === "LEGITIMATE").length;

  const stats = [
    {
      label: "Total Records",
      value: records.length,
      color: "#8b5cf6",
    },
    {
      label: "Fraud Cases",
      value: fraud,
      color: "#ef4444",
    },
    {
      label: "Legitimate",
      value: legit,
      color: "#22c55e",
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
          Audit Trail
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#94a3b8",
            marginTop: "8px",
          }}
        >
          Immutable on-chain fraud records
        </p>
      </div>

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            color: "#94a3b8",
            fontSize: "16px",
          }}
        >
          Loading blockchain records...
        </div>
      )}

      {error && (
        <div
          style={{
            borderRadius: "24px",
            padding: "22px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.15)",
            color: "#f87171",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div
          style={{
            borderRadius: "28px",
            padding: "60px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#fff",
              fontSize: "18px",
              marginBottom: "12px",
            }}
          >
            No records found on-chain yet.
          </p>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Spawn the Fraud Detector Agent in AI Workflows to log records.
          </p>
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <>
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
              borderRadius: "28px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    {[
                      "Transaction ID",
                      "Verdict",
                      "Risk Score",
                      "Timestamp",
                      "Reported By",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          textAlign: "left",
                          padding: "18px 22px",
                          color: "#94a3b8",
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {records.map((record, index) => (
                    <tr
                      key={index}
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <td
                        style={{
                          padding: "20px",
                          color: "#fff",
                          fontFamily: "monospace",
                          fontSize: "12px",
                        }}
                      >
                        {record.transactionId}
                      </td>

                      <td style={{ padding: "20px" }}>
                        <span
                          style={{
                            padding: "8px 14px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: 700,
                            background:
                              record.verdict === "FRAUD"
                                ? "rgba(239,68,68,0.15)"
                                : "rgba(34,197,94,0.15)",
                            color:
                              record.verdict === "FRAUD"
                                ? "#ef4444"
                                : "#22c55e",
                          }}
                        >
                          {record.verdict}
                        </span>
                      </td>

                      <td style={{ padding: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "90px",
                              height: "8px",
                              borderRadius: "999px",
                              background: "rgba(255,255,255,0.08)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${record.riskScore}%`,
                                height: "100%",
                                borderRadius: "999px",
                                background:
                                  record.riskScore > 50 ? "#ef4444" : "#22c55e",
                              }}
                            />
                          </div>

                          <span
                            style={{
                              color: "#fff",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {record.riskScore}%
                          </span>
                        </div>
                      </td>

                      <td
                        style={{
                          padding: "20px",
                          color: "#94a3b8",
                          fontSize: "12px",
                        }}
                      >
                        {new Date(record.timestamp * 1000).toLocaleString()}
                      </td>

                      <td
                        style={{
                          padding: "20px",
                          color: "#94a3b8",
                          fontFamily: "monospace",
                          fontSize: "12px",
                        }}
                      >
                        {record.reportedBy.slice(0, 6)}
                        ...
                        {record.reportedBy.slice(-4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
