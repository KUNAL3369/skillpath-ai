# SkillPath AI - AI Career Gap Analyzer & Skill Roadmap Generator

A production-ready full-stack Next.js 14 (App Router) application that uses AI to analyze career gaps and generate personalized skill roadmaps.

## Features

- **Dual Analysis Modes:**
  - Mode 1: Resume Gap Analysis - Compare current skills against target role requirements
  - Mode 2: Roadmap Builder - Create a career path from scratch based on goals

- **AI-Powered Analysis:**
  - Uses Groq API (Llama 3.3 70B) for intelligent career gap assessment
  - Strict JSON schema ensures consistent, structured results
  - Generates gap scores, critical gaps, roadmap phases, and portfolio project ideas

- **Freemium Model:**
  - 3 free analyses per device (localStorage-based)
  - Polished paywall modal for upgrades ($9/month)
  - PDF download requires upgrade after free limit

- **Professional PDF Generation:**
  - Multi-page jsPDF output with dark blue headers
  - Page footers ("SkillPath AI")
  - Structured content with roadmap phases and milestones

- **Rich UI/UX:**
  - Dark mode (default): #080812 background, #10102a cards
  - Light mode: #f8f9ff background, #ffffff cards
  - Framer Motion animations with 200ms stagger
  - Animated circular progress ring for gap scores
  - Theme toggle with system preference detection

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom color palette
- **AI:** Groq SDK (llama-3.3-70b-versatile)
- **PDF:** jsPDF
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

1. Clone the repository:
   ```bash
   cd skillpath-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variable:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## API Response Schema

```json
{
  "gap_score": number,
  "gap_summary": "string",
  "existing_strengths": ["string"],
  "critical_gaps": [
    {
      "skill": "string",
      "priority": "MUST HAVE or GOOD TO HAVE",
      "why_matters": "string",
      "time_to_fill": "string"
    }
  ],
  "roadmap_phases": [
    {
      "phase_number": number,
      "phase_name": "string",
      "duration": "string",
      "what_to_learn": ["string"],
      "how_to_learn": ["string"],
      "milestone": "string"
    }
  ],
  "quick_wins": ["string"],
  "linkedin_headline": "string",
  "portfolio_projects": ["string"]
}
```

## Project Structure

```
skillpath-ai/
├── app/
│   ├── api/analyze/route.ts    # Groq API handler
│   ├── results/page.tsx        # Results display with animations
│   ├── pricing/page.tsx       # Pricing page
│   ├── about/page.tsx          # About page
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── page.tsx                # Home page with forms
│   └── globals.css             # Custom CSS variables
├── components/
│   └── theme-provider.tsx      # Dark/light mode context
├── lib/
│   ├── pdf-generator.ts        # jsPDF utility
│   └── utils.ts               # cn helper + freemium logic
├── tailwind.config.ts          # Custom color palette
└── package.json
```

## License

MIT