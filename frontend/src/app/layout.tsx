import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "FraudNet - Fraud Defense Grid",
  description: "Real-time blockchain fraud detection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 min-h-screen overflow-auto">{children}</div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
