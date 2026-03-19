"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Palette, Zap } from "lucide-react";

const traits = [
  {
    icon: Code2,
    title: "Clean Code",
    desc: "Writing maintainable, scalable, and well-structured code is a priority in everything I build.",
  },
  {
    icon: Palette,
    title: "Design Sense",
    desc: "Bridging the gap between developers and designers, creating interfaces that are both beautiful and functional.",
  },
  {
    icon: Zap,
    title: "Performance",
    desc: "Obsessed with fast load times, smooth animations, and optimal user experiences on any device.",
  },
];

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "10+", label: "Projects Built" },
  { value: "7+", label: "Stack" },
  { value: "20+", label: "Tools & Experiments" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="section-padding max-w-7xl mx-auto">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-12"
      >
        <span className="text-primary font-mono text-sm">01.</span>
        <span className="text-2xl md:text-3xl font-bold text-soft">About Me</span>
        <span className="flex-1 h-px bg-line ml-4 hidden md:block" />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left - text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-5"
        >
          <p className="text-muted leading-relaxed text-base md:text-lg">
            Hi, I'm a Web Developer with 3+ years of experience, specializing in building modern and scalable web applications.
            

            Outside of development, I enjoy exploring new technologies, contributing to ideas, and refining UI to create better user experiences. I believe great technology is not just powerful, but also simple and useful.
          </p>
          <p className="text-muted leading-relaxed text-base md:text-lg">
            I primarily work with Laravel, React, and Next.js, with strong experience in both SQL and NoSQL databases. I also use PHP and Python to develop efficient and reliable backend systems..
          </p>
          <p className="text-muted leading-relaxed text-base md:text-lg">
            I focus on{" "}
            <span className="text-soft font-medium">writing clean</span>,{" "}
            <span className="text-primary font-medium">maintainable code</span>, and{" "}
            <span className="text-soft font-medium">building products that are fast, accessible, and user-friendly</span>.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="bg-surface border border-line rounded-xl p-4 hover:border-white/10 transition-colors"
              >
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-soft/35 text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - trait cards */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="space-y-4"
        >
          {traits.map((trait, i) => (
            <motion.div
              key={trait.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.1 }}
              className="group flex gap-4 p-5 rounded-2xl bg-surface border border-line hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <trait.icon size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-soft mb-1">{trait.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{trait.desc}</p>
              </div>
            </motion.div>
          ))}

          {/* Floating card decoration */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="p-5 rounded-2xl bg-surface border border-line"
          >
            <div className="font-mono text-xs text-primary/60 mb-2">// currently</div>
            <div className="text-muted text-sm">
              Building cool stuff with{" "}
              <span className="text-soft font-medium">Next.js, React.js</span> &{" "}
              <span className="text-primary font-medium">TypeScript</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
