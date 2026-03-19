"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterClientProps {
  texts: string[];
}

export default function TypewriterClient({ texts }: TypewriterClientProps) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index % texts.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, texts]);

  return (
    <h2 className="text-xl md:text-2xl font-mono text-muted h-8">
      <span className="text-primary/60">&gt;</span>{" "}
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block ml-0.5 w-px h-5 bg-soft align-middle"
      />
    </h2>
  );
}
