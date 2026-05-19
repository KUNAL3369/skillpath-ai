"use client";

import Link from "next/link";
import { Target, TrendingUp, Globe, Shield } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Honest Analysis",
    description:
      "We tell you exactly what's missing, not what you want to hear. Real gaps, real solutions.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven",
    description:
      "Our AI analyzes millions of job postings to identify what skills actually matter in the market.",
  },
  {
    icon: Globe,
    title: "Global + Local",
    description:
      "From TCS to Google, from remote startups to Fortune 500s - we know what works everywhere.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data stays yours. We don't sell your information, and all analysis is done securely.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <section className="mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">SkillPath AI</span>
            </h1>
            <p className="text-xl text-[var(--foreground)]/80 leading-relaxed mb-8">
              SkillPath AI was born from a simple frustration: job descriptions ask for
              everything, but no one tells you what you actually need to learn to get hired.
            </p>
            <p className="text-lg text-[var(--foreground)]/70 leading-relaxed">
              We combine AI with real hiring data to give you an honest gap analysis and a
              clear roadmap. Whether you&apos;re switching careers or leveling up, we help you
              focus on what matters most.
            </p>
          </section>

          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, idx) => (
                <div
                  key={idx}
                  className="glass rounded-xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-[var(--text-secondary)]">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <p className="text-lg text-[var(--text-secondary)] italic">
              Built by a small team of engineers and career coaches who believe everyone deserves a clear path forward.
            </p>
          </section>

          <section className="glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to close your career gap?</h2>
            <p className="text-[var(--foreground)]/70 mb-6">
              Join thousands of professionals who have accelerated their careers with SkillPath AI.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Start Free Analysis
            </Link>
          </section>
        </div>
      </main>

      <footer className="py-8 px-4 border-t border-[var(--card)]">
        <div className="max-w-6xl mx-auto text-center text-sm text-[var(--foreground)]/50">
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