import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What is LuminaHR and how does it transform HR operations?",
    answer:
      "LuminaHR is an enterprise-grade HR platform that leverages AI and automation to streamline every aspect of workforce management. From intelligent onboarding to predictive analytics, we help organizations reduce administrative overhead by 60% while delivering exceptional employee experiences.",
  },
  {
    question: "How does LuminaHR ensure data security and compliance?",
    answer:
      "We maintain SOC 2 Type II, GDPR, and HIPAA compliance with enterprise-grade encryption. Your data is protected with AES-256 encryption at rest and TLS 1.3 in transit. We also offer single-tenant deployment options for organizations requiring additional isolation.",
  },
  {
    question: "Can LuminaHR integrate with our existing HR tech stack?",
    answer:
      "Absolutely. LuminaHR offers 200+ pre-built integrations including Workday, SAP SuccessFactors, ADP, Slack, Microsoft Teams, and more. Our open API allows custom integrations, and our dedicated implementation team ensures seamless data migration.",
  },
  {
    question: "What AI capabilities does LuminaHR offer?",
    answer:
      "Our AI engine powers intelligent document processing, predictive attrition analysis, automated workflow optimization, smart scheduling, and personalized learning recommendations. The AI continuously learns from your organization's patterns to deliver increasingly accurate insights.",
  },
  {
    question: "How quickly can we implement LuminaHR?",
    answer:
      "Most organizations are fully operational within 4-8 weeks. Our white-glove implementation includes data migration, custom configuration, integration setup, and comprehensive training. Enterprise deployments may require 8-12 weeks for complex multi-entity setups.",
  },
  {
    question: "What support options are available?",
    answer:
      "All plans include 24/7 email and chat support. Business and Enterprise plans add dedicated success managers, priority phone support, and custom SLAs. We also provide extensive documentation, video tutorials, and a thriving community forum.",
  },
];

interface FAQItemProps {
  faq: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ faq, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className={`border-b border-white/10 transition-colors duration-300 ${
          isOpen ? "border-white/20" : ""
        }`}
      >
        <button 
          onClick={onToggle} 
          className="w-full text-left py-6 sm:py-8 focus:outline-none group"
        >
          <div className="flex items-start justify-between gap-4 sm:gap-8">
            <h3
              className={`text-base sm:text-lg lg:text-xl font-display font-medium transition-colors duration-300 ${
                isOpen ? "text-white" : "text-white/70 group-hover:text-white"
              }`}
            >
              {faq.question}
            </h3>
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 ${
                isOpen 
                  ? "bg-white text-[hsl(var(--dark-bg))]" 
                  : "bg-white/10 text-white/60 group-hover:bg-white/15 group-hover:text-white"
              }`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <p className="pt-3 sm:pt-4 pb-2 text-white/50 leading-relaxed text-sm sm:text-base lg:text-lg max-w-2xl">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-[hsl(var(--dark-bg))] py-20 sm:py-28 lg:py-36"
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-1/4 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/8 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">
          {/* Left: Title */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="badge-dark"
              >
                FAQ
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-6 sm:mt-8 lg:mt-10 text-white leading-[0.95]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Frequently
                <br />
                Asked
                <br />
                <span className="gradient-text-light">Questions</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-6 sm:mt-8 lg:mt-10 text-white/50 text-base sm:text-lg"
              >
                Everything you need to know about LuminaHR. Can't find the answer?{" "}
                <a href="#" className="text-white hover:text-white/80 underline underline-offset-4 transition-colors">
                  Contact our team
                </a>
              </motion.p>
            </div>
          </div>

          {/* Right: FAQ items */}
          <div className="lg:col-span-8">
            <div className="pt-0 sm:pt-4">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
