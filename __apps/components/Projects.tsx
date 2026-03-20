"use client";
// import { motion, useInView } from "framer-motion";
// import { useRef, useState } from "react";
// import { ExternalLink, Github } from "lucide-react";

// const projects = [
//   {
//     title: "Portfolio v1 (Archive)",
//     desc: "The original portfolio site - static HTML/CSS/JS with Bootstrap. Now archived and accessible at /archive.",
//     tags: ["HTML", "CSS", "Bootstrap", "jQuery"],
//     github: "https://github.com/Cakraawala",
//     live: "/archive/index.html",
//     featured: false,
//     color: "from-white/[0.02] to-transparent",
//     status: "soon",
//   },
//   {
//     title: "Project Alpha",
//     desc: "A full-stack web application built with Next.js and Node.js. Features real-time updates, authentication, and a modern dashboard UI.",
//     tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
//     github: "#",
//     live: "#",
//     featured: true,
//     color: "from-primary/10 to-transparent",
//     status: "soon",
//   },
//   {
//     title: "UI Component Library",
//     desc: "A custom React component library with Tailwind CSS, featuring 40+ accessible and animated components for rapid development.",
//     tags: ["React", "TypeScript", "Tailwind", "Storybook"],
//     github: "#",
//     live: "#",
//     featured: true,
//     color: "from-primary/8 to-transparent",
//     status: "soon",
//   },
//   {
//     title: "REST API Service",
//     desc: "Scalable REST API with Laravel, featuring JWT authentication, rate limiting, and comprehensive documentation via Swagger.",
//     tags: ["Laravel", "PHP", "MySQL", "Docker"],
//     github: "#",
//     live: "#",
//     featured: false,
//     color: "from-white/[0.03] to-transparent",
//     status: "soon",
//   },
//   {
//     title: "Dashboard Analytics",
//     desc: "Real-time analytics dashboard with interactive charts, dark mode, and customizable widgets built with React.",
//     tags: ["React", "Chart.js", "TailwindCSS", "REST API"],
//     github: "#",
//     live: "#",
//     featured: false,
//     color: "from-primary/8 to-transparent",
//     status: "soon",
//   },
//   {
//     title: "E-Commerce Platform",
//     desc: "Full-featured e-commerce solution with cart, payment integration, inventory management, and admin panel.",
//     tags: ["Next.js", "Node.js", "Stripe", "MongoDB"],
//     github: "#",
//     live: "#",
//     featured: false,
//     color: "from-primary/10 to-transparent",
//     status: "soon",
//   },
// ];

export default function Projects() {
  // const ref = useRef(null);
  // const isInView = useInView(ref, { once: true, margin: "-80px" });
  // const [filter, setFilter] = useState<"all" | "featured">("all");

  // const shown = filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    // <section id="projects" ref={ref} className="section-padding max-w-7xl mx-auto">
    //   {/* Header */}
    //   <motion.div
    //     initial={{ opacity: 0, x: -20 }}
    //     animate={isInView ? { opacity: 1, x: 0 } : {}}
    //     transition={{ duration: 0.5 }}
    //     className="flex items-center gap-3 mb-4"
    //   >
    //     <span className="text-primary font-mono text-sm">03.</span>
    //     <span className="text-2xl md:text-3xl font-bold text-soft">Projects</span>
    //     <span className="flex-1 h-px bg-line ml-4 hidden md:block" />
    //   </motion.div>

    //   {/* Filter tabs */}
    //   <motion.div
    //     initial={{ opacity: 0 }}
    //     animate={isInView ? { opacity: 1 } : {}}
    //     transition={{ delay: 0.2 }}
    //     className="flex gap-2 mb-10"
    //   >
    //     {(["all", "featured"] as const).map((f) => (
    //       <button
    //         key={f}
    //         onClick={() => setFilter(f)}
    //         className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f
    //           ? "bg-primary text-white"
    //           : "text-muted hover:text-soft border border-line hover:border-white/15"
    //           }`}
    //       >
    //         {f.charAt(0).toUpperCase() + f.slice(1)}
    //       </button>
    //     ))}
    //   </motion.div>

    //   {/* Project grid */}
    //   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
    //     {shown.map((project, i) => (
    //       <motion.div
    //         key={project.title}
    //         layout
    //         initial={{ opacity: 0, y: 30 }}
    //         animate={isInView ? { opacity: 1, y: 0 } : {}}
    //         transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
    //         className={`group relative p-6 rounded-2xl bg-surface border border-line transition-all duration-300 flex flex-col ${project.status === "soon"
    //           ? "opacity-50 cursor-not-allowed pointer-events-none"
    //           : "hover:border-white/10 hover:-translate-y-1"
    //           }`}
    //       >
    //         {/* Background gradient */}
    //         <div
    //           className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none`}
    //         />

    //         {/* Soon badge */}
    //         {project.status === "soon" && (
    //           <span className="absolute top-4 right-4 text-[10px] font-mono text-muted/50 border border-line rounded-full px-2 py-0.5">
    //             soon
    //           </span>
    //         )}
    //         {project.status === "soon" ? (
    //           <div className="relative flex flex-col h-full">
    //             {project.featured && (
    //               <span className="self-start mb-3 px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
    //                 Featured
    //               </span>
    //             )}

    //             <h3 className="font-bold text-soft group-hover:text-white transition-colors mb-2">
    //               {project.title}
    //             </h3>
    //             {/* <p className="text-muted text-sm leading-relaxed flex-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore deleniti voluptatum quos autem, quis doloremque eos minima officiis dolorum eveniet vero natus ratione, enim maiores iste in. Dolores, consectetur dolorum!</p> */}

    //             {/* Tags */}
    //             <div className="flex flex-wrap gap-2 mt-4">
    //               {project.tags.map((tag) => (
    //                 <span
    //                   key={tag}
    //                   className="text-xs px-2 py-0.5 rounded-md bg-bg border border-line text-muted font-mono"
    //                 >
    //                   {tag}
    //                 </span>
    //               ))}
    //             </div>

    //           </div>
    //         ) : (
    //           <div className="relative flex flex-col h-full">
    //             {project.featured && (
    //               <span className="self-start mb-3 px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
    //                 Featured
    //               </span>
    //             )}

    //             <h3 className="font-bold text-soft group-hover:text-white transition-colors mb-2">
    //               {project.title}
    //             </h3>
    //             <p className="text-muted text-sm leading-relaxed flex-1">{project.desc}</p>

    //             {/* Tags */}
    //             <div className="flex flex-wrap gap-2 mt-4">
    //               {project.tags.map((tag) => (
    //                 <span
    //                   key={tag}
    //                   className="text-xs px-2 py-0.5 rounded-md bg-bg border border-line text-muted font-mono"
    //                 >
    //                   {tag}
    //                 </span>
    //               ))}
    //             </div>

    //             {/* Links */}
    //             <div className="flex gap-3 mt-4 pt-4 border-t border-line">
    //               {project.github !== "#" && (
    //                 <a
    //                   href={project.github}
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   className="flex items-center gap-1.5 text-xs text-muted hover:text-soft transition-colors"
    //                 >
    //                   <Github size={13} /> Code
    //                 </a>
    //               )}
    //               {project.live !== "#" && (
    //                 <a
    //                   href={project.live}
    //                   target={project.live.startsWith("http") ? "_blank" : undefined}
    //                   rel={project.live.startsWith("http") ? "noopener noreferrer" : undefined}
    //                   className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors"
    //                 >
    //                   <ExternalLink size={13} /> Live
    //                 </a>
    //               )}
    //             </div>
    //           </div>
    //         )}

    //       </motion.div>
    //     ))}
    //   </div>
    // </section>
    <></>
  );
}
