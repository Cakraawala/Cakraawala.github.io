"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
  {
    type: "work",
    role: "Fullstack Developer",
    company: "IT Solutions",
    period: "2025 - Present",
    desc: "Developing and maintaining fullstack web applications using Laravel, React, and Next.js. Responsible for building scalable APIs, integrating frontend interfaces, and optimizing system performance.",
    tags: ["Laravel", "React", "Next.js", "API Development"],
  },
  {
    type: "work",
    role: "Junior Web Developer",
    company: "IT Solutions",
    period: "2023 - 2025",
    desc: "Contributed to web application development using Laravel and modern frontend technologies. Worked on feature implementation, bug fixing, and improving application performance while collaborating within a development team.",
    tags: ["Laravel", "PHP", "MySQL", "JavaScript"],
  },
  {
    type: "work",
    role: "Junior Developer Intern",
    company: "Startup Beta",
    period: "2022",
    desc: "Interned at a local startup, gaining experience in professional workflows, version control, and code reviews, while developing features using Laravel.",
    tags: ["Laravel", "Git", "PHP", "CSS"],
  },
  {
    type: "edu",
    role: "Software Engineering Student",
    company: "SMK Engineering",
    period: "2020 - 2023",
    desc: "Studied fundamental concepts of software engineering, including programming, algorithms, and database systems. Gained hands-on experience through practical projects and collaborative development.",
    tags: ["Programming", "Algorithms", "Database", "Software Engineering"],
  },

];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref} className="section-padding max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-12"
      >
        <span className="text-primary font-mono text-sm">04.</span>
        <span className="text-2xl md:text-3xl font-bold text-soft">Experience</span>
        <span className="flex-1 h-px bg-line ml-4 hidden md:block" />
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-line md:-translate-x-px"
        />

        <div className="space-y-10">
          {experiences.map((exp, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.13 }}
                className={`relative pl-12 md:pl-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"
                  }`}
              >
                {/* Dot */}
                <div
                  className={`absolute w-2 h-2 rounded-full border-2 top-6 ${exp.type === "work"
                    ? "bg-primary border-primary"
                    : "bg-muted border-muted"
                    } left-3 md:left-auto ${isLeft ? "md:-right-[calc(2rem+3px)]" : "md:-left-[calc(2rem+3px)]"
                    }`}
                />

                {/* Card */}
                <div className="group p-5 rounded-2xl bg-surface border border-line hover:border-white/10 transition-all duration-300">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {exp.type === "work" ? (
                          <Briefcase size={13} className="text-primary" />
                        ) : (
                          <GraduationCap size={13} className="text-muted" />
                        )}
                        <h3 className="font-bold text-soft text-sm md:text-base">{exp.role}</h3>
                      </div>
                      <div className="text-muted text-sm mt-0.5">{exp.company}</div>
                    </div>
                    <span className="text-xs text-muted/60 font-mono whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-3">{exp.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-md bg-bg border border-line text-muted font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
