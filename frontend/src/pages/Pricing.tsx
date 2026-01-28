import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

/* About cards */
const sections = [
  {
    title: "Who We Are",
    description:
      "An AI-driven workforce management platform designed for real-world organizational and legal complexity.",
    points: [
      "Employee and organizational management powered by AI",
      "Built using Large Language Models (LLM)",
      "Enhanced with Retrieval-Augmented Generation (RAG)",
      "Designed for administrative and decision-making use",
      "Focused on compliance, transparency, and accountability",
    ],
    highlight: false,
  },
  {
    title: "What We Solve",
    description:
      "Helping organizations make legally compliant workforce decisions across ASEAN countries.",
    points: [
      "Company-specific leave and HR policy interpretation",
      "Cross-checking decisions with ASEAN labour laws",
      "Supporting lawful and justified termination decisions",
      "Reducing compliance risks and disputes",
      "Supporting multi-country workforce operations",
    ],
    highlight: true,
  },
  {
    title: "Why Smart Workforce",
    description:
      "Built for organizations that need clarity, compliance, and confidence in workforce decisions.",
    points: [
      "Policy-aware and law-aware AI assistance",
      "Explainable recommendations for HR teams",
      "Supports human decision-making, not automation-only",
      "Aligned with ASEAN employment principles",
      "Scalable for organizations of any size",
    ],
    highlight: false,
  },
];

/* plt cap */
const capabilities = [
  "AI-assisted employee and leave management",
  "ASEAN-compliant labour and termination policy validation",
  "Company policy and regulation alignment",
  "Explainable AI decision support",
  "Cross-country workforce compliance",
  "Reduced legal and HR operational risk",
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        {/* Intro*/}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="headline-xl mb-6"
          >
            Smart Workforce
            <br />
            <span className="gradient-text">
              AI-Driven Employee & Organization Management
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-lg max-w-4xl mx-auto"
          >
            An AI-driven employee and organizational management
            platform that helps organizations manage workforce decisions by
            aligning internal policies with ASEAN labour laws. Using Large
            Language Models (LLM) and Retrieval-Augmented Generation (RAG), the
            platform supports transparent, compliant, and responsible decision-
            making.
          </motion.p>
        </section>
        {/* About*/}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "rounded-2xl p-6 lg:p-8 transition-all",
                  section.highlight
                    ? "bg-primary text-primary-foreground shadow-xl scale-[1.02]"
                    : "bg-card border border-border"
                )}
              >
                <h3 className="text-2xl font-bold mb-3">
                  {section.title}
                </h3>

                <p
                  className={cn(
                    "text-sm mb-5",
                    section.highlight
                      ? "text-white/80"
                      : "text-muted-foreground"
                  )}
                >
                  {section.description}
                </p>

                <ul className="space-y-3">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <Check
                        className={cn(
                          "w-5 h-5 mt-0.5 shrink-0",
                          section.highlight
                            ? "text-white"
                            : "text-primary"
                        )}
                      />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* plt cap*/}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="headline-lg text-center mb-10"
            >
              Platform Capabilities
            </motion.h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {capabilities.map((capability, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-secondary/40 rounded-xl p-4 flex items-start gap-3"
                >
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-sm">{capability}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* contacts */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/50 rounded-2xl p-8 lg:p-12 max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-4">
              Talk to Us
            </h3>
            <p className="text-muted-foreground mb-6">
              Contact us to learn how Smart Workforce can help your organization
              manage employee leave, compliance, and termination decisions across
              ASEAN countries with confidence.
            </p>

            <Link to="/features/team">
              <Button size="lg">Contact Us</Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}