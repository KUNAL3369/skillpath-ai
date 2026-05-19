"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Target,
  CheckCircle,
  ChevronRight,
  Zap,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { cn, getGenerationCount, incrementGenerationCount, hasReachedLimit } from "@/lib/utils";

const loadingMessages = [
  "Scanning your skills... 🔍",
  "Matching against job requirements... 📋",
  "Identifying your gaps... 🎯",
  "Building your roadmap... 🗺️",
  "Almost ready... ✨",
];

const roleChips = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "ML Engineer",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
];

interface FormData {
  mode: 1 | 2;
  targetRole: string;
  currentSkills: string;
  experience: string;
  mode2Goal: string;
  timeline: string;
}

const timelineOptions = [
  { value: "asap", label: "ASAP (1-3 months)" },
  { value: "3-6", label: "3-6 months" },
  { value: "6-12", label: "6-12 months" },
  { value: "no-rush", label: "No rush, learn properly" },
];

const successStories = [
  {
    name: "Priya Sharma",
    role: "Frontend → Full Stack Developer",
    result: "Gap Score: 42 → 78 in 3 months",
    quote: "The roadmap was incredibly specific. I went from knowing React to building full APIs.",
  },
  {
    name: "Arjun Mehta",
    role: "Manual QA → SDET",
    result: "Landed offer at a unicorn startup",
    quote: "The quick wins section helped me pass interviews within weeks.",
  },
  {
    name: "Sneha Reddy",
    role: "Marketing → Data Analyst",
    result: "Double salary in 5 months",
    quote: "Finally understood what skills actually matter. The AI knew the market better than I did.",
  },
];

export default function Home() {
  const [mode, setMode] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>({
    mode: 1,
    targetRole: "",
    currentSkills: "",
    experience: "",
    mode2Goal: "",
    timeline: "3-6",
  });
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [error, setError] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    setGenerationCount(getGenerationCount());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.targetRole || (mode === 1 && !formData.currentSkills) || !formData.timeline) {
      setError("Please fill in all required fields");
      return;
    }

    if (hasReachedLimit()) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          targetRole: formData.targetRole,
          currentSkills: formData.currentSkills,
          experience: formData.experience,
          mode2Goal: mode === 2 ? formData.mode2Goal : undefined,
          timeline: formData.timeline,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const result = await response.json();
      const newCount = incrementGenerationCount();
      setGenerationCount(newCount);

      const params = new URLSearchParams({
        data: encodeURIComponent(JSON.stringify(result)),
        role: formData.targetRole,
      });

      window.location.href = `/results?${params.toString()}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="pt-20">
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">AI Career Gap</span> Analyzer
              </h1>
              <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                Stop guessing what skills you need. Get an honest analysis of your career gaps
                and a personalized roadmap to land your dream role.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
              {successStories.map((story, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="glass rounded-xl p-4 text-left card-glow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-[var(--tag-green-text)]" />
                    <span className="text-sm font-medium">{story.name}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">{story.role}</p>
                  <p className="text-xs text-[var(--tag-green-text)] font-medium mb-2">{story.result}</p>
                  <p className="text-xs text-[var(--text-secondary)] italic">&ldquo;{story.quote}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-1 flex mb-8">
              <button
                onClick={() => setMode(1)}
                className={cn(
                  "flex-1 py-3 px-6 rounded-xl font-medium transition-all",
                  mode === 1
                    ? "bg-[var(--accent)] text-white shadow-lg"
                    : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                )}
              >
                <Target className="w-4 h-4 inline-block mr-2" />
                Resume Gap Analysis
              </button>
              <button
                onClick={() => setMode(2)}
                className={cn(
                  "flex-1 py-3 px-6 rounded-xl font-medium transition-all",
                  mode === 2
                    ? "bg-[var(--accent)] text-white shadow-lg"
                    : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                )}
              >
                <Rocket className="w-4 h-4 inline-block mr-2" />
                Roadmap Builder
              </button>
            </div>

            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Target Role</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g., Senior Frontend Developer"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--card)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {roleChips.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetRole: role })}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs transition-all",
                        formData.targetRole === role
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--card)] hover:bg-[var(--accent)]/20"
                      )}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {mode === 1 ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Paste your resume or CV text here
                    </label>
                    <textarea
                      value={formData.currentSkills}
                      onChange={(e) => setFormData({ ...formData, currentSkills: e.target.value })}
                      placeholder="Paste your full resume text here - work experience, skills, education..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--card)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all resize-none"
                    />
                    <p className="text-xs text-[var(--foreground)]/50 mt-2">
                      Copy-paste naturally from your Word doc, PDF, or LinkedIn profile
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Years of Experience
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--card)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all"
                    >
                      <option value="">Select experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-2">1-2 years</option>
                      <option value="2-4">2-4 years</option>
                      <option value="4-7">4-7 years</option>
                      <option value="7+">7+ years</option>
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Your Career Goal
                  </label>
                  <textarea
                    value={formData.mode2Goal}
                    onChange={(e) => setFormData({ ...formData, mode2Goal: e.target.value })}
                    placeholder="Describe what you want to achieve in the next 6-12 months..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--card)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all resize-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-3">
                  What&apos;s your target learning timeline?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {timelineOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: option.value })}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                        formData.timeline === option.value
                          ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                          : "bg-[var(--background)] border-[var(--card)] hover:border-[var(--accent)]/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <p className="text-xs text-[var(--text-secondary)]">
                  {mounted ? `${generationCount}/3 free analyses used` : ""}
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze My Gap
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <p className="text-xl font-medium text-white">
                  {loadingMessages[loadingIndex]}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPaywall && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPaywall(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass bg-[var(--card)] rounded-2xl p-8 max-w-md text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Free Limit Reached</h2>
                <p className="text-[var(--foreground)]/70 mb-6">
                  You&apos;ve used all 3 free analyses. Upgrade to unlock unlimited gap
                  analysis, PDF downloads, and priority support.
                </p>
                <div className="text-3xl font-bold gradient-text mb-6">$9/month</div>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  Upgrade Now
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full mt-3 py-2 text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors"
                >
                  Maybe Later
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </div>
  );
}