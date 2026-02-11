import { Navigation } from "@/components/landing/navigation"
import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { UseCases } from "@/components/landing/use-cases"
import { TechStack } from "@/components/landing/tech-stack"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { BackToTop } from "@/components/landing/back-to-top"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Navigation />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <UseCases />
      <TechStack />
      <FAQ />
      <CTA />
      <Footer />
      <BackToTop />
    </main>
  )
}
