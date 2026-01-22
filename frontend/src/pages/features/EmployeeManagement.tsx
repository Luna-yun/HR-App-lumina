import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // <-- Import Link
import {
  Users,
  FileText,
  CheckCircle2,
  BarChart3,
  Settings,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Centralized Employee Records",
    description:
      "Keep all employee information, roles, and employment status in one secure system."
  },
  {
    icon: CheckCircle2,
    title: "Employment Status Tracking",
    description:
      "Monitor Active, Resigned, Terminated, or Excused employees with detailed logs."
  },
  {
    icon: FileText,
    title: "Legal Compliance",
    description:
      "Ensure all actions comply with ASEAN labour laws with built-in guidance for HR staff."
  },
  {
    icon: BarChart3,
    title: "Reports & Audit Logs",
    description:
      "Generate audit-ready logs and HR reports quickly and efficiently."
  },
  {
    icon: Settings,
    title: "Roles & Permissions",
    description:
      "Assign HR staff access levels to control sensitive information securely."
  },
  {
    icon: Sparkles,
    title: "Intuitive Dashboard",
    description:
      "Clean, interactive UI to navigate employee records, statuses, and workflow easily."
  }
];

const workflowSteps = [
  { number: "1", title: "Add Employee", description: "Create employee profile with details and role assignment." },
  { number: "2", title: "Update Status", description: "Change employment status to Resigned, Terminated, or Excused." },
  { number: "3", title: "Compliance Check", description: "System validates actions against ASEAN labour laws." },
  { number: "4", title: "Generate Reports", description: "Produce audit logs, legal documents, and management reports." }
];

const benefits = [
  { title: "Centralized Data", description: "All employee records and statuses stored securely in one system." },
  { title: "Compliance Assurance", description: "Reduce legal risks with built-in labour law guidance." },
  { title: "Workflow Efficiency", description: "HR staff process exits and updates quickly." },
  { title: "Transparency", description: "Maintain clear logs for audits and management review." }
];

const EmployeeManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-white py-20 font-sans text-gray-900">
      
      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-5xl font-bold mb-4 text-black">
          Employee Records & Compliance System
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto mb-8">
          Manage employee records, track employment status, and ensure compliance with ASEAN labour laws — all in one intuitive platform.
        </p>
        <Button className="px-10 py-3 btn-primarytext-white font-semibold rounded-xl  transition-all">
          Check How It Works
        </Button>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -6, scale: 1.03 }}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-4">
                <Icon className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-black">{feature.title}</h3>
              </div>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          );
        })}
      </section>
{/* Workflow Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-white rounded-3xl shadow-sm">
        <h2 className="text-3xl font-bold text-black mb-12 text-center">System Workflow</h2>
        <div className="relative grid md:grid-cols-4 gap-10">
          {workflowSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-200 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">{step.title}</h3>
              <p className="text-gray-700 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-black mb-12">Key Benefits</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-black mb-2">{benefit.title}</h3>
              <p className="text-gray-700">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 px-6 mt-10">
        <h2 className="text-3xl font-bold mb-4 text-black">Streamline HR Compliance Today</h2>
        <p className="max-w-2xl mx-auto mb-6 text-gray-700">
          Centralize employee records, track employment status, and generate compliant reports effortlessly.
        </p>
      </section>

      {/* Link Back to Main Page */}
      <section className="py-12 text-center">
        <Link to="/">
          <Button className="btn-primary text-white px-8 py-3 rounded-xl shadow  transition-all">
            ← Back to Main Page
          </Button>
        </Link>
      </section>

    </div>
  );
};

export default EmployeeManagement;
