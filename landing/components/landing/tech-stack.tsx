"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const technologies = [
  {
    name: "React.js",
    description: "UI Framework",
    color: "#3498db",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Node.js",
    description: "Runtime",
    color: "#27ae60",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Express",
    description: "Backend",
    color: "#e67e22",
    image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0zIC0zIDM4IDM4IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxnIGlkPSJkZWVkaXRvcl9iZ0NhcnJpZXIiIHN0cm9rZS13aWR0aD0iMCI+CiAgICA8cmVjdCBpZD0iZGVlX2NfZSIgeD0iLTMiIHk9Ii0zIiB3aWR0aD0iMzgiIGhlaWdodD0iMzgiIHJ4PSIwIiBmaWxsPSIjMDBCNEFCIiBzdHJva2V3aWR0aD0iMCIvPgogIDwvZz48cGF0aCBkPSJNMzIgMjQuNzk1Yy0xLjE2NC4yOTYtMS44ODQuMDEzLTIuNTMtLjk1N2wtNC41OTQtNi4zNTYtLjY2NC0uODgtNS4zNjUgNy4yNTdjLS42MTMuODczLTEuMjU2IDEuMjUzLTIuNC45NDRsNi44Ny05LjIyMi02LjM5Ni04LjMzYzEuMS0uMjE0IDEuODYtLjEwNSAyLjUzNS44OGw0Ljc2NSA2LjQzNSA0LjgtNi40Yy42MTUtLjg3MyAxLjI3Ni0xLjIwNSAyLjM4LS44ODNsLTIuNDggMy4yODgtMy4zNiA0LjM3NWMtLjQuNS0uMzQ1Ljg0Mi4wMjMgMS4zMjVMMzIgMjQuNzk1ek0uMDA4IDE1LjQyN2wuNTYyLTIuNzY0QzIuMSA3LjE5MyA4LjM3IDQuOTIgMTIuNjk0IDguM2MyLjUyNyAxLjk4OCAzLjE1NSA0LjggMy4wMyA3Ljk1SDEuNDhjLS4yMTQgNS42NyAzLjg2NyA5LjA5MiA5LjA3IDcuMzQ2IDEuODI1LS42MTMgMi45LTIuMDQyIDMuNDM4LTMuODMuMjczLS44OTYuNzI1LTEuMDM2IDEuNTY3LS43OC0uNDMgMi4yMzYtMS40IDQuMTA0LTMuNDUgNS4yNzMtMy4wNjMgMS43NS03LjQzNSAxLjE4NC05LjczNS0xLjI0OEMxIDIxLjYuNDM0IDE5LjgxMi4xOCAxNy45Yy0uMDQtLjMxNi0uMTItLjYxNy0uMTgtLjkycS4wMDgtLjc3Ni4wMDgtMS41NTJ6bTEuNDk4LS4zOGgxMi44NzJjLS4wODQtNC4xLTIuNjM3LTcuMDEyLTYuMTI2LTcuMDM3LTMuODMtLjAzLTYuNTggMi44MTMtNi43NDYgNy4wMzd6IiBmaWxsPSIjMDAwMDAwIi8+PC9zdmc+",
  },
  {
    name: "MongoDB",
    description: "Database",
    color: "#27ae60",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "Groq AI",
    description: "AI Engine",
    color: "#e67e22",
    image: "https://cdn.brandfetch.io/idxygbEPCQ/w/201/h/201/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1668515712972",
  },
  {
    name: "Chrome API",
    description: "Extension",
    color: "#3498db",
    image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg",
  }
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
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${tech.color}15`,
                }}
              >
                <img
                  src={tech.image}
                  alt={tech.name}
                  className="h-8 w-8"
                />
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
