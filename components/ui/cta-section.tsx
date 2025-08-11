"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../button";
import { Sparkles, Zap, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (floatingElementsRef.current) {
      const elements = floatingElementsRef.current.children;

      Array.from(elements).forEach((element, index) => {
        gsap.to(element, {
          y: -30,
          duration: 2 + index * 0.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.3,
        });

        gsap.to(element, {
          rotation: 360,
          duration: 8 + index * 2,
          ease: "none",
          repeat: -1,
        });
      });
    }

    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        {
          backgroundPosition: "0% 50%",
        },
        {
          backgroundPosition: "100% 50%",
          duration: 10,
          ease: "none",
          repeat: -1,
          yoyo: true,
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden"
      style={{ backgroundSize: "200% 200%" }}
    >
      <div
        ref={floatingElementsRef}
        className="absolute inset-0 pointer-events-none"
      >
        <Sparkles className="absolute top-20 left-10 text-white/30 w-8 h-8" />
        <Zap className="absolute top-40 right-20 text-yellow-300/40 w-6 h-6" />
        <Star className="absolute bottom-40 left-20 text-pink-300/40 w-7 h-7" />
        <Sparkles className="absolute bottom-20 right-10 text-white/30 w-5 h-5" />
        <Zap className="absolute top-60 left-1/3 text-cyan-300/30 w-6 h-6" />
        <Star className="absolute top-32 right-1/3 text-purple-300/40 w-8 h-8" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            animate={{
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 30px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            Start Your AI Journey Today
          </motion.h2>

          <motion.p
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join thousands who are transforming their workflows with intelligent
            conversations
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-2xl">
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
