"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  // { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
//   { label: "Contact", href: "#contact" },
  { label: "Tools", href: "/tools" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Set active based on current route
  useEffect(() => {
    if (pathname.startsWith("/tools")) {
      setActive("/tools");
    } else if (pathname === "/") {
      setActive("home");
    }
  }, [pathname]);

  // Handle hash scroll when navigating from another page
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const timer = setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/")) {
      // Page navigation
      setActive(href);
      router.push(href);
    } else {
      // Anchor link - if not on home page, go home first then scroll
      const section = href.replace("#", "");
      setActive(section);
      if (pathname !== "/") {
        router.push(`/${href}`);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg/90 backdrop-blur-xl border-b border-line shadow-2xl shadow-black/60"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          {/* Logo */}
          <motion.span
            className="font-mono text-lg font-semibold gradient-text cursor-pointer select-none"
            onClick={() => handleNav("#home")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            &lt;cakra /&gt;
          </motion.span>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.href.startsWith("/")
                ? active === link.href
                : active === link.href.replace("#", "");
              return (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className={`relative px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "text-soft"
                        : "text-muted hover:text-soft"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-surface border border-line"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-soft/70 hover:text-soft transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-bg/95 backdrop-blur-xl border-b border-line px-6 py-4 flex flex-col gap-2 md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-left py-3 px-4 rounded-xl text-muted hover:text-soft hover:bg-surface transition-all text-sm"
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
