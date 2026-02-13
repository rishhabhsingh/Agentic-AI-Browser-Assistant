# 🤖✨ BrowserBuddy AI

**Your AI-Powered Browsing Assistant** 🌐🧠 -- A free Chrome Extension 🆓🧩 that uses AI to help you browse smarter, not harder 🚀

---

## 📖 About

BrowserBuddy AI is a Chrome extension landing page 🌍 showcasing an AI-powered browsing assistant 🤖⚡ built with **Groq AI** 🧠 and **Llama 3.3** 🦙. The extension provides 7 smart tools 🛠️ designed to eliminate friction and supercharge your browsing workflow 💨 -- from managing tabs 🗂️ and simplifying content 📄 to auto-filling forms 📝 and optimizing resumes 📊.

---

### 🌍 Landing Page

| 🧱 Technology | 🔢 Version | 🎯 Purpose |
| --- | --- | --- |
| ▲ **Next.js** | 16.1.6 | React meta-framework (App Router) |
| ⚛️ **React** | 19.2.3 | UI library |
| 🟦 **TypeScript** | 5.7.3 | Type-safe JavaScript |
| 🎨 **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| 🎞️ **Framer Motion** | 11.15.0 | Scroll-triggered animations & transitions |
| 🧩 **Radix UI** | Various | Accessible headless UI primitives (Accordion, etc.) |
| 🖼️ **Lucide React** | 0.544.0 | Icon library |
| 🧱 **shadcn/ui** | Latest | Pre-built component library |

### 🔤 Fonts

- ✍️ **Inter** -- Body text (clean, modern sans-serif)
- 🚀 **Space Grotesk** -- Headings (geometric, distinctive)

### 🎨 Color Palette

| 🎨 Color | 🔢 Hex | 🧩 Usage |
| --- | --- | --- |
| 🟠 Orange (Primary) | `#e67e22` | CTAs, accents, highlights |
| 🔵 Blue (Secondary) | `#3498db` | Feature alternation, secondary accents |
| 🌑 Dark Background | `hsl(0 0% 7%)` | Page background |
| 🪟 Card Surface | `hsl(0 0% 10%)` | Card backgrounds |
| 🌫️ Muted | `hsl(0 0% 60%)` | Secondary text |
| ⚪ White/Foreground | `hsl(0 0% 96%)` | Primary text |

---

## 🧱 Page Sections

The landing page is built with **11 modular components** 🧩:

1. 🧭 **Navigation** -- Sticky glassmorphism navbar with scroll-aware blur effect and mobile hamburger menu 📱
2. 🌟 **Hero** -- Full-viewport section with animated mesh gradient background 🌈, gradient text headline ✨, trust badges 🛡️, and interactive browser mockup 🖥️
3. 📊 **Stats** -- Animated counters 🔢 that trigger on scroll (7 features, 100% free 🆓, Groq AI 🤖, privacy-focused 🔒)
4. 🗃️ **Features** -- 7-card grid with staggered scroll reveal 🎞️, hover glow effects ✨, and animated bottom accent lines
5. 🛤️ **How It Works** -- 4-step visual timeline ⏳ with connection line, icon circles 🔵, and step-by-step descriptions
6. 👥 **Use Cases** -- Audience-segmented cards for Students 🎓, Professionals 💼, Developers 💻, and Content Creators 🎬
7. 🛠️ **Tech Stack** -- 6-item technology showcase grid 🧱 with icon letter badges 🔤
8. ❓ **FAQ** -- Accordion-style expandable Q&A 📂 using Radix UI primitives
9. 🔥 **CTA** -- Final call-to-action with gradient background glow ✨
10. 🦶 **Footer** -- Minimal footer with branding 🏷️ and navigation links 🔗
11. ⬆️ **Back to Top** -- Floating scroll-to-top button ⬆️ that appears on scroll

---

## 🎬 Design & Animations

- 🪟 **Glassmorphism** -- Frosted-glass navigation with backdrop blur
- 🌈 **Mesh Gradient** -- Multi-radial gradient background on hero section
- 🎞️ **Scroll-Triggered Animations** -- All sections use Framer Motion `whileInView` for staggered reveal
- 🔢 **Animated Counters** -- Stats count up from 0 when scrolled into view
- ✨ **Hover Micro-Interactions** -- Cards scale icons, reveal glow effects, and animate accent lines
- 🔥 **Pulse Glow** -- Primary CTA button pulses with an orange glow
- 🌌 **Floating Orbs** -- Ambient background orbs with CSS float animation
- 🟠 **Custom Scrollbar** -- Orange-themed WebKit scrollbar
- 🌀 **Smooth Scrolling** -- Native CSS `scroll-behavior: smooth`

---

## 📁 Project Structure



## Project Structure

```
app/
  layout.tsx          # Root layout with Inter + Space Grotesk fonts
  page.tsx            # Main page assembling all sections
  globals.css         # Design tokens, custom animations, glass/glow utilities

components/
  landing/
    navigation.tsx    # Sticky glassmorphism navbar
    hero.tsx          # Full-height hero with browser mockup
    stats.tsx         # Animated stat counters
    features.tsx      # Feature cards grid
    how-it-works.tsx  # 4-step timeline
    use-cases.tsx     # Audience cards
    tech-stack.tsx    # Technology showcase
    faq.tsx           # Accordion FAQ
    cta.tsx           # Final CTA section
    footer.tsx        # Site footer
    back-to-top.tsx   # Floating scroll button
  ui/                 # shadcn/ui primitives
```

---

### 📌 Prerequisites

- 🟢 Node.js 18+

---


## 🎯 Target Audience

- 🎓 **Students** -- Academic research, content simplification, reading mode
- 💼 **Professionals** -- Form filling, tab management, workflow optimization
- 💻 **Developers** -- Tab chaos management, smart bookmarks, keyboard shortcuts
- 🎬 **Content Creators** -- Research organization, reading mode, bookmark categorization

---


## 📜 License

This project is open source 🆓. Feel free to use, modify, and distribute 🚀.

---


## 🤝 Contributing

Contributions are welcome! 💡 Please open an issue 🐛 or submit a pull request 🔀 on GitHub 💻✨.