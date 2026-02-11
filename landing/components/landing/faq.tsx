"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is it really free?",
    answer:
      "Yes, 100% free forever. BrowserBuddy AI is built as a passion project and will always remain completely free to use. No hidden charges, no premium tiers, no catch.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Some features like Reading Mode and basic Tab Management work offline. Features that require AI processing (Content Simplifier, Smart Bookmarks categorization) need an internet connection to communicate with the Groq AI API.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. BrowserBuddy AI follows a privacy-first approach. Your browsing data stays local on your device. We don't collect, store, or sell any personal information. AI processing happens through secure API calls with no data retention.",
  },
  {
    question: "Which browsers are supported?",
    answer:
      "BrowserBuddy AI works on all Chromium-based browsers including Google Chrome, Microsoft Edge, Brave, Opera, and Vivaldi. We're exploring Firefox support for the future.",
  },
  {
    question: "How do I report bugs?",
    answer:
      "You can report bugs by opening an issue on our GitHub repository. We actively monitor and respond to all bug reports. Community contributions and pull requests are also welcome!",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="relative py-32 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-[#e67e22]/20 bg-[#e67e22]/10 px-4 py-1 text-sm text-[#e67e22]">
            FAQ
          </span>
          <h2 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            Frequently asked
            <br />
            <span className="gradient-text">questions</span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={`faq-${i}`}
                value={`item-${i}`}
                className="overflow-hidden rounded-xl border border-border bg-card px-6 transition-colors duration-300 data-[state=open]:border-[rgba(230,126,34,0.3)]"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline hover:text-[#e67e22] [&[data-state=open]]:text-[#e67e22]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
