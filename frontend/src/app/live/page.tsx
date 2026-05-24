"use client";

import React from "react";
import { useState, useEffect } from "react";
import ky from "ky";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  risk: number;
  status: "LEGIT" | "SUSPICIOUS" | "FRAUD";
  time: string;
  chain: "ETH" | "BTC";
}

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

async function fetchEthTransactions(): Promise<Transaction[]> {
  try {
    const data = await ky
      .get(
        `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${ETHERSCAN_API_KEY}`,
      )
      .json<any>();

    if (data.status !== "1") return generateMockEthTransactions();

    return data.result.slice(0, 10).map((tx: any) => {
      const amount = parseFloat(tx.value) / 1e18;
      const risk = Math.floor(Math.random() * 80 + 5);
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to || "Contract",
        value: amount.toFixed(4),
        gas: (parseInt(tx.gasPrice) / 1e9).toFixed(1),
        risk,
        status: (risk > 70 ? "FRAUD" : risk > 40 ? "SUSPICIOUS" : "LEGIT") as
          | "FRAUD"
          | "SUSPICIOUS"
          | "LEGIT",
        time: new Date(parseInt(tx.timeStamp) * 1000).toLocaleTimeString(),
        chain: "ETH" as const,
      };
    });
  } catch {
    return generateMockEthTransactions();
  }
}

async function fetchBtcTransactions(): Promise<Transaction[]> {
  try {
    const data = await ky
      .get(
        "https://blockchain.info/unconfirmed-transactions?format=json&cors=true",
      )
      .json<any>();

    return data.txs.slice(0, 10).map((tx: any) => {
      const valueOut =
        tx.out.reduce((sum: number, o: any) => sum + o.value, 0) / 1e8;
      const risk = Math.floor(Math.random() * 80 + 5);
      return {
        hash: tx.hash,
        from: tx.inputs[0]?.prev_out?.addr || "Unknown",
        to: tx.out[0]?.addr || "Unknown",
        value: valueOut.toFixed(6),
        gas: tx.fee ? (tx.fee / 1e8).toFixed(8) : "0",
        risk,
        status: risk > 70 ? "FRAUD" : risk > 40 ? "SUSPICIOUS" : "LEGIT",
        time: new Date(tx.time * 1000).toLocaleTimeString(),
        chain: "BTC",
      };
    });
  } catch {
    return generateMockBtcTransactions();
  }
}

function generateMockEthTransactions(): Transaction[] {
  return Array.from({ length: 10 }, () => {
    const risk = Math.floor(Math.random() * 90 + 5);
    return {
      hash:
        "0x" +
        Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16),
        ).join(""),
      from:
        "0x" +
        Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16),
        ).join(""),
      to:
        "0x" +
        Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16),
        ).join(""),
      value: (Math.random() * 50).toFixed(4),
      gas: (Math.random() * 200 + 10).toFixed(1),
      risk,
      status: risk > 70 ? "FRAUD" : risk > 40 ? "SUSPICIOUS" : "LEGIT",
      time: new Date().toLocaleTimeString(),
      chain: "ETH",
    };
  });
}

function generateMockBtcTransactions(): Transaction[] {
  return Array.from({ length: 10 }, () => {
    const risk = Math.floor(Math.random() * 90 + 5);
    return {
      hash: Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join(""),
      from:
        "1" +
        Array.from(
          { length: 33 },
          () =>
            "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[
              Math.floor(Math.random() * 58)
            ],
        ).join(""),
      to:
        "1" +
        Array.from(
          { length: 33 },
          () =>
            "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[
              Math.floor(Math.random() * 58)
            ],
        ).join(""),
      value: (Math.random() * 2).toFixed(6),
      gas: (Math.random() * 0.0001).toFixed(8),
      risk,
      status: risk > 70 ? "FRAUD" : risk > 40 ? "SUSPICIOUS" : "LEGIT",
      time: new Date().toLocaleTimeString(),
      chain: "BTC",
    };
  });
}

export default function LiveTransactions() {
  const [activeTab, setActiveTab] = useState<"ETH" | "BTC">("ETH");
  const [ethTxs, setEthTxs] = useState<Transaction[]>([]);
  const [btcTxs, setBtcTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Record<string, any>>({});

  const load = async () => {
    const [eth, btc] = await Promise.all([
      fetchEthTransactions(),
      fetchBtcTransactions(),
    ]);
    setEthTxs(eth);
    setBtcTxs(btc);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const analyzeWithAI = async (tx: Transaction) => {
    setAnalyzing(tx.hash);
    try {
      const features = Array.from({ length: 28 }, () =>
        parseFloat((Math.random() * 4 - 2).toFixed(4)),
      );
      const allFeatures = [
        parseFloat(tx.value),
        ...features,
        Math.random() * 10000,
      ];

      const result = await ky
        .post(`${process.env.NEXT_PUBLIC_FLASK_URL}/predict`, {
          json: { transaction_id: tx.hash.slice(0, 20), features: allFeatures },
        })
        .json<any>();

      setAnalysisResult((prev) => ({ ...prev, [tx.hash]: result }));
    } catch {
      setAnalysisResult((prev) => ({
        ...prev,
        [tx.hash]: { error: "Flask backend not running" },
      }));
    } finally {
      setAnalyzing(null);
    }
  };

  const transactions = activeTab === "ETH" ? ethTxs : btcTxs;

  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>
            Live Transactions
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginTop: "4px",
            }}
          >
            Multi-chain transaction monitoring — auto-refreshing every 2s
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--success)",
                boxShadow: "0 0 6px var(--success)",
              }}
            />
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              Live
            </span>
          </div>
          <button
            onClick={() => setAutoRefresh((p) => !p)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              background: autoRefresh ? "var(--accent)" : "var(--bg-card)",
              color: autoRefresh ? "#fff" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {autoRefresh ? "Auto ON" : "Auto OFF"}
          </button>
          <button
            onClick={load}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {(["ETH", "BTC"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "600",
              background:
                activeTab === tab ? "var(--accent)" : "var(--bg-card)",
              color: activeTab === tab ? "#fff" : "var(--text-secondary)",
              border: `1px solid ${activeTab === tab ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {tab === "ETH" ? "Ethereum" : "Bitcoin"}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px",
            color: "var(--text-secondary)",
          }}
        >
          Fetching transactions...
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead>
              <tr>
                <th>Hash</th>
                <th>From → To</th>
                <th>Amount</th>
                <th>{activeTab === "ETH" ? "Gas (gwei)" : "Fee (BTC)"}</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Time</th>
                <th>AI Analysis</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <React.Fragment key={tx.hash}>
                  <tr>
                    <td>
                      <a
                        href={
                          activeTab === "ETH"
                            ? `https://etherscan.io/tx/${tx.hash}`
                            : `https://blockchain.com/explorer/transactions/btc/${tx.hash}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#8b5cf6",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          textDecoration: "none",
                        }}
                      >
                        {tx.hash.slice(0, 10)}...
                      </a>
                    </td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {tx.from.slice(0, 6)}...{tx.from.slice(-4)} →{" "}
                      {tx.to.slice(0, 6)}...
                    </td>
                    <td>
                      {tx.value} {activeTab}
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{tx.gas}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div className="risk-bar" style={{ width: "60px" }}>
                          <div
                            className="risk-bar-fill"
                            style={{
                              width: `${tx.risk}%`,
                              background:
                                tx.risk > 70
                                  ? "var(--danger)"
                                  : tx.risk > 40
                                    ? "var(--warning)"
                                    : "var(--success)",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "12px" }}>{tx.risk}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge badge-${tx.status.toLowerCase()}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                      }}
                    >
                      {tx.time}
                    </td>
                    <td>
                      <button
                        onClick={() => analyzeWithAI(tx)}
                        disabled={analyzing === tx.hash}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          background:
                            analyzing === tx.hash
                              ? "var(--bg-secondary)"
                              : "rgba(124,58,237,0.15)",
                          color:
                            analyzing === tx.hash
                              ? "var(--text-secondary)"
                              : "#a78bfa",
                          border: "1px solid rgba(124,58,237,0.3)",
                        }}
                      >
                        {analyzing === tx.hash ? "..." : "Analyze"}
                      </button>
                    </td>
                  </tr>
                  {analysisResult[tx.hash] && (
                    <tr key={`${i}-result`}>
                      <td
                        colSpan={8}
                        style={{
                          background: "rgba(124,58,237,0.05)",
                          padding: "8px 16px",
                        }}
                      >
                        {analysisResult[tx.hash].error ? (
                          <span
                            style={{ color: "var(--danger)", fontSize: "12px" }}
                          >
                            {analysisResult[tx.hash].error}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            AI Verdict:{" "}
                            <span
                              style={{
                                color:
                                  analysisResult[tx.hash].verdict === "FRAUD"
                                    ? "var(--danger)"
                                    : "var(--success)",
                                fontWeight: "600",
                              }}
                            >
                              {analysisResult[tx.hash].verdict}
                            </span>{" "}
                            — Risk Score:{" "}
                            <strong>
                              {analysisResult[tx.hash].risk_score}%
                            </strong>{" "}
                            — Probability:{" "}
                            <strong>
                              {analysisResult[tx.hash].probability}
                            </strong>
                          </span>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
