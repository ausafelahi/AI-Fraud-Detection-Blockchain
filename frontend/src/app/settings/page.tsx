"use client";

import { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    etherscanKey: "••••••••••••••••••••",
    flaskUrl: process.env.NEXT_PUBLIC_FLASK_URL || "http://127.0.0.1:5000",
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
      ? `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.slice(0, 6)}••••••••••••${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS.slice(-4)}`
      : "",
    fraudThreshold: 70,
    suspiciousThreshold: 40,
    autoRefresh: true,
    refreshInterval: 2,
    notifications: true,
  });

  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: () => void;
  }) => (
    <div
      onClick={onChange}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "999px",
        background: value ? "var(--accent)" : "var(--bg-secondary)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: value ? "22px" : "3px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
        }}
      />
    </div>
  );

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0 }}>
          Settings
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginTop: "4px",
          }}
        >
          Configure API keys, thresholds, and system preferences
        </p>
      </div>

      <div
        style={{
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div className="card">
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "var(--text-primary)",
            }}
          >
            API Configuration
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {[
              {
                label: "Etherscan API Key",
                key: "etherscanKey",
                placeholder: "Your Etherscan API key",
              },
              {
                label: "Flask Backend URL",
                key: "flaskUrl",
                placeholder: "http://127.0.0.1:5000",
              },
              {
                label: "Smart Contract Address",
                key: "contractAddress",
                placeholder: "0x...",
              },
            ].map((field) => (
              <div key={field.key}>
                <label
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                    display: "block",
                  }}
                >
                  {field.label}
                </label>
                <input
                  value={(settings as any)[field.key]}
                  onChange={(e) =>
                    setSettings({ ...settings, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  style={{ fontFamily: "monospace", fontSize: "12px" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "var(--text-primary)",
            }}
          >
            Detection Thresholds
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {[
              {
                label: "Fraud Threshold",
                key: "fraudThreshold",
                min: 50,
                max: 95,
                color: "var(--danger)",
              },
              {
                label: "Suspicious Threshold",
                key: "suspiciousThreshold",
                min: 20,
                max: 69,
                color: "var(--warning)",
              },
              {
                label: "Refresh Interval (seconds)",
                key: "refreshInterval",
                min: 2,
                max: 60,
                color: "#8b5cf6",
              },
            ].map((s) => (
              <div key={s.key}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <label
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                  >
                    {s.label}
                  </label>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: s.color,
                    }}
                  >
                    {(settings as any)[s.key]}
                    {s.key !== "refreshInterval" ? "%" : "s"}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  value={(settings as any)[s.key]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      [s.key]: parseInt(e.target.value),
                    })
                  }
                  style={{
                    width: "100%",
                    accentColor: s.color,
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "var(--text-primary)",
            }}
          >
            System Preferences
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {[
              {
                label: "Auto Refresh",
                sub: "Automatically refresh live transaction feed",
                key: "autoRefresh",
              },
              {
                label: "Fraud Notifications",
                sub: "Show alerts for detected fraud",
                key: "notifications",
              },
            ].map((pref) => (
              <div
                key={pref.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {pref.label}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      marginTop: "2px",
                    }}
                  >
                    {pref.sub}
                  </p>
                </div>
                <Toggle
                  value={(settings as any)[pref.key]}
                  onChange={() =>
                    setSettings({
                      ...settings,
                      [pref.key]: !(settings as any)[pref.key],
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={save}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            background: saved ? "var(--success)" : "var(--accent)",
            color: "#fff",
            fontSize: "14px",
            border: "none",
            boxShadow: saved
              ? "0 0 16px rgba(16,185,129,0.3)"
              : "0 0 16px var(--accent-glow)",
            transition: "all 0.3s",
          }}
        >
          {saved ? "✓ Settings Saved" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
