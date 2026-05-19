"use client";

import { useState, useRef } from "react";

const AUDIENCES = [
  "CFO / Finance",
  "CPO / Product",
  "CEO / Board",
  "Marketing Lead",
  "General Executive",
];

const FORMATS = [
  { value: "One-Page Brief", description: "One paragraph + key bullets + action line" },
  { value: "Bullet Highlights", description: "Grouped bullets by theme, no intro or conclusion" },
  { value: "Structured Narrative", description: "Executive summary + flexible sections" },
];

interface UploadFormProps {
  onResult: (analysis: string) => void;
  onLoading: (loading: boolean) => void;
  loading: boolean;
  onAudienceChange: (audience: string) => void;
  onFormatChange: (format: string) => void;
}

export default function UploadForm({
  onResult,
  onLoading,
  loading,
  onAudienceChange,
  onFormatChange,
}: UploadFormProps) {
  const [audience, setAudience] = useState("");
  const [context, setContext] = useState("");
  const [format, setFormat] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!validTypes.includes(f.type)) {
      setError("Only PNG, JPG, or PDF files are supported.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleSubmit = async () => {
    if (!audience || !format || !file) {
      setError("Please select an audience, report format, and upload a file.");
      return;
    }
    setError("");
    onLoading(true);
    const formData = new FormData();
    formData.append("audience", audience);
    formData.append("context", context);
    formData.append("format", format);
    formData.append("file", file);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        onLoading(false);
        return;
      }
      onResult(data.analysis);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      onLoading(false);
    }
  };

  const goldBorder = "1px solid rgba(201,168,76,0.2)";
  const goldBorderActive = "1px solid rgba(201,168,76,0.7)";
  const bgSecondary = "#1A1510";
  const bgTertiary = "#231D16";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* File Upload */}
      <div>
        <label style={{
          display: "block", fontSize: "10px", fontWeight: 500,
          letterSpacing: "0.12em", color: "#9C8A6E", marginBottom: "0.75rem"
        }}>
          DASHBOARD OR REPORT
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: dragOver ? goldBorderActive : file ? "1px solid rgba(201,168,76,0.4)" : goldBorder,
            borderStyle: "dashed",
            borderRadius: "12px",
            padding: "3rem 2rem",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: dragOver ? "rgba(201,168,76,0.05)" : file ? "rgba(201,168,76,0.03)" : bgSecondary,
            transition: "all 0.2s",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {/* Upload icon */}
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            border: "1px solid rgba(201,168,76,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem"
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 5l3-3 3 3M2 11v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          {file ? (
            <div>
              <p style={{ color: "#C9A84C", fontSize: "13px", fontWeight: 500 }}>{file.name}</p>
              <p style={{ color: "#5C4F3A", fontSize: "11px", marginTop: "4px" }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: "#9C8A6E", fontSize: "13px" }}>Place your dashboard here</p>
              <p style={{ color: "#5C4F3A", fontSize: "11px", marginTop: "4px" }}>PNG · JPG · PDF · UP TO 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Audience */}
      <div>
        <label style={{
          display: "block", fontSize: "10px", fontWeight: 500,
          letterSpacing: "0.12em", color: "#9C8A6E", marginBottom: "0.75rem"
        }}>
          WHO IS THIS FOR?
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {AUDIENCES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => { setAudience(a); onAudienceChange(a); }}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: audience === a ? goldBorderActive : goldBorder,
                backgroundColor: audience === a ? "rgba(201,168,76,0.08)" : bgSecondary,
                color: audience === a ? "#C9A84C" : "#9C8A6E",
                fontSize: "12px",
                fontWeight: audience === a ? 500 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <label style={{
          display: "block", fontSize: "10px", fontWeight: 500,
          letterSpacing: "0.12em", color: "#9C8A6E", marginBottom: "0.75rem"
        }}>
          REPORT FORMAT
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => { setFormat(f.value); onFormatChange(f.value); }}
              style={{
                padding: "14px 16px",
                borderRadius: "8px",
                border: format === f.value ? goldBorderActive : goldBorder,
                backgroundColor: format === f.value ? "rgba(201,168,76,0.08)" : bgSecondary,
                color: "#F5EDE0",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              <p style={{ fontWeight: 500, color: format === f.value ? "#C9A84C" : "#F5EDE0", margin: 0 }}>
                {f.value}
              </p>
              <p style={{ fontSize: "11px", color: "#5C4F3A", margin: "4px 0 0" }}>
                {f.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Context */}
      <div>
        <label style={{
          display: "block", fontSize: "10px", fontWeight: 500,
          letterSpacing: "0.12em", color: "#9C8A6E", marginBottom: "0.75rem"
        }}>
          CONTEXT <span style={{ color: "#5C4F3A", fontSize: "10px", fontWeight: 400, letterSpacing: 0 }}>(recommended)</span>
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
          placeholder="e.g. This is our Q3 performance dashboard. We ran a promo campaign in week 2. The team is concerned about churn in the enterprise segment..."
          style={{
            width: "100%",
            backgroundColor: bgSecondary,
            border: goldBorder,
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "13px",
            color: "#C9A84C",
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            lineHeight: 1.6,
          }}
          onFocus={(e) => e.target.style.border = goldBorderActive}
          onBlur={(e) => e.target.style.border = goldBorder}
        />
      </div>

      {error && (
        <p style={{ color: "#E8643A", fontSize: "13px", margin: 0 }}>{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "10px",
          border: "none",
          background: loading ? "#2A2218" : "linear-gradient(135deg, #C9A84C, #A07830)",
          color: loading ? "#5C4F3A" : "#0E0B08",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {loading ? "ANALYSING..." : "GENERATE THE ANALYSIS"}
      </button>
    </div>
  );
}