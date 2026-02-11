"use client"

import { Github, FileText, Lock } from "lucide-react"

const links = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Documentation", href: "#", icon: FileText },
  { label: "Privacy Policy", href: "#", icon: Lock },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e67e22]">
                <span className="text-sm font-bold text-background">B</span>
              </div>
              <span className="font-heading text-base font-bold text-foreground">
                BrowserBuddy <span className="text-[#e67e22]">AI</span>
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Built with care for a College Final Year Project
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>{"© 2025 BrowserBuddy AI. All rights reserved."}</p>
          <p>
            Powered by{" "}
            <span className="text-[#e67e22]">Groq AI</span> &{" "}
            <span className="text-[#3498db]">Llama 3.3</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
