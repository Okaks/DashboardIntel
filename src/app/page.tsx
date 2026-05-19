"use client";

import { useState } from "react";
import UploadForm from "../components/UploadForm";
import AnalysisResult from "../components/AnalysisResult";

export default function Home() {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [audience, setAudience] = useState("");
  const [format, setFormat] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleResult = (result: string) => {
    setAnalysis(result);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnalysis("");
    setSubmitted(false);
    setAudience("");
    setFormat("");
  };

  return (
    <main style={{ backgroundColor: "#0E0B08", minHeight: "100vh", color: "#F5EDE0" }}>
      {/* Nav */}
      <nav style={{
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "6px",
            background: "linear-gradient(135deg, #C9A84C, #A07830)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="7" width="2.5" height="6" fill="#0E0B08" rx="0.5" />
              <rect x="5" y="4" width="2.5" height="9" fill="#0E0B08" rx="0.5" />
              <rect x="9" y="1" width="2.5" height="12" fill="#0E0B08" rx="0.5" />
            </svg>
          </div>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#F5EDE0", letterSpacing: "-0.01em" }}>
            DashboardIntel
          </span>
        </div>
        <span style={{ fontSize: "11px", color: "#9C8A6E", fontWeight: 500, letterSpacing: "0.1em" }}>
          AI · DASHBOARD INTELLIGENCE
        </span>
      </nav>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        {!submitted ? (
          <>
            {/* Hero */}
            <div style={{ marginBottom: "3rem", textAlign: "center" }}>
              <p style={{
                fontSize: "11px", color: "#C9A84C", letterSpacing: "0.15em",
                fontWeight: 500, marginBottom: "1.5rem"
              }}>
                DASHBOARD INTELLIGENCE
              </p>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 700,
                color: "#F5EDE0",
                lineHeight: 1.2,
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em"
              }}>
                Every number<br />has a <em style={{ color: "#C9A84C", fontStyle: "italic" }}>story.</em>
              </h1>
              <p style={{
                fontSize: "13px", color: "#9C8A6E",
                fontStyle: "italic", marginBottom: "1.5rem"
              }}>
                We tell it beautifully.
              </p>
              <p style={{
                fontSize: "13px", color: "#9C8A6E",
                lineHeight: 1.7, maxWidth: "420px", margin: "0 auto"
              }}>
                Upload any dashboard — screenshot or PDF. Receive a structured,
                executive-ready analysis crafted for every stakeholder in your organisation.
              </p>
            </div>

            <UploadForm
              onResult={handleResult}
              onLoading={(l: boolean) => setLoading(l)}
              loading={loading}
              onAudienceChange={setAudience}
              onFormatChange={setFormat}
            />
          </>
        ) : (
          <AnalysisResult
            analysis={analysis}
            audience={audience}
            format={format}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}