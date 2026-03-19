"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface ToolLayoutProps {
  /** Label tool, e.g. "Calculator" */
  title: string;
  /** Short description shown below title */
  description?: string;
  /** Breadcrumb category slug, default "tools" */
  category?: string;
  children: React.ReactNode;
}

export default function ToolLayout({
  title,
  description,
  category = "tools",
  children,
}: ToolLayoutProps) {
  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-28 pb-20">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={`/${category}`}
            className="inline-flex items-center gap-2 text-muted hover:text-soft text-sm transition-colors mb-8 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Tools
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-10"
        >
          <p className="text-primary font-mono text-xs mb-2">{"// tools"}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-soft mb-2">{title}</h1>
          {description && (
            <p className="text-muted text-sm max-w-lg">{description}</p>
          )}
          <div className="mt-5 h-px w-full bg-line" />
        </motion.div>

        {/* Tool content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}
