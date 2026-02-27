"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Zap, DollarSign, Brain, Lock } from "lucide-react"

const stats = [
  {
    icon: Zap,
    value: 6,
    suffix: "",
    label: "AI-Powered Features",
    color: "#e67e22",
  },
  {
    icon: DollarSign,
    value: 100,
    suffix: "%",
    label: "Completely Free",
    color: "#3498db",
  },
  {
    icon: Brain,
    value: 1,
    suffix: "",
    label: "Built with Groq AI",
    prefix: "",
    color: "#e67e22",
  },
  {
    icon: Lock,
    value: 100,
    suffix: "%",
    label: "Privacy Focused",
    color: "#3498db",
  },
]

function AnimatedCounter({
  value,
  suffix = "",
  inView,
}: {
  value: number
  suffix?: string
  inView: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export function Stats() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-[rgba(230,126,34,0.3)]"
            >
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
              </div>
              <div
                className="font-heading text-3xl font-bold md:text-4xl"
                style={{ color: stat.color }}
              >
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
