"use client"

import { motion } from "framer-motion"
import { Download, Play, Shield, CreditCard, Sparkles } from "lucide-react"

const trustBadges = [
  { icon: Sparkles, label: "Free Forever" },
  { icon: CreditCard, label: "No Credit Card" },
  { icon: Shield, label: "Privacy First" },
]

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Mesh gradient background */}
      <div className="mesh-gradient absolute inset-0" />

      {/* Animated orbs */}
      <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] animate-float rounded-full bg-[#e67e22]/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] animate-float-delayed rounded-full bg-[#3498db]/5 blur-[120px]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e67e22]/20 bg-[#e67e22]/10 px-4 py-1.5 text-sm text-[#e67e22]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Groq AI & Llama 3.3
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="text-foreground">Your AI-Powered</span>
          <br />
          <span className="gradient-text">Browsing Assistant</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          Stop juggling tabs, simplifying content manually, and wasting time.
          Let AI do the heavy lifting.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="https://chrome.google.com/webstore/category/extensions"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-[#e67e22] px-8 py-4 text-base font-semibold text-background transition-all duration-300 hover:bg-[#d35400] hover:shadow-[0_0_40px_rgba(230,126,34,0.4)] animate-pulse-glow"
          >
            <Download className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            Download Free Extension
          </a>
          <button
            type="button"
            className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-transparent px-8 py-4 text-base font-medium text-foreground transition-all duration-300 hover:border-[#3498db]/50 hover:bg-[#3498db]/10"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3498db]/20 transition-colors duration-300 group-hover:bg-[#3498db]/30">
              <Play className="h-3.5 w-3.5 text-[#3498db]" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <badge.icon className="h-4 w-4 text-[#e67e22]" />
              {badge.label}
            </div>
          ))}
        </motion.div>

        {/* Browser mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-[#e67e22]/5">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <div className="ml-4 flex-1 rounded-md bg-background/50 px-4 py-1 text-xs text-muted-foreground">
                chrome-extension://browserbuddy-ai
              </div>
            </div>
            {/* Content */}
            <div className="relative bg-background/50 p-8 md:p-12">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[
                  { name: "Smart Tabs", color: "#e67e22", width: 82},
                  { name: "Simplifier", color: "#3498db", width: 74},
                  { name: "Reading Mode", color: "#e67e22", width: 74},
                  { name: "Bookmarks", color: "#3498db", width: 74},
                  { name: "Form Filler", color: "#e67e22", width: 74},
                  { name: "Resume AI", color: "#3498db", width: 74},
                ].map((item) => (
                  <div
                    key={item.name}
                    className="rounded-xl border border-border bg-card/80 p-4 transition-all duration-300 hover:border-[rgba(230,126,34,0.3)]"
                  >
                    <div
                      className="mb-2 h-2 w-8 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="text-sm font-medium text-foreground">
                      {item.name}
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: item.color,
                          width: `${item.width}%`,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow behind mockup */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-b from-[#e67e22]/10 via-transparent to-[#3498db]/5 blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}
