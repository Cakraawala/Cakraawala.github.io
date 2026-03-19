"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    title: "Frontend",
    color: "primary",
    skills: [
      { name: "React / Next.js", level: 80 },
      { name: "TypeScript", level: 75 },
      { name: "Tailwind CSS", level: 87 },
      { name: "Flutter", level: 60 },
    ],
  },
  {
    title: "Backend",
    color: "accent",
    skills: [
      { name: "Laravel & PHP", level: 90 },
      { name: "REST API Design", level: 85 },
      { name: "MySQL", level: 85 },
      { name: "MongoDB", level: 80 },
    ],
  },
  {
    title: "Others",
    color: "primary",
    skills: [
      { name: "Git / GitHub", level: 90 },
      { name: "Python", level: 75 },
      // { name: "Figma", level: 80 },
      // { name: "Docker (basics)", level: 60 },
    ],
  },
];

const techBadges = [
  "React.js", "Next.js", "TypeScript", "Tailwind", "PHP",
  "Laravel", "MongoDB", "MySQL", "Git",
  "REST API", "Python", "Flutter (learning)", "Docker (learning)"
];

function SkillBar({ name, level, color, delay }: {
  name: string; level: number; color: string; delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const barColor = color === "accent" ? "bg-accent" : "bg-primary";

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-soft/80">{name}</span>
        <span className="text-muted font-mono">{level}%</span>
      </div>
      <div className="h-px rounded-full bg-line overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref} className="section-padding max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-12"
      >
        <span className="text-primary font-mono text-sm">02.</span>
        <span className="text-2xl md:text-3xl font-bold text-soft">Skills</span>
        <span className="flex-1 h-px bg-line ml-4 hidden md:block" />
      </motion.div>

      {/* Skill grids */}
      <div className="grid md:grid-cols-3 gap-6 mb-14">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 + ci * 0.12 }}
            className="p-6 rounded-2xl bg-surface border border-line hover:border-white/10 transition-all duration-300 space-y-5"
          >
            <h3 className={`font-semibold text-xs uppercase tracking-[0.15em] ${cat.color === "accent" ? "text-accent" : "text-primary"}`}>
              {cat.title}
            </h3>
            <div className="space-y-4">
              {cat.skills.map((skill, si) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={cat.color}
                  delay={0.2 + ci * 0.1 + si * 0.08}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tech badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <p className="text-muted/60 text-xs font-mono mb-4 text-center">// tech I work with \\</p>
        <div className="flex flex-wrap justify-center gap-2">
          {techBadges.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.55 + i * 0.04 }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface border border-line text-muted hover:text-soft hover:border-white/15 transition-all cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
