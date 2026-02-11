"use client"

import { motion } from "framer-motion"
import { Download, SlidersHorizontal, Zap, Sparkles } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Download,
    title: "Install Extension",
    description: "Click 'Add to Chrome' - takes just 5 seconds to get started.",
    color: "#e67e22",
  },
  {
    step: "02",
    icon: SlidersHorizontal,
    title: "Set Your Preferences",
    description:
      "Customize settings to match your workflow and browsing habits.",
    color: "#3498db",
  },
  {
    step: "03",
    icon: Zap,
    title: "Start Browsing Smarter",
    description:
      "AI works in the background while you focus on what matters most.",
    color: "#e67e22",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Enjoy AI Features",
    description:
      "Access all 7 powerful features with a single click from any tab.",
    color: "#3498db",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 px-6">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#e67e22]/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-[#3498db]/20 bg-[#3498db]/10 px-4 py-1 text-sm text-[#3498db]">
            How It Works
          </span>
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Get started in
            <br />
            <span className="gradient-text">under a minute</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Connection line */}
          <div className="absolute left-0 right-0 top-16 hidden h-[1px] bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative text-center"
            >
              {/* Step number circle */}
              <div className="relative z-10 mx-auto mb-6 flex h-32 w-32 items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                  style={{ backgroundColor: step.color }}
                />
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    boxShadow: `0 0 0 0 ${step.color}00`,
                  }}
                >
                  <step.icon
                    className="h-7 w-7"
                    style={{ color: step.color }}
                  />
                </div>
              </div>

              {/* Step label */}
              <div
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: step.color }}
              >
                Step {step.step}
              </div>

              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
