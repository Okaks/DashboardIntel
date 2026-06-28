markdown# DashboardIntel

> Turn any dashboard into an executive-ready report in 30 seconds.

**Live:** [dashboard-intel.vercel.app](https://dashboard-intel.vercel.app)

DashboardIntel converts a dashboard screenshot or PDF into a written executive report — calibrated to the audience reading it and the format they need. The output is delivered in Word, PDF, and PowerPoint, ready to send without further editing.

---

## Why this exists

Analysts spend hours every month converting dashboards into reports for executives. The analytical work is already done; the time goes into formatting, audience-framing, and rewriting the same insight three different ways for three different stakeholders. DashboardIntel removes that layer — letting the analyst declare the audience and format, and producing a finished report shaped accordingly.

The audience is not a checkbox. It is the central design decision. A CFO report and a CPO report from the same dashboard are structurally different documents, not the same paragraph with different vocabulary.

---

## Features

- **Multi-format input** — accepts screenshots (PNG, JPG) and PDFs from any BI tool (Power BI, Tableau, Looker, Metabase, Superset, or custom)
- **Five audience lenses** — CFO / Finance, CPO / Product, CEO / Board, Marketing Lead, General Executive
- **Three report formats** — One-Page Brief, Bullet Highlights, Structured Narrative
- **Three export formats** — Word (.docx), PDF, PowerPoint (.pptx) — each production-grade, no editing required
- **Unicode-safe PDF rendering** — embedded NotoSans fonts support the ₦ Naira symbol and other characters outside the WinAnsi range
- **Editorial design system** — dark background, gold accent panel, Georgia serif numerals, hanging-indent ▸ bullets
- **No data retention** — reports are not stored; state lives in the browser session only

---

## Tech stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **AI model:** Claude (Anthropic API)
- **Document generation:** `docx` (Word), `jsPDF` (PDF with embedded TTF fonts), `pptxgenjs` (PowerPoint)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## Getting started

### Prerequisites

- Node.js 18.17 or later
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

```bash
git clone https://github.com/Okaks/dashboardintel.git
cd dashboardintel
npm install
```

### Environment

Create a `.env.local` file in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## How it works
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐

│ Dashboard image │ →  │  Claude API  │ →  │ Structured text │

└─────────────────┘    └──────────────┘    └─────────────────┘

↓

┌──────────────────┐

│     Parser       │

│ (sections, items)│

└──────────────────┘

↓

┌───────────────────────────┼───────────────────────────┐

↓                           ↓                           ↓

┌──────────────┐           ┌──────────────┐           ┌──────────────┐

│ Word render  │           │ PDF render   │           │ PPT render   │

│   (docx)     │           │   (jsPDF)    │           │ (pptxgenjs)  │

└──────────────┘           └──────────────┘           └──────────────┘

The system prompt enforces a strict output contract — section headers use `##`, bullets use `-`, and prose paragraphs are plain text. A typed parser walks the output and produces an intermediate tree of sections containing ordered prose and bullet items. Each export renderer consumes this same tree but renders it differently based on the chosen format.

This separation of concerns means improvements to one export format never affect the others, and changes to the prompt structure never break the renderers.

---

## Project structure
dashboardintel/

├── src/

│   ├── app/

│   │   ├── api/

│   │   │   └── analyze/

│   │   │       └── route.ts          # API route — calls Claude with image + prompt

│   │   ├── layout.tsx

│   │   ├── page.tsx                  # Main page

│   │   └── globals.css

│   ├── components/

│   │   ├── UploadForm.tsx            # Upload + audience + format selection

│   │   └── AnalysisResult.tsx        # Renders analysis + download buttons

│   └── lib/

│       ├── prompts.ts                # System + user prompts (format-specific)

│       ├── downloads.ts              # Parser + Word/PDF/PPT renderers

│       └── fonts/                    # Embedded NotoSans for jsPDF Unicode support

│           ├── NotoSans-normal.js

│           ├── NotoSans-bold.js

│           └── NotoSans-italic.js

├── public/

├── .env.local                        # API key (not committed)

├── package.json

└── README.md

---

## Report formats

| Format | Structure | Best for |
|--------|-----------|----------|
| **One-Page Brief** | Key Findings + Recommendations (bullets only) | Executives with no time; quick board updates |
| **Bullet Highlights** | Themed bullet sections + Looking Ahead | Working meetings; status reports |
| **Structured Narrative** | Executive Summary, Dashboard Analysis, Key Findings, Areas of Concern, Opportunities, Watch Areas, Recommendations | Board papers, quarterly reviews, client deliverables |

---

## Audience lenses

Each audience selection changes which findings get surfaced, how they're framed, and which sections lead. The same dashboard analysed for a CFO produces a structurally different report than the same dashboard analysed for a CPO.

- **CFO / Finance** — prioritises risk signals, cost efficiency, revenue implications, margin concerns
- **CPO / Product** — prioritises retention, activation, feature performance, user behaviour trends
- **CEO / Board** — prioritises growth trajectory, strategic implications, competitive positioning, decisions to make
- **Marketing Lead** — prioritises acquisition efficiency, channel performance, campaign impact, cost per outcome
- **General Executive** — balances across growth, risk, and operational signals

---

## Roadmap

- Multi-dashboard analysis (synthesise across finance, product, marketing dashboards into one report)
- Custom audience profiles (save and reuse a lens for a specific client or executive)
- Period-over-period comparison mode
- Light-mode and additional design templates
- Direct integration with Power BI, Tableau, Metabase, and Looker

---

## Privacy

Uploaded dashboards are sent to the Anthropic API for processing and are not stored by DashboardIntel. No backend database. No analytics on report content. State lives in the browser session and is cleared when the tab closes.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Author

Built by **Blessing Okakwu** ([@Okaks](https://github.com/Okaks))

Portfolio: [bokakwu.wixsite.com/okakwus-analytics](https://bokakwu.wixsite.com/okakwus-analytics)

---

## Acknowledgements

Built with [Claude](https://www.anthropic.com/claude) by Anthropic. Powered by Next.js and Vercel. Fonts via Google Fonts (Noto Sans).
