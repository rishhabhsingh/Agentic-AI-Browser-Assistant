"use client"

import { motion } from "framer-motion"
import {
  Layers,
  FileText,
  BookOpen,
  Bookmark,
  PenTool,
  FileCheck,
  Settings,
  Youtube,
} from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Smart Tab Manager",
    description:
      "AI detects duplicate tabs and suggests cleanup. Never lose track again.",
    color: "#e67e22",
  },
  {
    icon: FileText,
    title: "Content Simplifier",
    description:
      "Transform complex content into 4 reading levels. From ELI5 to Technical.",
    color: "#3498db",
  },
  {
    icon: Youtube,
    title: "YouTube Summaries",
    description:
      "Get AI-powered summaries of YouTube videos instantly. Save time and capture key insights in seconds.",
    color: "#FF0000",
  },
  {
    icon: BookOpen,
    title: "Reading Mode",
    description:
      "Distraction-free reading with customizable fonts and dark mode.",
    color: "#e67e22",
  },
  {
    icon: Bookmark,
    title: "Smart Bookmarks",
    description:
      "AI automatically categorizes your bookmarks. Never search again.",
    color: "#3498db",
  },
  {
    icon: FileCheck,
    title: "Resume Optimizer",
    description:
      "Match your resume to job descriptions. ATS-friendly templates.",
    color: "#3498db",
  },
  {
    icon: Settings,
    title: "Full Customization",
    description:
      "Dark/light mode, keyboard shortcuts, and complete control.",
    color: "#e67e22",
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-[#e67e22]/20 bg-[#e67e22]/10 px-4 py-1 text-sm text-[#e67e22]">
            Features
          </span>
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Everything you need to
            <br />
            <span className="gradient-text">browse smarter</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Six AI-powered tools designed to eliminate friction and supercharge
            your browsing workflow.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:border-[rgba(230,126,34,0.3)] hover:shadow-[0_0_40px_rgba(230,126,34,0.08)]"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.color}08, transparent 60%)`,
                }}
              />

              <div className="relative z-10">
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon
                    className="h-6 w-6"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: feature.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
