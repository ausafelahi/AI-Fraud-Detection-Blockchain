"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  ShieldAlert,
  Wallet,
  Bot,
  FileClock,
  Settings,
  ChevronRight,
  BarChart3,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Live Transactions",
    href: "/live",
    icon: Activity,
  },
  {
    label: "Fraud Alerts",
    href: "/alerts",
    icon: ShieldAlert,
  },
  {
    label: "Wallet Analysis",
    href: "/wallet",
    icon: Wallet,
  },
  {
    label: "AI Workflows",
    href: "/workflows",
    icon: Bot,
  },
  {
    label: "Audit Trail",
    href: "/audit",
    icon: FileClock,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "270px",
        minHeight: "100vh",
        background: "rgba(10,15,30,0.92)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          padding: "28px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "16px",
              background: "linear-gradient(135deg,#8b5cf6 0%,#4f46e5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "18px",
              boxShadow: "0 0 30px rgba(139,92,246,0.4)",
            }}
          >
            F
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              FraudNet
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: "#94a3b8",
                fontSize: "12px",
              }}
            >
              Blockchain Intelligence
            </p>
          </div>
        </div>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "20px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: "18px",
                textDecoration: "none",
                transition: "all 0.25s ease",
                background: active
                  ? "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(79,70,229,0.12))"
                  : "transparent",
                border: active
                  ? "1px solid rgba(139,92,246,0.25)"
                  : "1px solid transparent",
                boxShadow: active ? "0 0 25px rgba(139,92,246,0.18)" : "none",
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: -14,
                    width: 4,
                    height: "60%",
                    borderRadius: 999,
                    background: "#8b5cf6",
                    boxShadow: "0 0 20px #8b5cf6",
                  }}
                />
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: active
                      ? "rgba(139,92,246,0.15)"
                      : "rgba(255,255,255,0.04)",
                    color: active ? "#c4b5fd" : "#94a3b8",
                  }}
                >
                  <Icon size={18} />
                </div>

                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: active ? 600 : 500,
                    color: active ? "#fff" : "#94a3b8",
                  }}
                >
                  {item.label}
                </span>
              </div>

              {active && <ChevronRight size={18} color="#c4b5fd" />}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            borderRadius: "22px",
            padding: "18px",
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(34,197,94,0.06))",
            border: "1px solid rgba(34,197,94,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 16px #22c55e",
              }}
            />

            <span
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Mainnet Online
            </span>
          </div>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            Fraud detection engines are actively scanning blockchain
            transactions in real time.
          </p>
        </div>
      </div>
    </aside>
  );
}
