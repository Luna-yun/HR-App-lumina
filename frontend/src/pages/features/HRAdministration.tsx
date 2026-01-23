import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  Database,
  ShieldCheck,
  ClipboardList,
  SlidersHorizontal,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";

const hrFunctions = [
  {
    icon: Database,
    title: "Employee Data Administration",
    description:
      "Maintain complete employee profiles including personal details, job roles, departments, and employment history within a single system."
  },
  {
    icon: Users,
    title: "Employee Lifecycle Management",
    description:
      "Manage employees from onboarding to exit by updating employment status such as active, resigned, terminated, or excused."
  },
  {
    icon: ShieldCheck,
    title: "Policy & Legal Alignment",
    description:
      "Support HR decisions by ensuring employee actions and records align with organizational policies and regional labour regulations."
  },
  {
    icon: ClipboardList,
    title: "HR Documentation & Records",
    description:
      "Store and organize employment records, status changes, and historical data for review and audit purposes."
  },
  {
    icon: SlidersHorizontal,
    title: "Access Control & HR Roles",
    description:
      "Define HR administrative access levels to protect sensitive employee information and maintain data confidentiality."
  },
  {
    icon: LayoutDashboard,
    title: "Administrative Overview",
    description:
      "Use a structured dashboard layout to review employee data, employment changes, and administrative summaries efficiently."
  }
];

const administrationFlow = [
  {
    step: "01",
    title: "Employee Registration",
    description:
      "HR administrators create employee records with required personal and organizational information."
  },
  {
    step: "02",
    title: "Data Maintenance",
    description:
      "Employee details and roles are updated over time to reflect transfers, promotions, or internal changes."
  },
  {
    step: "03",
    title: "Status Administration",
    description:
      "Employment status is recorded and maintained accurately for active, resigned, or terminated employees."
  },
  {
    step: "04",
    title: "Review & Reporting",
    description:
      "HR administrators review employee data and generate internal reports for management reference."
  }
];

const hrAdvantages = [
  {
    title: "Centralized Administration",
    description:
      "All employee-related information is stored and managed through one integrated HR administration system."
  },
  {
    title: "Improved Accuracy",
    description:
      "Standardized data management reduces manual errors and ensures consistency across employee records."
  },
  {
    title: "Operational Efficiency",
    description:
      "HR staff can manage employee information more efficiently without relying on paper-based processes."
  },
  {
    title: "Secure Information Handling",
    description:
      "Sensitive employee data is protected through structured access control and system permissions."
  }
];

const HRAdministration: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 via-purple-100 to-white font-sans text-gray-900">

      {/* Hero Banner */}
      <section className="relative bg-purple-200 py-24 px-6 text-center rounded-b-3xl mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          HR Administration Hub
        </h1>
        <p className="text-gray-800 max-w-3xl mx-auto text-lg leading-relaxed">
          Streamline employee management, lifecycle tracking, and policy compliance with our structured HR Administration system.
        </p>
      </section>

      {/* HR Functions - Compact Alternating Layout */}
      <section className="max-w-6xl mx-auto px-6 mb-20 space-y-8">
        {hrFunctions.map((func, index) => {
          const Icon = func.icon;
          const isLeft = index % 2 === 0;
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className={`flex flex-col md:flex-row items-start md:justify-between gap-4 ${
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div className="flex-shrink-0 bg-white p-4 rounded-2xl shadow-md border border-purple-200 flex items-center justify-center w-24 h-24">
                <Icon className="w-10 h-10 text-purple-500" />
              </div>
              <div className="max-w-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {func.title}
                </h3>
                <p className="text-gray-700 text-sm">{func.description}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Administration Flow - Fixed Vertical Timeline */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Administration Process
        </h2>
        <div className="relative ml-6 pl-8">
          {administrationFlow.map((step, index) => (
            <div key={index} className="mb-12 relative">
              {/* Timeline Line */}
              {index !== administrationFlow.length - 1 && (
                <div className="absolute top-12 left-5 w-0.5 h-full bg-purple-300"></div>
              )}
              {/* Number Circle */}
              <div className="absolute -left-6 top-0 w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold shadow z-10">
                {step.step}
              </div>
              {/* Text Content */}
              <div className="pl-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-1">
                  {step.title}
                </h4>
                <p className="text-gray-700 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits - Horizontal Scroll */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Key Benefits
        </h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {hrAdvantages.map((benefit, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.04 }}
              className="min-w-[260px] bg-white p-6 rounded-2xl shadow-md border border-purple-200 hover:shadow-lg transition-all flex-shrink-0"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-700 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Closing Section */}
      <section className="max-w-3xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Organized HR Data
        </h2>
        <p className="text-gray-700 leading-relaxed">
          A modern HR Administration system that ensures accuracy, efficiency, and secure management of all employee information across the organization.
        </p>
      </section>

      {/* Back to Main Page Button - Bottom */}
      <section className="py-12 text-center">
        <Link to="/">
          <Button className="bg-purple-500 text-white px-8 py-3 rounded-xl shadow hover:bg-purple-600 transition-all">
            ← Back to Main Page
          </Button>
        </Link>
      </section>

    </div>
  );
};

export default HRAdministration;
