// ============================================================
//  AI Resume Matcher — React Frontend
//  App.jsx  (single-file, no extra dependencies needed)
//
//  HOW TO USE:
//  1. npx create-react-app resume-matcher
//  2. Replace src/App.jsx with this file
//  3. Replace src/App.css with the CSS below (or put it in <style>)
//  4. Make sure Flask is running on http://localhost:5000
//  5. npm start
// ============================================================

import { useState, useRef, useCallback } from "react";

// ── Inline styles (no separate CSS file needed) ─────────────────────────────
const S = {
  // Layout
  app: {
    minHeight: "100vh",
    background: "#0a0a0b",
    color: "#e8e6e0",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    padding: "0",
  },
  header: {
    borderBottom: "1px solid #1e1e22",
    padding: "20px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoRow: { display: "flex", alignItems: "center", gap: "10px" },
  logoDot: {
    width: "8px", height: "8px",
    borderRadius: "50%", background: "#4ade80",
    boxShadow: "0 0 8px #4ade8088",
  },
  logoText: {
    fontSize: "13px", fontWeight: "500",
    color: "#e8e6e0", letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  headerTag: {
    fontSize: "11px", color: "#555",
    letterSpacing: "0.08em", textTransform: "uppercase",
  },

  main: {
    maxWidth: "960px", margin: "0 auto",
    padding: "48px 40px",
  },

  // Hero
  heroLabel: {
    fontSize: "11px", color: "#4ade80",
    letterSpacing: "0.14em", textTransform: "uppercase",
    marginBottom: "12px",
  },
  heroTitle: {
    fontSize: "38px", fontWeight: "300",
    color: "#f0ede6", lineHeight: "1.2",
    letterSpacing: "-0.02em", marginBottom: "12px",
    fontFamily: "'DM Serif Display', 'Georgia', serif",
  },
  heroSub: {
    fontSize: "14px", color: "#666",
    lineHeight: "1.7", marginBottom: "48px",
  },

  // Two-column layout
  cols: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  // Input panels
  panel: {
    background: "#111113",
    border: "1px solid #1e1e22",
    borderRadius: "10px",
    padding: "24px",
  },
  panelLabel: {
    fontSize: "11px", color: "#cccccc",
    letterSpacing: "0.1em", textTransform: "uppercase",
    marginBottom: "16px", display: "flex",
    alignItems: "center", gap: "8px",
  },
  panelNum: {
    width: "18px", height: "18px",
    borderRadius: "50%", background: "#1a1a1e",
    border: "1px solid #2a2a30",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "10px", color: "#777",
  },

  // Drop zone
  dropzone: (active, hasFile) => ({
    border: `1.5px dashed ${active ? "#4ade80" : hasFile ? "#2a4a2a" : "#252528"}`,
    borderRadius: "8px",
    padding: "32px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    background: active ? "#0d1a0d" : hasFile ? "#0a150a" : "transparent",
  }),
  dropIcon: {
    fontSize: "28px", marginBottom: "10px",
    display: "block", color: "#333",
  },
  dropText: { fontSize: "13px", color: "#555", lineHeight: "1.6" },
  dropHighlight: { color: "#4ade80", cursor: "pointer" },
  fileInfo: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 14px",
    background: "#0d1a0d",
    borderRadius: "6px", marginTop: "12px",
    border: "1px solid #1a3a1a",
  },
  fileName: { fontSize: "12px", color: "#4ade80", flex: 1 },
  fileSize: { fontSize: "11px", color: "#3a5a3a" },
  removeBtn: {
    background: "none", border: "none",
    color: "#3a5a3a", cursor: "pointer",
    fontSize: "16px", padding: "0 2px",
    lineHeight: 1,
  },

  // Textarea
  textarea: {
    width: "100%", minHeight: "168px",
    background: "#0d0d0f",
    border: "1px solid #252528",
    borderRadius: "8px",
    color: "#e8e6e0",
    fontFamily: "'DM Mono', monospace",
    fontSize: "12px",
    lineHeight: "1.7",
    padding: "14px",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  },

  // CTA button
  btn: (loading) => ({
    width: "100%",
    padding: "16px",
    background: loading ? "#1a1a1e" : "#4ade80",
    color: loading ? "#555" : "#0a0a0b",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "'DM Mono', monospace",
    transition: "all 0.2s",
    marginTop: "8px",
  }),

  // Error
  errorBox: {
    background: "#1a0a0a",
    border: "1px solid #3a1515",
    borderRadius: "8px",
    padding: "14px 18px",
    color: "#f87171",
    fontSize: "13px",
    marginTop: "16px",
  },

  // ── Results section ────────────────────────────────────────
  resultSection: {
    marginTop: "36px",
    animation: "fadeUp 0.5s ease both",
  },
  resultDivider: {
    display: "flex", alignItems: "center", gap: "16px",
    marginBottom: "28px",
  },
  dividerLine: { flex: 1, height: "1px", background: "#1a1a1e" },
  dividerText: {
    fontSize: "11px", color: "#333",
    letterSpacing: "0.1em", textTransform: "uppercase",
  },

  // Score card
  scoreCard: (score) => ({
    background: "#111113",
    border: `1px solid ${scoreColor(score, "border")}`,
    borderRadius: "10px",
    padding: "32px",
    display: "flex",
    alignItems: "center",
    gap: "32px",
    marginBottom: "20px",
  }),
  scoreRing: {
    position: "relative",
    flexShrink: 0,
  },
  scoreNum: (score) => ({
    position: "absolute",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "28px", fontWeight: "300",
    color: scoreColor(score, "text"),
    fontFamily: "'DM Serif Display', serif",
    letterSpacing: "-0.02em",
    textAlign: "center",
    lineHeight: 1,
  }),
  scorePercent: {
    fontSize: "12px", color: "#444",
    display: "block", marginTop: "2px",
  },
  scoreLabel: (score) => ({
    fontSize: "22px",
    fontWeight: "300",
    color: "#f0ede6",
    fontFamily: "'DM Serif Display', serif",
    marginBottom: "6px",
  }),
  scoreDesc: { fontSize: "13px", color: "#555", lineHeight: "1.6" },
  scoreBadge: (score) => ({
    display: "inline-block",
    fontSize: "11px",
    padding: "4px 12px",
    borderRadius: "100px",
    background: scoreColor(score, "bg"),
    color: scoreColor(score, "text"),
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginTop: "10px",
    fontWeight: "500",
  }),

  // Keywords + meta row
  bottomCols: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  smallPanel: {
    background: "#111113",
    border: "1px solid #1e1e22",
    borderRadius: "10px",
    padding: "20px 24px",
  },
  smallPanelTitle: {
    fontSize: "11px", color: "#555",
    letterSpacing: "0.1em", textTransform: "uppercase",
    marginBottom: "16px",
  },
  keyword: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#1a1010",
    border: "1px solid #2a1a1a",
    borderRadius: "4px",
    padding: "4px 10px",
    fontSize: "12px", color: "#f87171",
    margin: "3px",
  },
  noKeywords: { fontSize: "13px", color: "#3a5a3a" },
  metaRow: {
    display: "flex", flexDirection: "column", gap: "12px",
  },
  metaItem: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #161618",
    fontSize: "13px",
  },
  metaKey: { color: "#444" },
  metaVal: { color: "#c0bdb5", fontWeight: "500" },

  // History
  historySection: { marginTop: "32px" },
  historyTitle: {
    fontSize: "11px", color: "#333",
    letterSpacing: "0.1em", textTransform: "uppercase",
    marginBottom: "14px",
  },
  historyItem: {
    background: "#0e0e10",
    border: "1px solid #1a1a1e",
    borderRadius: "8px",
    padding: "14px 18px",
    marginBottom: "8px",
    display: "flex", alignItems: "center", gap: "16px",
  },
  histScore: (s) => ({
    fontSize: "16px", fontWeight: "500",
    color: scoreColor(s, "text"),
    minWidth: "48px",
  }),
  histSnip: { fontSize: "12px", color: "#444", flex: 1, lineHeight: "1.5" },
  histDate: { fontSize: "11px", color: "#333" },
};

// ── Color helper based on score ──────────────────────────────────────────────
function scoreColor(score, type) {
  if (score >= 75) {
    return { border: "#1a3a1a", bg: "#0d1a0d", text: "#4ade80" }[type];
  } else if (score >= 50) {
    return { border: "#3a3a0a", bg: "#1a1a05", text: "#facc15" }[type];
  } else {
    return { border: "#3a1515", bg: "#1a0a0a", text: "#f87171" }[type];
  }
}

function scoreLabel(score) {
  if (score >= 80) return "Strong match";
  if (score >= 65) return "Good match";
  if (score >= 50) return "Partial match";
  if (score >= 35) return "Weak match";
  return "Poor match";
}

function scoreDescription(score) {
  if (score >= 80) return "Your resume aligns well with this role. Focus on tailoring a few missing keywords.";
  if (score >= 65) return "Solid alignment. Strengthening keyword overlap could push you into the top tier.";
  if (score >= 50) return "Moderate match. Consider rewriting key sections to mirror the job description language.";
  if (score >= 35) return "Limited overlap. Significant revision recommended before applying.";
  return "Very low match. This role may require skills or experience not represented in your resume.";
}

// ── Circular score ring (SVG) ────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 52, cx = 60, cy = 60;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;

  return (
    <div style={S.scoreRing}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a1e" strokeWidth="6" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={scoreColor(score, "text")}
          strokeWidth="6"
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div style={S.scoreNum(score)}>
        {score}
        <span style={S.scorePercent}>%</span>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [pdfFile, setPdfFile]       = useState(null);
  const [jdText, setJdText]         = useState("");
  const [dragging, setDragging]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);   // { score, missing_keywords, resume_length }
  const [error, setError]           = useState("");
  const [history, setHistory]       = useState([]);
  const fileInputRef                = useRef();

  // ── Drag & drop handlers ────────────────────────────────────────────────
  const onDragOver  = useCallback((e) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop      = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") setPdfFile(file);
    else setError("Please upload a PDF file.");
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPdfFile(file);
  };

  // ── API call ────────────────────────────────────────────────────────────
  const handleMatch = async () => {
    if (!pdfFile)    return setError("Please upload your resume PDF.");
    if (!jdText.trim()) return setError("Please paste the job description.");
    setError(""); setLoading(true); setResult(null);

    try {
      const form = new FormData();
      form.append("resume", pdfFile);
      form.append("job_description", jdText);

      const res  = await fetch("http://localhost:5000/match", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Server error");

      setResult(data);
      fetchHistory();                               // Refresh history after new match
    } catch (err) {
      setError(err.message || "Could not connect to Flask server. Is it running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch history ───────────────────────────────────────────────────────
  const fetchHistory = async () => {
    try {
      const res  = await fetch("http://localhost:5000/history");
      const data = await res.json();
      setHistory(data.history || []);
    } catch (_) {}
  };

  const formatBytes = (n) => n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;
  const formatDate  = (s) => new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      {/* Global keyframe */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0b; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        textarea:focus { border-color: #2a2a35 !important; }
        textarea::placeholder { color: #555558; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a30; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <header style={S.header}>
        <div style={S.logoRow}>
          <div style={S.logoDot} />
          <span style={S.logoText}>Resume Matcher</span>
        </div>
        <span style={S.headerTag}>BERT · semantic similarity · v1.0</span>
      </header>

      <main style={S.main}>
        {/* Hero */}
        <p style={S.heroLabel}>AI-powered analysis</p>
        <h1 style={S.heroTitle}>How well does your resume<br />match the job?</h1>
        <p style={S.heroSub}>
          Upload your resume and paste a job description. BERT encodes both as<br />
          semantic vectors — cosine similarity gives you a precise match score.
        </p>

        {/* Two input columns */}
        <div style={S.cols}>

          {/* Left — PDF upload */}
          <div style={S.panel}>
            <div style={S.panelLabel}>
              <span style={S.panelNum}>1</span>
              Resume PDF
            </div>

            <div
              style={S.dropzone(dragging, !!pdfFile)}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !pdfFile && fileInputRef.current.click()}
            >
              <span style={S.dropIcon}>⬆</span>
              {pdfFile ? (
                <p style={{ ...S.dropText, color: "#4ade80" }}>File loaded ✓</p>
              ) : (
                <p style={S.dropText}>
                  Drag & drop your PDF here, or{" "}
                  <span
                    style={S.dropHighlight}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                  >
                    browse
                  </span>
                </p>
              )}
              <p style={{ ...S.dropText, fontSize: "11px", marginTop: "6px" }}>PDF files only</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={onFileChange}
            />

            {pdfFile && (
              <div style={S.fileInfo}>
                <span style={{ fontSize: "16px" }}>📄</span>
                <span style={S.fileName}>{pdfFile.name}</span>
                <span style={S.fileSize}>{formatBytes(pdfFile.size)}</span>
                <button
                  style={S.removeBtn}
                  onClick={() => setPdfFile(null)}
                  title="Remove file"
                >×</button>
              </div>
            )}
          </div>

          {/* Right — Job description */}
          <div style={S.panel}>
            <div style={S.panelLabel}>
              <span style={S.panelNum}>2</span>
              Job Description
            </div>
            <textarea
              style={S.textarea}
              placeholder={"Paste the full job description here...\n\nInclude responsibilities, requirements,\nskills, and qualifications for best results."}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            <p style={{ fontSize: "11px", color: "#2a2a30", marginTop: "8px" }}>
              {jdText.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        </div>

        {/* Analyse button */}
        <button
          style={S.btn(loading)}
          onClick={handleMatch}
          disabled={loading}
        >
          {loading ? "Analysing with BERT…" : "Analyse Match →"}
        </button>

        {/* Error */}
        {error && <div style={S.errorBox}>⚠ {error}</div>}

        {/* ── Results ─────────────────────────────────────────────────── */}
        {result && (
          <div style={S.resultSection}>
            <div style={S.resultDivider}>
              <div style={S.dividerLine} />
              <span style={S.dividerText}>Analysis result</span>
              <div style={S.dividerLine} />
            </div>

            {/* Score card */}
            <div style={S.scoreCard(result.score)}>
              <ScoreRing score={result.score} />
              <div>
                <p style={S.scoreLabel(result.score)}>{scoreLabel(result.score)}</p>
                <p style={S.scoreDesc}>{scoreDescription(result.score)}</p>
                <span style={S.scoreBadge(result.score)}>{result.score}% match</span>
              </div>
            </div>

            {/* Keywords + meta */}
            <div style={S.bottomCols}>

              {/* Missing keywords */}
              <div style={S.smallPanel}>
                <p style={S.smallPanelTitle}>Missing keywords</p>
                {result.missing_keywords?.length > 0 ? (
                  <div>
                    {result.missing_keywords.map((kw) => (
                      <span key={kw} style={S.keyword}>
                        <span style={{ opacity: 0.5 }}>—</span> {kw}
                      </span>
                    ))}
                    <p style={{ fontSize: "12px", color: "#333", marginTop: "12px" }}>
                      Consider adding these terms where relevant.
                    </p>
                  </div>
                ) : (
                  <p style={S.noKeywords}>✓ No major keyword gaps found.</p>
                )}
              </div>

              {/* Meta stats */}
              <div style={S.smallPanel}>
                <p style={S.smallPanelTitle}>Analysis details</p>
                <div style={S.metaRow}>
                  {[
                    ["Model",        "all-MiniLM-L6-v2"],
                    ["Method",       "Cosine similarity"],
                    ["Dimensions",   "384-d embeddings"],
                    ["Resume words", result.resume_length ? `~${Math.round(result.resume_length / 5)} words` : "—"],
                    ["JD words",     `~${jdText.trim().split(/\s+/).filter(Boolean).length} words`],
                  ].map(([k, v]) => (
                    <div key={k} style={S.metaItem}>
                      <span style={S.metaKey}>{k}</span>
                      <span style={S.metaVal}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── History ─────────────────────────────────────────────────── */}
        {history.length > 0 && (
          <div style={S.historySection}>
            <p style={S.historyTitle}>Recent analyses</p>
            {history.map((h) => (
              <div key={h.id} style={S.historyItem}>
                <span style={S.histScore(h.score)}>{h.score}%</span>
                <span style={S.histSnip}>{h.resume_preview}…</span>
                <span style={S.histDate}>{formatDate(h.matched_at)}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
