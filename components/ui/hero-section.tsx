"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../button";
import { Download, Star, Sparkles } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const robotRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (robotRef.current) {
      gsap.to(robotRef.current, {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    if (sparklesRef.current) {
      const sparkles = sparklesRef.current.children;
      gsap.fromTo(
        sparkles,
        { scale: 0, rotation: 0 },
        {
          scale: 1,
          rotation: 360,
          duration: 2,
          stagger: 0.2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        }
      );
    }
  }, []);

  return (
    <section
      id="home"
      className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/50 to-white relative overflow-hidden"
    >
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-10 text-blue-300 w-6 h-6" />
        <Sparkles className="absolute top-40 right-20 text-purple-300 w-4 h-4" />
        <Sparkles className="absolute bottom-40 left-20 text-pink-300 w-5 h-5" />
        <Sparkles className="absolute bottom-20 right-10 text-blue-300 w-6 h-6" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6 pulse-glow"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Highly Demanded on App-store</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            AI-Powered Conversations,{" "}
            <span className="gradient-text">Simplified.</span>
            <motion.span
              className="inline-block ml-2 text-blue-500"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
              }}
            >
              💬
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Smart, instant, and 24/7 chatbot to assist your business
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="gradient-button text-white px-8 py-4 rounded-full text-lg font-semibold">
              Try For Free →
            </Button>
          </motion.div>
        </div>

        {/* Hero Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left Badge */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="lg:justify-self-end"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-xs">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Download className="w-6 h-6 text-green-600" />
                </motion.div>
                <div>
                  <motion.div
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    10M+
                  </motion.div>
                  <div className="text-gray-600">Downloads</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center Robot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex justify-center"
          >
            <div ref={robotRef} className="relative">
              <Image
                src="/images/ai-robot.png"
                alt="AI Chatbot Robot"
                width={300}
                height={300}
                className="w-full max-w-sm floating-animation"
              />
            </div>
          </motion.div>

          {/* Right Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="lg:justify-self-start"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-xs">
              <div className="flex items-center space-x-3 mb-3">
                <Image
                  src="/professional-avatar.png"
                  alt="Jahangir"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">Jahangir</div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 + i * 0.1 }}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                "Tried many, but this AI stands out! 🔥"
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
