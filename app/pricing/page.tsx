"use client";

import { Check, FileText, Bookmark, ListTodo, TrendingUp, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: FileText,
    title: "Full Phase-by-Phase Printable Plan",
    description: "A complete breakdown of every learning phase with clear timelines and milestones you can print and reference.",
  },
  {
    icon: Bookmark,
    title: "Curated Resource Links",
    description: "Direct links to specific courses, tutorials, and documentation tailored to your skill gaps.",
  },
  {
    icon: ListTodo,
    title: "Weekly Action Checklist",
    description: "A printable weekly tracker to stay accountable as you progress through your roadmap.",
  },
  {
    icon: TrendingUp,
    title: "Skill Tracking Checkboxes",
    description: "Visual progress indicators for each skill so you can see how far you've come.",
  },
  {
    icon: Lightbulb,
    title: "Customized Portfolio Project Ideas",
    description: "Specific project ideas tailored to your target role that demonstrate real-world skills.",
  },
];

export default function PricingPage() {
  const router = useRouter();

  const handleUnlockPDF = () => {
    const checkoutUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PDF_CHECKOUT;
    if (checkoutUrl) {
      // Real payment — redirect to Lemon Squeezy
      window.location.href = checkoutUrl;
    } else {
      // No checkout URL configured — send to home to run analysis first
      // In dev, you can test payment via the [DEV] button on the results page
      router.push("/?from=pricing");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get Your Complete <span className="gradient-text">Personalized Roadmap Guide</span>
            </h1>
            <p className="text-xl text-[var(--foreground)]/70 max-w-xl mx-auto">
              Take your career analysis to the next level with a comprehensive, printable PDF guide.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 md:p-12 card-glow">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 rounded-full text-[var(--accent)] text-sm font-medium mb-4">
                Limited Time Offer
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold gradient-text">$9</span>
                <span className="text-xl text-[var(--foreground)]/50">One-Time Purchase</span>
              </div>
              <p className="text-[var(--foreground)]/60">
                No monthly fees. No subscriptions. Pay once, keep forever.
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-4 p-4 bg-[var(--background)] rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-[var(--foreground)]/70">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUnlockPDF}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Unlock My PDF Roadmap
            </button>

            <p className="text-center text-xs text-[var(--foreground)]/50 mt-4">
              30-day money-back guarantee • Instant digital delivery
            </p>
          </div>

          <div className="mt-12 text-center">
            <div className="glass rounded-xl p-6 max-w-md mx-auto">
              <p className="text-[var(--foreground)]/70 mb-4">
                Already have your free analysis? Your PDF upgrade includes:
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--tag-green-text)]" />
                  <span>Everything from your free analysis, formatted for print</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--tag-green-text)]" />
                  <span>Additional resources section not available in free version</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--tag-green-text)]" />
                  <span>Exclusive project ideas based on your specific gaps</span>
                </li>
              </ul>
            </div>
          </div>
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
    </div>
  );
}
