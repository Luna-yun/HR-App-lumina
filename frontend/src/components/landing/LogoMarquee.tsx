import { motion } from "framer-motion";

// Company logos as text with brand-like styling
const companies = [
  { name: "Microsoft", weight: "font-bold" },
  { name: "Google", weight: "font-medium" },
  { name: "Salesforce", weight: "font-bold" },
  { name: "Adobe", weight: "font-semibold" },
  { name: "Slack", weight: "font-bold" },
  { name: "Dropbox", weight: "font-medium" },
  { name: "Shopify", weight: "font-bold" },
  { name: "Zendesk", weight: "font-semibold" },
  { name: "HubSpot", weight: "font-bold" },
  { name: "Atlassian", weight: "font-medium" },
  { name: "Stripe", weight: "font-bold" },
  { name: "Twilio", weight: "font-semibold" },
];

export function LogoMarquee() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background overflow-hidden border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <p className="text-center text-muted-foreground text-sm sm:text-base">
          Trusted by innovative companies worldwide
        </p>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling logos */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex items-center gap-8 sm:gap-12 lg:gap-16"
            animate={{
              x: [0, -50 * companies.length * 8],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate for seamless loop */}
            {[...companies, ...companies, ...companies].map((company, i) => (
              <div
                key={`${company.name}-${i}`}
                className="flex items-center justify-center shrink-0 group"
              >
                <span 
                  className={`text-lg sm:text-xl lg:text-2xl ${company.weight} text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors duration-300 whitespace-nowrap tracking-tight`}
                >
                  {company.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats row */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 lg:mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { value: "10K+", label: "Companies" },
            { value: "2M+", label: "Employees Managed" },
            { value: "150+", label: "Countries" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
