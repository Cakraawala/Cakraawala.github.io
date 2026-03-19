import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Archive, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Archive - Cakraawala",
  description: "Portfolio v1 archive - the original static site",
};

export default function ArchivePage() {
  return (
    <main className="bg-bg min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <Archive size={28} className="text-primary" />
        </div>

        <h1 className="text-3xl font-bold text-soft mb-3">Portfolio Archive</h1>
        <p className="text-soft/55 mb-2 leading-relaxed">
          This is the archive of the original portfolio v1 - a static site built
          with Bootstrap & jQuery before the Next.js redesign.
        </p>
        <p className="text-soft/35 text-sm font-mono mb-8">circa 2024</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/archive/index.html"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            <ExternalLink size={15} />
            View Archive
          </a>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-soft/70 font-semibold text-sm hover:border-accent/40 hover:text-accent transition-all"
          >
            <ArrowLeft size={15} />
            Back to Main Site
          </Link>
        </div>
      </div>
    </main>
  );
}
