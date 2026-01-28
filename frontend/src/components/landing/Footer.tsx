import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, Twitter, Linkedin, Github, Youtube, Phone, MapPin, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/*const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Youtube, href: "#", label: "YouTube" },
];
*/
const footerLinks = {
  feature: [
    { name: "Employee Records & Management", href: "/features/employee-management" },
    { name: "Leave & Attendance", href: "/features/leave-attendance" },
    { name: "Performance Reviews", href: "/features/performance-reviews" },
    { name: "Document Management", href: "/features/document-management" },
  ],
  features: [
    { name: "Time Tracking", href: "/features/time-tracking" },
    { name: "ASEAN Lanour Policies", href: "/features/asean-labour-policies" },
    { name: "HR Administrations", href: "features/hr-administration" },
    { name: "Workflow Automation", href: "features/workflow-automation" },
  ],
  service: [
    { name: "About", href: "/pricing" },
    { name: "FAQ", href: "/landing/Footer" },
    { name: "ASEAN Labour Resources", href: "features/asean-labour-policies" },
    { name: "Team", href: "/features/team" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR", href: "#" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[hsl(var(--dark-bg))] border-t border-white/5 relative overflow-hidden">
  {/* Background decoration */}
  <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px] pointer-events-none" />
  <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

  {/* Newsletter section */}
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
        bg-gradient-to-br from-white/[0.08] to-white/[0.02]
        rounded-2xl sm:rounded-3xl
        p-6 sm:p-8 lg:p-14
        border border-white/10 backdrop-blur-sm
        flex items-center justify-center
      "
    >
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-10">
        <div className="text-center max-w-md">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-white">
            Stay Ahead with
            <span className="gradient-text-light"> HR Insights</span>
          </h3>
          <p className="mt-3 sm:mt-4 text-white/50 text-base sm:text-lg">
            Get the latest HR trends, product updates, and exclusive content delivered to your inbox.
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
        >
          {/* form intentionally kept commented */}
        </form>
      </div>
    </motion.div>
  </div>

{/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-8">
          {/* Brand + Social links */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 mb-6 lg:mb-0">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shadow-lg">
                <span className="text-[hsl(var(--dark-bg))] font-bold text-lg sm:text-xl font-display">L</span>
              </div>
              <span className="text-lg sm:text-xl font-display font-semibold text-white tracking-tight">
                Lumina
              </span>
            </Link>

            <p className="text-white/40 mb-6 sm:mb-8 max-w-xs leading-relaxed text-sm sm:text-base">
              Empowering organizations worldwide with intelligent HR solutions that put people first.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/*socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))*/}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 sm:mb-5 text-sm tracking-wide uppercase">
              Features
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.feature.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/40 hover:text-white transition-colors duration-300 text-sm sm:text-base inline-flex items-center gap-1 group"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 sm:mb-5 text-sm tracking-wide uppercase">
              features
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.features.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/40 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 sm:mb-5 text-sm tracking-wide uppercase">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.service.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/40 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

{/* Contact column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 sm:mb-5 text-sm tracking-wide uppercase">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/50 text-sm sm:text-base">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>+95 101122993</span>
              </li>
              <li className="flex items-start gap-2 text-white/50 text-sm sm:text-base">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="break-all">chaunxiaoyun213054@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-white/50 text-sm sm:text-base">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>123 Parami Street, Hlaing, Yangon</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-white/40 text-center md:text-left">
              © {new Date().getFullYear()} Lumina. All rights reserved.
            </p>
            
            {/* Legal links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {footerLinks.legal.map((link, i) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-xs sm:text-sm text-white/40 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-white/40 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for ASEAN
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}
