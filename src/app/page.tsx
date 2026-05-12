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
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="7" width="2.5" height="6" fill="white" rx="0.5" />
              <rect x="5" y="4" width="2.5" height="9" fill="white" rx="0.5" />
              <rect x="9" y="1" width="2.5" height="12" fill="white" rx="0.5" />
            </svg>
          </div>
          <span className="text-sm font-medium tracking-tight">DashboardIntel</span>
        </div>
        <span className="text-xs text-slate-500 font-medium tracking-widest uppercase">
          Executive Analysis
        </span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {!submitted ? (
          <>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-blue-400 text-xs font-medium">AI-powered · GPT-4o</span>
              </div>
              <h1 className="text-3xl font-medium tracking-tight text-white leading-snug mb-4">
                Turn your dashboard into<br />
                <span className="text-blue-400">executive-ready narrative</span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Upload a dashboard screenshot or PDF report. DashboardIntel reads the data,
                understands your audience, and returns sharp analysis that leadership can act on.
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