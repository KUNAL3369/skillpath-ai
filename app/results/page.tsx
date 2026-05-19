"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ChevronLeft,
  Target,
  TrendingUp,
  CheckCircle,
  BookOpen,
  Briefcase,
  Award,
  Lock,
  Zap,
  Share,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generatePDF } from "@/lib/pdf-generator";
import Link from "next/link";

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
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Always read fresh from localStorage — never cache in state
const isPdfPaid = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("skillpath_pdf_paid") === "true";
};

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Load result data from URL params
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get("data");
    const roleParam = params.get("role");

    if (dataParam && roleParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setResult(parsedData);
        setTargetRole(roleParam);
      } catch {
        console.error("Failed to parse result data");
      }
    }
    setLoading(false);
  }, []);

  // Handle Lemon Squeezy redirect back with ?payment=success
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      // Save permanently to localStorage
      localStorage.setItem("skillpath_pdf_paid", "true");
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []); // Runs once on mount — does NOT depend on result

  // Separate effect: once result loads AND payment was successful, generate PDF
  useEffect(() => {
    if (!result || !targetRole) return;
    if (isPdfPaid()) {
      const params = new URLSearchParams(window.location.search);
      // Only auto-generate if we just came back from payment
      if (params.get("payment") === "success") {
        setTimeout(() => generatePDF({ ...result, target_role: targetRole }), 500);
      }
    }
  }, [result, targetRole]);

  // FIX: checks localStorage fresh on every click — no caching
  const handleDownloadPDF = useCallback(() => {
    if (!result || !targetRole) return;
    if (!isPdfPaid()) {
      setShowPaymentModal(true);
      return;
    }
    generatePDF({ ...result, target_role: targetRole });
  }, [result, targetRole]);

  const handleShare = async () => {
    if (!result || !targetRole) return;
    const text = `My career gap score is ${result.gap_score}/100 for becoming a ${targetRole}. Find yours at skillpath.ai 🎯`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // FIX: "Unlock My PDF" goes to Lemon Squeezy — never unlocks directly
  const handlePayment = () => {
    const checkoutUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PDF_CHECKOUT;
    if (checkoutUrl) {
      // Real payment — redirect to Lemon Squeezy
      window.location.href = checkoutUrl;
    } else {
      // Dev mode only (no checkout URL configured)
      localStorage.setItem("skillpath_pdf_paid", "true");
      setShowPaymentModal(false);
      if (result && targetRole) {
        setTimeout(() => generatePDF({ ...result, target_role: targetRole }), 100);
      }
    }
  };

  const CircularProgress = ({ score }: { score: number }) => {
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="54"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-[var(--card)]"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="54"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="text-3xl font-bold gradient-text"
          >
            {score}
          </motion.span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Please run an analysis from the home page first.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            New Analysis
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={handleShare}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-[var(--card)] hover:bg-[var(--accent)]/20"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share className="w-4 h-4" />
                    Share Your Score
                  </>
                )}
              </button>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Your <span className="gradient-text">Gap Analysis</span>
            </h1>
            <p className="text-[var(--foreground)]/70">for {targetRole}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-16"
          >
            <CircularProgress score={result.gap_score} />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-6 card-glow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Your Gap Summary</h2>
              </div>
              <p className="text-[var(--foreground)]/80">{result.gap_summary}</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-6 card-glow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Existing Strengths</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.existing_strengths.map((strength, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 tag-green rounded-full text-sm"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-6 card-glow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Critical Gaps</h2>
              </div>
              <div className="space-y-4">
                {result.critical_gaps.map((gap, idx) => (
                  <div key={idx} className="p-4 bg-[var(--background)] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{gap.skill}</span>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          gap.priority === "MUST HAVE" ? "tag-red" : "tag-yellow"
                        )}
                      >
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                      {gap.why_matters}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Time to fill: {gap.time_to_fill}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-6 card-glow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Learning Roadmap</h2>
              </div>
              <div className="space-y-4">
                {result.roadmap_phases.map((phase, idx) => (
                  <div key={idx} className="relative pl-8 pb-4 last:pb-0">
                    {idx < result.roadmap_phases.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-[var(--accent)]/30" />
                    )}
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                      {phase.phase_number}
                    </div>
                    <div className="ml-2">
                      <h3 className="font-semibold mb-1">
                        {phase.phase_name}
                        <span className="ml-2 text-xs text-[var(--foreground)]/50">
                          ({phase.duration})
                        </span>
                      </h3>
                      <p className="text-sm text-[var(--foreground)]/70 mb-2">
                        {phase.milestone}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {phase.what_to_learn.map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-6 card-glow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Quick Wins</h2>
              </div>
              <ul className="space-y-2">
                {result.quick_wins.map((win, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[var(--accent)]">→</span>
                    <span>{win}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-6 card-glow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">LinkedIn Headline</h2>
              </div>
              <p className="p-4 bg-[var(--background)] rounded-xl font-medium text-lg">
                {result.linkedin_headline}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-6 card-glow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Portfolio Project Ideas</h2>
              </div>
              <ul className="space-y-2">
                {result.portfolio_projects.map((project, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>{project}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* PDF Download Section */}
            <motion.div
              variants={itemVariants}
              className="glass rounded-2xl p-8 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Download Your Roadmap</h2>
                <p className="text-[var(--text-secondary)] mb-6">
                  Get a professionally formatted PDF with all your analysis details, roadmap, and resources.
                </p>
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  <Download className="w-5 h-5" />
                  {isPdfPaid() ? "Download PDF" : "Download PDF - $9"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <footer className="py-8 px-4 border-t border-[var(--bg-card)]">
        <div className="max-w-6xl mx-auto text-center text-sm text-[var(--text-secondary)]">
          <p className="mb-2">
            SkillPath AI provides career guidance based on general market trends. Results may
            vary based on individual circumstances.
          </p>
          <p>© 2026 SkillPath AI. All rights reserved.</p>
        </div>
      </footer>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass bg-[var(--card)] rounded-2xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Get Your Complete Roadmap PDF</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Unlock your full personalized roadmap with printable phases, resources, and project ideas.
              </p>
              <div className="text-3xl font-bold gradient-text mb-6">$9 One-Time</div>

              {/* Primary CTA — goes to Lemon Squeezy */}
              <button
                onClick={handlePayment}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all mb-3"
              >
                Unlock My PDF Roadmap
              </button>

              {/* Maybe Later — ONLY closes modal, nothing else */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
              >
                Maybe Later
              </button>

              {/* Dev-only bypass — invisible in production */}
              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={() => {
                    localStorage.setItem("skillpath_pdf_paid", "true");
                    setShowPaymentModal(false);
                    if (result && targetRole) {
                      setTimeout(
                        () => generatePDF({ ...result, target_role: targetRole }),
                        100
                      );
                    }
                  }}
                  className="w-full mt-4 text-xs text-[var(--text-secondary)]/50 underline"
                >
                  [DEV] Simulate payment success
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
