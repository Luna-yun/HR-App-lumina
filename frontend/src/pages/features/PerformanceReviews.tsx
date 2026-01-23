import React from "react";
import { Link } from "react-router-dom";
import { Star, CheckCircle2, Users, FileText, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Vertical Timeline Steps
const reviewSteps = [
  { step: "01", title: "Define Goals", description: "Set measurable and achievable objectives for employees." },
  { step: "02", title: "Collect Feedback", description: "Get input from managers, peers, and self-assessment." },
  { step: "03", title: "Appraise Performance", description: "Analyze data and provide ratings based on goal achievement." },
  { step: "04", title: "Share Results", description: "Communicate outcomes and discuss growth opportunities." }
];

// Metrics Section
const reviewMetrics = [
  { icon: Star, title: "Goal Assessment", description: "Evaluate employees against their objectives for measurable performance." },
  { icon: CheckCircle2, title: "Feedback Collection", description: "Gather insights from managers, peers, and team members for a 360° view." },
  { icon: Users, title: "Self-Evaluation", description: "Allow employees to reflect on their achievements and growth areas." },
  { icon: FileText, title: "Appraisal Documentation", description: "Record appraisal outcomes and comments for HR reference and audits." },
  { icon: BarChart3, title: "Reporting & Analytics", description: "Visualize performance trends and support management decisions." }
];

// Benefits Section
const reviewBenefits = [
  { title: "Transparency", description: "Clear evaluation criteria ensure fairness and trust." },
  { title: "Employee Growth", description: "Identify opportunities for development and training." },
  { title: "Informed Decisions", description: "Use performance data for promotions, bonuses, and recognition." },
  { title: "Engagement", description: "Regular reviews keep employees motivated and aligned with goals." }
];

const PerformanceReviews: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-white font-sans text-gray-900">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-center py-24 px-6 mb-20">
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 relative inline-block">
            <span className="bg-green-200 rounded-xl px-4 py-1">Performance Reviews ✨</span>
          </h1>
          <p className="text-gray-800 text-lg leading-relaxed mt-4">
            Evaluate employee performance through goal tracking, feedback, and appraisals. Promote growth, engagement, and organizational success.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="w-56 h-56 rounded-full bg-green-400 flex items-center justify-center shadow-lg">
            <Star className="w-14 h-14 text-white" />
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Evaluation Metrics</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 px-2">
          {reviewMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="min-w-[260px] bg-white p-6 rounded-2xl shadow-lg border border-green-200 flex flex-col items-center text-center transition-all"
              >
                <Icon className="w-12 h-12 text-green-500 mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{metric.title}</h3>
                <p className="text-gray-700 text-sm">{metric.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Review Process - Compact Vertical Timeline */}
      <section className="max-w-3xl mx-auto px-6 mb-24 relative">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Review Process</h2>
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-7 top-0 h-full w-1 bg-green-300 rounded-full"></div>
          {reviewSteps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 mb-8 relative"
            >
              {/* Circle */}
              <div className="flex-shrink-0 w-12 h-12 bg-green-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow z-10">
                {step.step}
              </div>
              {/* Step Card */}
              <div className="bg-green-100 p-4 rounded-xl shadow-md border border-green-200 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-700 text-sm mt-1">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Benefits</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {reviewBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`bg-white p-6 rounded-2xl shadow-lg border border-green-200 w-64 transition-all transform ${index % 2 === 0 ? "-rotate-2" : "rotate-2"}`}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-700 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Back to Main Page Button */}
      <section className="py-12 text-center">
        <Link to="/">
          <Button className="bg-green-500 text-white px-8 py-3 rounded-xl shadow hover:bg-green-600 transition-all">
            ← Back to Main Page
          </Button>
        </Link>
      </section>

    </div>
  );
};

export default PerformanceReviews;
