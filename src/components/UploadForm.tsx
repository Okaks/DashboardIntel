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

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs font-medium tracking-widest text-slate-400 uppercase mb-3">
          Dashboard or Report
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-blue-500 bg-blue-500/10"
              : file
              ? "border-blue-500/50 bg-blue-500/5"
              : "border-slate-700 hover:border-slate-500"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <div>
              <p className="text-blue-400 font-medium text-sm">{file.name}</p>
              <p className="text-slate-500 text-xs mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
              </p>
            </div>
          ) : (
            <div>
              <p className="text-slate-400 text-sm">Drop your dashboard screenshot or PDF here</p>
              <p className="text-slate-600 text-xs mt-2">PNG, JPG, PDF supported</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium tracking-widest text-slate-400 uppercase mb-3">
          Who is this report for?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AUDIENCES.map((a) => (
            <button
              key={a}
              onClick={() => { setAudience(a); onAudienceChange(a); }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                audience === a
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium tracking-widest text-slate-400 uppercase mb-3">
          Report format
        </label>
        <div className="space-y-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFormat(f.value); onFormatChange(f.value); }}
              className={`w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-150 ${
                format === f.value
                  ? "bg-blue-600/10 border-blue-500 text-white"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              <p className={`text-sm font-medium ${format === f.value ? "text-blue-400" : ""}`}>
                {f.value}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{f.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium tracking-widest text-slate-400 uppercase mb-3">
          Context <span className="text-slate-600 normal-case tracking-normal">(recommended)</span>
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
          placeholder="e.g. This is our Q3 performance dashboard. We ran a promo campaign in week 2. The team is concerned about churn in the enterprise segment..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none transition-colors"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium text-sm tracking-wide transition-all duration-200"
      >
        {loading ? "Analysing..." : "Generate Executive Analysis"}
      </button>
    </div>
  );
}