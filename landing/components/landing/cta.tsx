"use client"

import { motion } from "framer-motion"
import { Download, ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center md:p-20"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e67e22]/10 via-transparent to-[#3498db]/10" />
          <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#e67e22]/10 blur-[100px]" />
          <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#3498db]/10 blur-[100px]" />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-heading text-4xl font-bold text-foreground md:text-6xl"
            >
              Ready to Browse
              <br />
              <span className="gradient-text">Smarter?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground"
            >
              Join thousands of users already using BrowserBuddy AI to transform
              their browsing experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="https://chrome.google.com/webstore/category/extensions"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#e67e22] px-8 py-4 text-base font-semibold text-background transition-all duration-300 hover:bg-[#d35400] hover:shadow-[0_0_40px_rgba(230,126,34,0.4)]"
              >
                <Download className="h-5 w-5" />
                Download Extension
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-8 py-4 text-base font-medium text-foreground transition-all duration-300 hover:border-muted-foreground"
              >
                View on GitHub
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
