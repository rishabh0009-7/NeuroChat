"use client"

import { Navbar } from "@/components/ui/navbar"
import { HeroSection } from "@/components/ui/hero-section"
import { FeaturesSection } from "@/components/ui/features-section"
import { PricingSection } from "@/components/ui/pricing-section"
import { CTASection } from "@/components/ui/cta-section"
import { Footer } from "@/components/ui/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  )
}
