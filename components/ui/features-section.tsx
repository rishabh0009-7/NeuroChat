"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card } from "../card"
import { ImageIcon, FileText, Zap } from "lucide-react"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const features = [
    {
      icon: ImageIcon,
      title: "Create Stunning Images with AI",
      description:
        "Generate beautiful, high-quality images from simple text descriptions using advanced AI technology.",
      image: "/ai-artwork-gallery.png",
    },
    {
      icon: FileText,
      title: "Chat with Any Document",
      description: "Upload PDFs, DOCs, and other documents to have intelligent conversations about their content.",
      image: "/document-upload-interface.png",
    },
    {
      icon: Zap,
      title: "Seamless Integrations",
      description: "Connect with your favorite tools and platforms for a unified workflow experience.",
      image: "/placeholder-q9nm6.png",
    },
  ]

  useEffect(() => {
    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll(".feature-card-gsap")

      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            y: 100,
            opacity: 0,
            rotationY: 45,
          },
          {
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Add hover animation
        card.addEventListener("mouseenter", () => {
          gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" })
        })

        card.addEventListener("mouseleave", () => {
          gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" })
        })
      })
    }
  }, [])

  return (
    <section ref={sectionRef} id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Businesses</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to transform your customer interactions with AI-powered conversations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="feature-card-gsap">
              <Card className="feature-card p-6 h-full bg-white border-0 shadow-lg rounded-2xl">
                <div className="mb-4">
                  <motion.div
                    className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
