"use client"

import { motion } from "framer-motion"

const technologies = [
  {
    name: "React.js",
    description: "UI Framework",
    color: "#3498db",
    letter: "R",
  },
  {
    name: "Node.js",
    description: "Runtime",
    color: "#27ae60",
    letter: "N",
  },
  {
    name: "Express",
    description: "Backend",
    color: "#e67e22",
    letter: "E",
  },
  {
    name: "MongoDB",
    description: "Database",
    color: "#27ae60",
    letter: "M",
  },
  {
    name: "Groq AI",
    description: "AI Engine",
    color: "#e67e22",
    letter: "G",
  },
  {
    name: "Chrome API",
    description: "Extension",
    color: "#3498db",
    letter: "C",
  },
]

export function TechStack() {
  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3498db]/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-[#e67e22]/20 bg-[#e67e22]/10 px-4 py-1 text-sm text-[#e67e22]">
            Tech Stack
          </span>
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Built with
            <br />
            <span className="gradient-text">modern technologies</span>
          </h2>
        </motion.div>

        {/* Tech grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-[rgba(230,126,34,0.3)] hover:shadow-lg"
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${tech.color}15`,
                  color: tech.color,
                }}
              >
                {tech.letter}
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {tech.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
