import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative bg-white py-20 sm:py-28 lg:py-36">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
        >
          Sign Up and Simplify Your HR Management
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
        >
          Get started with LuminaHR to streamline your HR processes and empower your team with 
          smarter tools for people management and productivity.
        </motion.p>

        {/* Sign Up Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 sm:mt-12 flex flex-col items-center gap-4"
        >
          <Link to="/signup">
            <Button
              variant="default"
              size="lg"
              className="group bg-gray-900 text-white px-6 sm:px-8 shadow-lg hover:bg-gray-800"
            >
              Sign Up
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          {/* Free notice */}
          <span className="text-gray-600 text-sm sm:text-base mt-2">
            No credit card required — completely free
          </span>
        </motion.div>
      </div>
    </section>
  );
}
