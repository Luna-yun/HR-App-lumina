import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // <-- Import Link
import {
  CalendarCheck,
  Clock,
  ShieldCheck,
  Gavel,
  FileText,
  Users,
  BarChart3,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "ASEAN-Compliant Leave Management",
    desc: "Leave policies are designed to follow ASEAN labor laws and internal company regulations.",
    points: [
      "Annual, Sick, Parental & Emergency Leave",
      "Automatic entitlement calculation",
      "Policy-based approval workflow",
      "Legally auditable leave history"
    ]
  },
  {
    icon: Clock,
    title: "Accurate Attendance Tracking",
    desc: "Attendance data is transparent, reliable, and legally usable when disputes arise.",
    points: [
      "Clock in / Clock out history",
      "Late & absence detection",
      "Overtime calculation",
      "Tamper-proof records"
    ]
  },
  {
    icon: Gavel,
    title: "Disciplinary & Termination Control",
    desc: "All disciplinary actions and terminations strictly follow ASEAN labor laws and company policies.",
    points: [
      "Legally justified termination records",
      "Employee excuse documentation",
      "Warning & suspension history",
      "Court-ready evidence generation"
    ]
  },
  {
    icon: BarChart3,
    title: "Legal Reports & Documentation",
    desc: "Generate official HR reports suitable for audits, disputes, and legal review.",
    points: [
      "Attendance reports",
      "Leave usage history",
      "Termination documentation"
    ]
  }
];

export default function LeaveAttendancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-white py-20">
      <div className="container mx-auto px-4 lg:px-10">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1 mb-4 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
            HR Governance System
          </span>
          <h1 className="text-5xl font-bold text-slate-900 mb-5">
            Leave & Attendance Governance
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            A legally compliant HR platform for managing employee leave,
            attendance, discipline, and termination under ASEAN labor laws and
            internal organizational policies.
          </p>
        </motion.div>

        {/* COMPLIANCE SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-12 mb-24 shadow-xl border border-slate-200"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 rounded-xl bg-blue-100">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-semibold text-slate-900">
              ASEAN Labor Law & Policy Compliance
            </h2>
          </div>

          <p className="text-slate-600 mb-10 max-w-4xl">
            Every HR action including leave approval, attendance discipline,
            excuse verification, suspension, and termination is validated
            against ASEAN labor laws and company policies to ensure fairness,
            transparency, and legal safety for both employees and employers.
          </p>
<div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Gavel,
                title: "Lawful Termination",
                text: "All dismissals are supported with clear legal justification and evidence."
              },
              {
                icon: FileText,
                title: "Excuse & Reason Tracking",
                text: "Employee explanations are documented and reviewed before action is taken."
              },
              {
                icon: Users,
                title: "Employee Rights Protection",
                text: "Prevents unfair termination and protects employee rights."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-blue-50/40 border border-blue-100 rounded-2xl p-6 hover:shadow-md transition"
              >
                <item.icon className="w-7 h-7 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FEATURES */}
        <div className="grid lg:grid-cols-2 gap-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-200 rounded-3xl p-10 shadow-md hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-indigo-100">
                  <f.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  {f.title}
                </h3>
              </div>

              <p className="text-slate-600 mb-6 text-base">
                {f.desc}
              </p>

              <ul className="grid grid-cols-2 gap-4 text-sm">
                {f.points.map((p, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* PROCESS FLOW */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-28"
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-14">
            How Legal HR Decisions Are Made
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Employee Action Recorded",
              "HR Verification",
              "Policy & Law Validation",
              "Final Decision & Documentation"
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition"
              >
                <div className="text-indigo-600 font-bold text-xl mb-3">
                  Step {i + 1}
                </div>
                <p className="text-sm text-slate-600">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BACK TO MAIN PAGE */}
        <section className="py-12 text-center">
          <Link to="/">
            <button className="btn-primary text-white px-8 py-3 rounded-xl shadow  transition-all">
              ← Back to Main Page
            </button>
          </Link>
        </section>

      </div>
    </div>
  );
}
