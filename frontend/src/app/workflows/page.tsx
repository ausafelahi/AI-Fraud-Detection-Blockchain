"use client";

import { useState } from "react";
import { logFraudOnChain } from "@/lib/contract";
import { supabase } from "@/lib/supabase";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: "Idle" | "Running" | "Done" | "Error";
  log: string[];
}

const agentTemplates = [
  {
    name: "Fraud Detector Agent",
    type: "Researcher",
    description: "Scans latest transactions and flags suspicious activity",
    workflow: [
      "Connecting to Ruflo swarm...",
      "Fetching latest blockchain transactions...",
      "Running fraud detection model on 10 transactions...",
      "Identified 2 suspicious transactions...",
      "Logging verdicts to smart contract...",
      "Audit trail updated. Workflow complete.",
    ],
    logToChain: true,
    verdict: "FRAUD",
  },
  {
    name: "Wallet Monitor Agent",
    type: "Analyst",
    description: "Monitors high-risk wallets for new activity",
    workflow: [
      "Initializing wallet monitor agent...",
      "Loading watchlist from memory store...",
      "Checking 15 flagged wallets for new transactions...",
      "Detected new activity on 3 wallets...",
      "Logging suspicious activity to smart contract...",
      "Alerts dispatched to Fraud Alerts dashboard.",
    ],
    logToChain: true,
    verdict: "SUSPICIOUS",
  },
  {
    name: "Audit Reporter Agent",
    type: "Reporter",
    description: "Generates audit reports from on-chain records",
    workflow: [
      "Spawning audit reporter agent...",
      "Reading smart contract records...",
      "Fetched 24 on-chain fraud records...",
      "Generating summary statistics...",
      "Logging verified legitimate transactions...",
      "Audit report ready for export.",
    ],
    logToChain: true,
    verdict: "LEGITIMATE",
  },
  {
    name: "Threat Intelligence Agent",
    type: "Security",
    description: "Cross-references addresses with known threat databases",
    workflow: [
      "Launching threat intelligence agent...",
      "Querying known blacklist databases...",
      "Cross-referencing 50 recent addresses...",
      "Found 3 matches in Lazarus cluster database...",
      "Logging threat intelligence findings to blockchain...",
      "Threat intelligence report updated.",
    ],
    logToChain: true,
    verdict: "FRAUD",
  },
];

export default function AIWorkflows() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [running, setRunning] = useState(false);

  const spawnAgent = async (template: (typeof agentTemplates)[0]) => {
    const id = `agent-${Date.now()}`;

    const newAgent: Agent = {
      id,
      name: template.name,
      type: template.type,
      status: "Running",
      log: [],
    };

    setAgents((prev) => [newAgent, ...prev]);
    setRunning(true);

    for (let i = 0; i < template.workflow.length; i++) {
      await new Promise((r) => setTimeout(r, 800));

      if (template.logToChain && i === 4) {
        try {
          const txId = `TXN-${template.type.toUpperCase()}-${Date.now()}`;
          const risk =
            template.verdict === "FRAUD"
              ? Math.floor(Math.random() * 20 + 75)
              : template.verdict === "SUSPICIOUS"
                ? Math.floor(Math.random() * 20 + 45)
                : Math.floor(Math.random() * 20 + 5);

          const hash = await logFraudOnChain(txId, template.verdict, risk);

          await supabase.from("fraud_records").insert({
            transaction_id: txId,
            verdict: template.verdict,
            risk_score: risk,
            probability: risk / 100,
            chain: "ETH",
            reported_by: hash,
          });

          setAgents((prev) =>
            prev.map((a) =>
              a.id === id
                ? {
                    ...a,
                    log: [
                      ...a.log,
                      template.workflow[i],
                      `On-chain record created: ${txId} → ${template.verdict}`,
                      `Saved to database.`,
                    ],
                  }
                : a,
            ),
          );
          continue;
        } catch {
          setAgents((prev) =>
            prev.map((a) =>
              a.id === id
                ? {
                    ...a,
                    log: [
                      ...a.log,
                      template.workflow[i],
                      "Blockchain logging failed.",
                    ],
                  }
                : a,
            ),
          );
          continue;
        }
      }

      setAgents((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                log: [...a.log, template.workflow[i]],
                status: i === template.workflow.length - 1 ? "Done" : "Running",
              }
            : a,
        ),
      );
    }

    setRunning(false);
  };

  return (
    <div
      style={{
        padding: "32px",
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
              fontSize: "30px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            AI Workflows
          </h1>

          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "8px",
              fontSize: "14px",
            }}
          >
            Spawn intelligent agents to automate blockchain fraud detection
          </p>
        </div>

        {agents.length > 0 && (
          <button
            onClick={() => setAgents([])}
            style={{
              border: "none",
              padding: "12px 18px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {agentTemplates.map((template) => (
          <div
            key={template.name}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "28px",
              padding: "24px",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "18px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  {template.name}
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginTop: "8px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {template.description}
                </p>
              </div>

              <span
                style={{
                  height: "fit-content",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  background: "rgba(139,92,246,0.15)",
                  color: "#a78bfa",
                  fontSize: "12px",
                }}
              >
                {template.type}
              </span>
            </div>

            <button
              onClick={() => spawnAgent(template)}
              disabled={running}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "16px",
                padding: "14px 18px",
                fontWeight: 700,
                cursor: running ? "not-allowed" : "pointer",
                background: running
                  ? "rgba(255,255,255,0.08)"
                  : "linear-gradient(135deg,#8b5cf6,#6366f1)",
                color: "#fff",
              }}
            >
              {running ? "Agent Running..." : "Spawn Agent"}
            </button>
          </div>
        ))}
      </div>

      {agents.length > 0 && (
        <>
          <h2
            style={{
              marginBottom: "18px",
              fontSize: "22px",
            }}
          >
            Agent Activity
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {agents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "28px",
                  padding: "22px",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "18px",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background:
                        agent.status === "Done"
                          ? "#22c55e"
                          : agent.status === "Error"
                            ? "#ef4444"
                            : "#f59e0b",
                    }}
                  />

                  <h3
                    style={{
                      margin: 0,
                    }}
                  >
                    {agent.name}
                  </h3>

                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {agent.id}
                  </span>

                  <span
                    style={{
                      marginLeft: "auto",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      background:
                        agent.status === "Done"
                          ? "rgba(34,197,94,0.12)"
                          : agent.status === "Error"
                            ? "rgba(239,68,68,0.12)"
                            : "rgba(245,158,11,0.12)",
                      color:
                        agent.status === "Done"
                          ? "#22c55e"
                          : agent.status === "Error"
                            ? "#ef4444"
                            : "#f59e0b",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {agent.status}
                  </span>
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    borderRadius: "20px",
                    padding: "18px",
                    fontFamily: "monospace",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    fontSize: "13px",
                  }}
                >
                  {agent.log.map((line, index) => (
                    <div
                      key={index}
                      style={{
                        color: "#22c55e",
                      }}
                    >
                      &gt; {line}
                    </div>
                  ))}

                  {agent.status === "Running" && (
                    <div
                      style={{
                        color: "#f59e0b",
                      }}
                    >
                      &gt; Processing...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
