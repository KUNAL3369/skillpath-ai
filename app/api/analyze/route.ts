import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const systemPrompt = `You are a world-class career coach and skills analyst with deep knowledge of hiring requirements across tech, business, design, and data roles globally. You have insider knowledge of what recruiters actually look for vs what job descriptions say. You are especially knowledgeable about the Indian job market (TCS, Infosys, startups, MNCs) as well as global remote opportunities. Be specific, actionable, and honest. Never give vague advice like 'learn communication skills'. Always give concrete, named resources and specific skills.`;

interface RequestBody {
  mode: 1 | 2;
  targetRole: string;
  currentSkills: string;
  experience: string;
  mode2Goal?: string;
  timeline: string;
}

const timelineMap: Record<string, { phases: number; label: string; scale: string }> = {
  "asap": { phases: 3, label: "ASAP (1-3 months)", scale: "condensed - 2-4 weeks per phase" },
  "3-6": { phases: 4, label: "3-6 months", scale: "standard - 4-6 weeks per phase" },
  "6-12": { phases: 6, label: "6-12 months", scale: "relaxed - 6-10 weeks per phase" },
  "no-rush": { phases: 8, label: "No rush", scale: "comprehensive - 8-12 weeks per phase" },
};

interface CriticalGap {
  skill: string;
  priority: "MUST HAVE" | "GOOD TO HAVE";
  why_matters: string;
  time_to_fill: string;
}

interface RoadmapPhase {
  phase_number: number;
  phase_name: string;
  duration: string;
  what_to_learn: string[];
  how_to_learn: string[];
  milestone: string;
}

interface AnalysisResult {
  gap_score: number;
  gap_summary: string;
  existing_strengths: string[];
  critical_gaps: CriticalGap[];
  roadmap_phases: RoadmapPhase[];
  quick_wins: string[];
  linkedin_headline: string;
  portfolio_projects: string[];
}

async function generateAnalysis(body: RequestBody): Promise<AnalysisResult> {
  const { mode, targetRole, currentSkills, experience, mode2Goal, timeline } = body;

  const timelineInfo = timelineMap[timeline] || timelineMap["3-6"];

  let userPrompt = "";
  if (mode === 1) {
    userPrompt = `
You are analyzing a resume/CV for career gap analysis. The user wants to become a ${targetRole}.

RESUME/CV TEXT:
${currentSkills || "No resume text provided"}

Years of Experience: ${experience || "Not specified"}
Target Timeline: ${timelineInfo.label}
Timeline Scale: ${timelineInfo.scale}

IMPORTANT: The resume may contain work experience, skills, education, and achievements. Parse it carefully to identify:
1. Technical skills and technologies mentioned
2. Years of experience in relevant roles
3. Education and certifications
4. Notable achievements or projects
5. Tools and platforms they know

Based on this resume and the target timeline, create a JSON roadmap with ${timelineInfo.phases} phases that fits within "${timelineInfo.label}". Each phase duration should be scaled accordingly (e.g., "Weeks 1-4", "Weeks 5-8", etc. for 3-month timeline, or "Month 1-2", "Month 3-4" for longer timelines).

Provide a JSON response with the following structure:
{
  "gap_score": number (0-100),
  "gap_summary": "2 honest sentences about their situation based on resume analysis",
  "existing_strengths": ["skill1", "skill2", "identified from resume"],
  "critical_gaps": [
    { "skill": "string", "priority": "MUST HAVE or GOOD TO HAVE", "why_matters": "string", "time_to_fill": "string" }
  ],
  "roadmap_phases": [
    { "phase_number": number, "phase_name": "string", "duration": "string (e.g., 'Weeks 1-4' or 'Month 1-2')", "what_to_learn": ["topic1"], "how_to_learn": ["resource1"], "milestone": "string" }
  ],
  "quick_wins": ["action1", "action2", "action3"],
  "linkedin_headline": "string",
  "portfolio_projects": ["project1", "project2"]
}`;
  } else {
    userPrompt = `
Create a skill roadmap for someone with this career goal: ${mode2Goal || `Become a ${targetRole}`}

Target Role: ${targetRole}
Target Timeline: ${timelineInfo.label}
Timeline Scale: ${timelineInfo.scale}

Create a JSON roadmap with ${timelineInfo.phases} phases that fits within "${timelineInfo.label}". Each phase duration should be scaled accordingly (e.g., "Weeks 1-4", "Weeks 5-8", etc. for 3-month timeline, or "Month 1-2", "Month 3-4" for longer timelines).

Provide a JSON response with the following structure:
{
  "gap_score": number (0-100, 100 means they need to learn everything),
  "gap_summary": "2 honest sentences about their situation",
  "existing_strengths": ["skill1", "skill2"],
  "critical_gaps": [
    { "skill": "string", "priority": "MUST HAVE or GOOD TO HAVE", "why_matters": "string", "time_to_fill": "string" }
  ],
  "roadmap_phases": [
    { "phase_number": number, "phase_name": "string", "duration": "string (e.g., 'Weeks 1-4' or 'Month 1-2')", "what_to_learn": ["topic1"], "how_to_learn": ["resource1"], "milestone": "string" }
  ],
  "quick_wins": ["action1", "action2", "action3"],
  "linkedin_headline": "string",
  "portfolio_projects": ["project1", "project2"]
}`;
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(responseText);

  return {
    gap_score: Math.min(100, Math.max(0, parsed.gap_score || 50)),
    gap_summary: parsed.gap_summary || "Analysis complete.",
    existing_strengths: parsed.existing_strengths || [],
    critical_gaps: parsed.critical_gaps || [],
    roadmap_phases: parsed.roadmap_phases || [],
    quick_wins: parsed.quick_wins || [],
    linkedin_headline: parsed.linkedin_headline || "",
    portfolio_projects: parsed.portfolio_projects || [],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();

    if (!body.targetRole) {
      return NextResponse.json(
        { error: "Target role is required" },
        { status: 400 }
      );
    }

    const result = await generateAnalysis(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}