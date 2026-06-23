"use client";

import { downloadWord, downloadPDF, downloadPPT, cleanForDisplay } from "../lib/downloads";

interface AnalysisResultProps {
  analysis: string;
  audience: string;
  format: string;
  onReset: () => void;
}

export default function AnalysisResult({
  analysis,
  audience,
  format,
  onReset,
}: AnalysisResultProps) {
  const handleCopy = () => navigator.clipboard.writeText(analysis);

  const goldBorder = "1px solid rgba(201,168,76,0.2)";

  const formatAnalysis = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const clean = line.replace(/\*\*/g, "").replace(/^#+\s/, "");

      if (
        line.startsWith("## ") ||
        line.startsWith("# ") ||
        ["EXECUTIVE SUMMARY", "KEY FINDINGS", "AREAS OF CONCERN",
         "OPPORTUNITIES", "RECOMMENDED WATCH AREAS", "FORWARD-LOOKING STATEMENTS",
         "Executive Summary", "Key Findings", "Areas of Concern",
         "Opportunities", "Recommended Watch Areas", "Forward-Looking Statements",
        ].some(h => clean.trim().startsWith(h))
      ) {
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", margin: "2rem 0 0.75rem" }}>
            <div style={{ width: "20px", height: "1px", backgroundColor: "#C9A84C" }} />
            <p style={{ fontSize: "10px", color: "#C9A84C", fontWeight: 600, letterSpacing: "0.12em", margin: 0 }}>
              {clean.trim().toUpperCase()}
            </p>
          </div>
        );
      }
      if (line.startsWith("- ") || line.startsWith("• ") || line.startsWith("› ")) {
        return (
          <div key={i} style={{ display: "flex", gap: "12px", margin: "6px 0" }}>
            <span style={{ color: "#C9A84C", marginTop: "2px", flexShrink: 0 }}>›</span>
            <p style={{ color: "#9C8A6E", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
              {clean.replace(/^[-•›]\s/, "")}
            </p>
          </div>
        );
      }
      if (line.trim() === "") return <div key={i} style={{ height: "6px" }} />;
      return (
        <p key={i} style={{ color: "#9C8A6E", fontSize: "13px", lineHeight: 1.7, margin: "4px 0" }}>
          {clean}
        </p>
      );
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingBottom: "1rem", borderBottom: goldBorder, flexWrap: "wrap", gap: "12px"
      }}>
        <div>
          <p style={{ fontSize: "10px", color: "#C9A84C", letterSpacing: "0.12em", fontWeight: 600, margin: 0 }}>
            THE ANALYSIS
          </p>
          <p style={{ fontSize: "12px", color: "#5C4F3A", margin: "4px 0 0" }}>
            {audience} · {format}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={handleCopy} style={btnStyle}>COPY</button>
          <button onClick={() => downloadPDF(analysis, audience, format)} style={btnStyle}>PDF</button>
          <button onClick={() => downloadWord(analysis, audience, format)} style={btnStyle}>WORD</button>
          <button onClick={() => downloadPPT(analysis, audience, format)} style={btnStyle}>PPT</button>
          <button onClick={onReset} style={{ ...btnStyle, borderColor: "rgba(201,168,76,0.4)", color: "#C9A84C" }}>
            NEW
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        backgroundColor: "#1A1510",
        border: goldBorder,
        borderRadius: "12px",
        padding: "1.5rem",
      }}>
        {formatAnalysis(analysis)}
      </div>

      {/* Footer */}
      <p style={{ fontSize: "11px", color: "#5C4F3A", textAlign: "center", margin: 0 }}>
        DashboardIntel · For internal use only · Not financial or legal advice
      </p>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "6px 14px",
  borderRadius: "6px",
  border: "1px solid rgba(201,168,76,0.2)",
  backgroundColor: "transparent",
  color: "#9C8A6E",
  fontSize: "11px",
  fontWeight: 500,
  cursor: "pointer",
  letterSpacing: "0.05em",
};