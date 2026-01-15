import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, Twitter, Linkedin, Github, Youtube, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[hsl(var(--dark-bg))] border-t border-white/5">
      {/* Newsletter section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-14 border border-white/10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
            <div className="text-center lg:text-left max-w-md">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-white">
                Stay Ahead with
                <span className="gradient-text-light"> HR Insights</span>
              </h3>
              <p className="mt-3 sm:mt-4 text-white/50 text-base sm:text-lg">
                Get the latest HR trends, product updates, and exclusive content delivered to your inbox.
              </p>
            </div>

            <form
              className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-1 lg:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-white/25 focus:ring-2 focus:ring-white/10 transition-all text-sm sm:text-base"
                />
              </div>
              <Button 
                variant="default" 
                size="lg" 
                className="group bg-white text-[hsl(var(--dark-bg))] hover:bg-white/90 shadow-lg px-6 sm:px-8"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand + Social links */}
          <div className="mb-6 lg:mb-0">
            <a href="/" className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shadow-lg">
                <span className="text-[hsl(var(--dark-bg))] font-bold text-lg sm:text-xl font-display">L</span>
              </div>
              <span className="text-lg sm:text-xl font-display font-semibold text-white tracking-tight">
                LuminaHR
              </span>
            </a>

            <p className="text-white/40 mb-6 sm:mb-8 max-w-xs leading-relaxed text-sm sm:text-base">
              Empowering organizations worldwide with intelligent HR solutions that put people first.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 sm:mb-5 text-sm tracking-wide uppercase">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60">
                <Phone className="w-4 h-4" />
                <span>+95 9695922584</span>
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <Mail className="w-4 h-4" />
                <span>hsumyathtet784@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <MapPin className="w-4 h-4" />
                <span>123 Parami Street, Hlaing , Yangon</span>
              </li>
            </ul>
          </div>

          {/* Optional: Newsletter quick links / CTA */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 sm:mb-5 text-sm tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-white/40 hover:text-white transition-colors duration-300">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-white/40 hover:text-white transition-colors duration-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-white/40 hover:text-white transition-colors duration-300">
                  ASEAN Labour Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-white/40 hover:text-white transition-colors duration-300">
                  Team
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/10 text-center md:text-left">
          <p className="text-xs sm:text-sm text-white/40">
            © {new Date().getFullYear()} LuminaHR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
