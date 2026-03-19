"use client";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-line py-8 px-6 text-center"
    >
      <p className="text-muted/40 text-sm flex items-center justify-center gap-1.5 flex-wrap">
        Built with{" "}
        <Heart size={12} className="text-primary fill-primary" />
        {" "}by{" "}
        <span className="text-muted font-medium">Cakraawala</span>
        {" "}·{" "}
        <span className="font-mono text-xs">Next.js + TypeScript + Tailwind</span>
      </p>
      <p className="text-muted/50 text-xs mt-2 font-mono">
        &copy; {new Date().getFullYear()} Cakraawala
        {" "}·{" "}
        <a href="/archive/index.html" className="hover:text-soft/40 transition-colors underline underline-offset-2">
          View Archive
        </a>
      </p>
    </motion.footer>
  );
}
