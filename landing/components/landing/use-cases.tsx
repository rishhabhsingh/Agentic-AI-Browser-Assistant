"use client"

import { motion } from "framer-motion"
import { GraduationCap, Briefcase, Code, Palette } from "lucide-react"

const useCases = [
  {
    icon: GraduationCap,
    title: "Students",
    quote: "Research papers made easy. I simplified my readings from Technical to ELI5 in seconds.",
    name: "Perfect for academic research",
    color: "#e67e22",
  },
  {
    icon: Briefcase,
    title: "Professionals",
    quote: "Form filling nightmare solved. Auto Form Filler saves me hours every single week.",
    name: "Streamline daily workflows",
    color: "#3498db",
  },
  {
    icon: Code,
    title: "Developers",
    quote: "Tab chaos eliminated. Smart Tab Manager finally brought sanity to my 50+ open tabs.",
    name: "Tame the tab overload",
    color: "#e67e22",
  },
  {
    icon: Palette,
    title: "Content Creators",
    quote: "Reading and research supercharged. Smart Bookmarks auto-organize everything for me.",
    name: "Organize your inspiration",
    color: "#3498db",
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="relative py-32 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-[#3498db]/20 bg-[#3498db]/10 px-4 py-1 text-sm text-[#3498db]">
            Use Cases
          </span>
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Who uses
            <br />
            <span className="gradient-text">BrowserBuddy AI?</span>
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {useCases.map((useCase, i) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-[rgba(230,126,34,0.3)]"
            >
              <div className="flex items-start gap-5">
                <div
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${useCase.color}15` }}
                >
                  <useCase.icon
                    className="h-7 w-7"
                    style={{ color: useCase.color }}
                  />
                </div>
                <div>
                  <h3
                    className="mb-1 text-lg font-bold"
                    style={{ color: useCase.color }}
                  >
                    {useCase.title}
                  </h3>
                  <p className="mb-3 text-base leading-relaxed text-foreground/90">
                    {`"${useCase.quote}"`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {useCase.name}
                  </p>
                </div>
              </div>

              {/* Corner accent */}
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-5 transition-opacity duration-300 group-hover:opacity-10"
                style={{ backgroundColor: useCase.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
