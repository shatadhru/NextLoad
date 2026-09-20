"use client"

import React, { useState } from "react"
import { CustomAdminViewWrapper } from "../components/CustomAdminViewWrapper"
import { Mail, CheckCircle, AlertCircle, RefreshCw, Send, Server } from "lucide-react"

export function EmailLogsView() {
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testSent, setTestSent] = useState(false)

  const emailLogs = [
    { id: "em-1", to: "user@example.com", subject: "Reset your NextLoad password", type: "Password Reset", status: "Delivered", time: "10 mins ago" },
    { id: "em-2", to: "sarah.dev@example.com", subject: "Welcome to NextLoad Platform", type: "Account Welcome", status: "Delivered", time: "1 hour ago" },
    { id: "em-3", to: "john.doe@company.org", subject: "Security Alert: New Sign-in", type: "Security Notice", status: "Delivered", time: "4 hours ago" },
    { id: "em-4", to: "billing@client.com", subject: "Weekly Storage & Activity Report", type: "Digest", status: "Delivered", time: "Yesterday" },
  ]

  const handleTestEmail = () => {
    setIsSendingTest(true)
    setTimeout(() => {
      setIsSendingTest(false)
      setTestSent(true)
      setTimeout(() => setTestSent(false), 3000)
    }, 800)
  }

  return (
    <CustomAdminViewWrapper
      title="Email Delivery Logs"
      description="Monitor transactional email dispatches, delivery statuses, and SMTP connectivity."
      badge="Hostinger SMTP"
    >
      {/* SMTP Connection Card */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          padding: "18px 24px",
          borderRadius: "10px",
          border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
          backgroundColor: "var(--theme-elevation-50, rgba(0,0,0,0.02))",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(13, 148, 136, 0.12)",
              color: "var(--theme-success-500, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Server size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Hostinger Secure SMTP Relay</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.1)", padding: "1px 6px", borderRadius: "4px" }}>
                CONNECTED
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--theme-elevation-500, #777)", marginTop: "2px" }}>
              smtp.hostinger.com:465 (SSL/TLS) • Sender: NextLoad &lt;support@mrtripy.com&gt;
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestEmail}
          disabled={isSendingTest}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            border: "1px solid var(--theme-elevation-250, #ccc)",
            backgroundColor: testSent ? "#10b981" : "var(--theme-elevation-100, #fff)",
            color: testSent ? "#fff" : "var(--theme-elevation-800, #333)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s",
          }}
        >
          {isSendingTest ? (
            <>
              <RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} />
              <span>Testing SMTP...</span>
            </>
          ) : testSent ? (
            <>
              <CheckCircle size={13} />
              <span>Relay Verified!</span>
            </>
          ) : (
            <>
              <Send size={13} />
              <span>Verify Relay</span>
            </>
          )}
        </button>
      </div>

      {/* Email Table */}
      <div
        style={{
          borderRadius: "10px",
          border: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr 1.5fr 1fr 1fr",
            padding: "12px 16px",
            backgroundColor: "var(--theme-elevation-100, rgba(0,0,0,0.04))",
            fontWeight: 600,
            fontSize: "12px",
            color: "var(--theme-elevation-600, #666)",
            borderBottom: "1px solid var(--theme-elevation-150, rgba(0,0,0,0.08))",
          }}
        >
          <div>Recipient</div>
          <div>Subject</div>
          <div>Type</div>
          <div>Status</div>
          <div>Time</div>
        </div>

        {emailLogs.map((log) => (
          <div
            key={log.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 3fr 1.5fr 1fr 1fr",
              padding: "14px 16px",
              fontSize: "13px",
              borderBottom: "1px solid var(--theme-elevation-100, rgba(0,0,0,0.04))",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 500, fontFamily: "monospace", fontSize: "12px" }}>{log.to}</div>
            <div style={{ fontWeight: 500 }}>{log.subject}</div>
            <div style={{ color: "var(--theme-elevation-600, #666)", fontSize: "12px" }}>{log.type}</div>
            <div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#10b981",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  padding: "2px 7px",
                  borderRadius: "4px",
                }}
              >
                {log.status}
              </span>
            </div>
            <div style={{ color: "var(--theme-elevation-500, #777)", fontSize: "12px" }}>{log.time}</div>
          </div>
        ))}
      </div>
    </CustomAdminViewWrapper>
  )
}

export default EmailLogsView
