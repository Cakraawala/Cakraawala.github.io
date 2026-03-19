"use client";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Instagram, Mail } from "lucide-react";
import TypewriterClient from "./TypewriterClient";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const socialLinks = [
  { icon: Github, href: "https://github.com/Cakraawala", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/cakra-205ab8275", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/cakra.dev", label: "Instagram" },
  { icon: Mail, href: "#contact", label: "Email" },
];

export default function Hero() {
  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Background decorators */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full bg-primary/[0.06] blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center max-w-4xl"
      >
        {/* Available badge */}
        <motion.div variants={item} className="inline-flex items-center gap-2 mb-6">
          <span className="h-px w-6 bg-primary/60" />
          <span className="text-muted text-xs font-mono tracking-[0.2em] uppercase">
            Code with purpose, not just logic.
          </span>
          <span className="h-px w-6 bg-primary/60" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-tight mb-4"
        >
          Hi, I&apos;m <span className="gradient-text">Cakra</span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div variants={item} className="flex justify-center">
          <TypewriterClient
            texts={["Frontend Developer", "Backend Developer", "Full Stack Developer"]}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          variants={item}
          className="mt-6 text-soft/55 text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Crafting modern digital experiences with clean code and thoughtful website. <br />
          Passionate about building things that live on the web.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <button
            onClick={() => scrollTo("#projects")}
            className="px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-blue-600 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            View Projects
          </button>
          {/* <button
            onClick={() => scrollTo("#contact")}
            className="px-8 py-3.5 rounded-xl border border-line text-muted font-semibold text-sm hover:border-white/20 hover:text-soft transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Contact Me
          </button> */}
        </motion.div>

        {/* Socials */}
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-3 mt-8"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="w-10 h-10 rounded-xl border border-line flex items-center justify-center text-muted hover:text-soft hover:border-white/20 transition-all duration-300"
            >
              <Icon size={16} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/40"
      >
        <span className="text-xs font-mono tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown size={15} />
        </motion.div>
      </motion.div>
    </section>
  );
}
