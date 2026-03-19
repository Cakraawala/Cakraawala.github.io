"use client";
// import { motion, useInView } from "framer-motion";
// import { Mail, Github, Linkedin, Send, MapPin, MessageSquare } from "lucide-react";
// import { useInView } from "framer-motion";
// import { useRef, useState } from "react";
import { useRef } from "react";
// import { Mail, Github, Linkedin } from "lucide-react";

// const contactLinks = [
//   {
//     icon: Mail,
//     label: "Email",
//     value: "anggercakrawala@gmail.com",
//     href: "mailto:anggercakrawala@gmail.com",
//     color: "primary",
//   },
//   {
//     icon: Github,
//     label: "GitHub",
//     value: "github.com/Cakraawala",
//     href: "https://github.com/Cakraawala",
//     color: "accent",
//   },
//   {
//     icon: Linkedin,
//     label: "LinkedIn",
//     value: "linkedin.com/in/cakra-205ab8275",
//     href: "https://www.linkedin.com/in/cakra-205ab8275",
//     color: "primary",
//   },
// ];

export default function Contact() {
  const ref = useRef(null);
  // const isInView = useInView(ref, { once: true, margin: "-80px" });
  // const [sent, setSent] = useState(false);
  // const [form, setForm] = useState({ name: "", email: "", message: "" });
  // const [setSent] = useState(false);
  // const [setForm] = useState({ name: "", email: "", message: "" });

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // In production, connect to your API / email ser vice
  //   setSent(true);
  //   setTimeout(() => setSent(false), 4000);
  //   setForm({ name: "", email: "", message: "" });
  // };

  return (
    <section id="contact" ref={ref} className="section-padding max-w-7xl mx-auto">
      {/* <>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <span className="text-primary font-mono text-sm">05.</span>
          <span className="text-2xl md:text-3xl font-bold text-soft">Contact</span>
          <span className="flex-1 h-px bg-line ml-4 hidden md:block" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          className="text-muted mb-12 max-w-xl"
        >
          Punya proyek menarik? Atau cuma mau ngobrol soal tech? Feel free to reach out!
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-muted font-mono">Name</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-soft text-sm placeholder:text-muted/40 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted font-mono">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-soft text-sm placeholder:text-muted/40 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted font-mono">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Halo Cakra, saya mau..."
                className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-soft text-sm placeholder:text-muted/40 focus:outline-none focus:border-white/20 transition-all resize-none"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-blue-600 transition-all hover:shadow-xl hover:shadow-primary/20"
            >
              {sent ? (
                <>
                  <MessageSquare size={16} />
                  Message Sent!
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {contactLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/25 hover:bg-primary/5 transition-all group"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.color === "accent"
                    ? "bg-surface border border-line text-muted group-hover:text-soft group-hover:border-white/15"
                    : "bg-surface border border-line text-muted group-hover:text-primary group-hover:border-white/15"
                    } transition-colors`}
                >
                  <link.icon size={18} />
                </div>
                <div>
                  <div className="text-xs text-muted/50 font-mono">{link.label}</div>
                  <div className="text-muted text-sm group-hover:text-soft transition-colors">
                    {link.value}
                  </div>
                </div>
              </motion.a>
            ))}

            <div className="flex items-center gap-3 px-4 py-3 text-soft/40 text-sm">
              <MapPin size={14} />
              <span>Indonesia 🇮🇩</span>
            </div>
          </motion.div>
        </div>
      </> */}
    </section>
  );
}
