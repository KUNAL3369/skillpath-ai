"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-[var(--card)] border-b border-[var(--foreground)]/10 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">SkillPath AI</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === link.href
                  ? "text-[var(--accent)] bg-[var(--accent)]/10"
                  : "text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--card)]"
              )}
            >
              {link.label}
            </Link>
          ))}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 ml-2 rounded-lg hover:bg-[var(--card)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}