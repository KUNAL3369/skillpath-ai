import jsPDF from "jspdf";

interface CriticalGap {
  skill: string;
  priority: string;
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
  target_role?: string;
}

export function generatePDF(result: AnalysisResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  const accentColor = "#1e3a5f";
  const textColor = "#333333";
  const lightGray = "#666666";

  const checkPageBreak = (spaceNeeded: number) => {
    if (yPos + spaceNeeded > 270) {
      doc.addPage();
      yPos = margin;
      addFooter(doc);
    }
  };

  const addFooter = (pdf: jsPDF) => {
    const pageCount = (pdf as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(lightGray);
      pdf.text("SkillPath AI", pageWidth / 2, 285, { align: "center" });
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 292, {
        align: "center",
      });
    }
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(accentColor);
  doc.text("SkillPath AI", margin, yPos);
  yPos += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(textColor);
  doc.text("Career Gap Analysis & Skill Roadmap", margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(lightGray);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
  yPos += 15;

  doc.setDrawColor(accentColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor);
  doc.text("GAP SCORE", margin, yPos);
  yPos += 10;

  doc.setFontSize(48);
  doc.setTextColor(accentColor);
  doc.text(`${result.gap_score}/100`, margin, yPos + 10);
  yPos += 30;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor);
  const summaryLines = doc.splitTextToSize(result.gap_summary, pageWidth - 2 * margin);
  doc.text(summaryLines, margin, yPos);
  yPos += summaryLines.length * 6 + 15;

  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor);
  doc.text("EXISTING STRENGTHS", margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor);
  result.existing_strengths.forEach((strength) => {
    doc.text(`• ${strength}`, margin + 5, yPos);
    yPos += 6;
  });
  yPos += 10;

  checkPageBreak(60);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor);
  doc.text("CRITICAL GAPS", margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  result.critical_gaps.forEach((gap, idx) => {
    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(accentColor);
    doc.text(`${idx + 1}. ${gap.skill} (${gap.priority})`, margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor);
    const whyLines = doc.splitTextToSize(gap.why_matters, pageWidth - 2 * margin - 10);
    doc.text(whyLines.map((l: string) => `   ${l}`), margin, yPos);
    yPos += whyLines.length * 5;

    doc.setTextColor(lightGray);
    doc.text(`   Time to fill: ${gap.time_to_fill}`, margin, yPos);
    yPos += 10;
  });
  yPos += 5;

  checkPageBreak(80);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor);
  doc.text("ROADMAP PHASES", margin, yPos);
  yPos += 12;

  doc.setFontSize(10);
  result.roadmap_phases.forEach((phase) => {
    checkPageBreak(50);
    doc.setFillColor(240, 245, 255);
    doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 25, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(accentColor);
    doc.text(`Phase ${phase.phase_number}: ${phase.phase_name}`, margin + 3, yPos + 2);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor);
    doc.text(`Duration: ${phase.duration}`, margin + 3, yPos);
    yPos += 6;

    doc.setTextColor(lightGray);
    doc.text(`Milestone: ${phase.milestone}`, margin + 3, yPos);
    yPos += 10;

    doc.setTextColor(textColor);
    doc.text("Learn:", margin + 3, yPos);
    yPos += 5;
    phase.what_to_learn.forEach((item) => {
      doc.text(`   • ${item}`, margin + 8, yPos);
      yPos += 5;
    });
    yPos += 3;
  });
  yPos += 10;

  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor);
  doc.text("QUICK WINS", margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor);
  result.quick_wins.forEach((win, idx) => {
    doc.text(`${idx + 1}. ${win}`, margin, yPos);
    yPos += 6;
  });
  yPos += 10;

  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor);
  doc.text("LINKEDIN HEADLINE", margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor);
  const headlineLines = doc.splitTextToSize(result.linkedin_headline, pageWidth - 2 * margin);
  doc.text(headlineLines, margin, yPos);
  yPos += headlineLines.length * 5 + 10;

  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor);
  doc.text("PORTFOLIO PROJECT IDEAS", margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor);
  result.portfolio_projects.forEach((project) => {
    doc.text(`• ${project}`, margin, yPos);
    yPos += 6;
  });

  addFooter(doc);

  const fileName = result.target_role
    ? `SkillPath-${result.target_role.replace(/\s+/g, "-")}-Roadmap.pdf`
    : "SkillPath-Career-Roadmap.pdf";

  doc.save(fileName);
}