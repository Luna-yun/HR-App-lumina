import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Building2, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    icon: Rocket,
    description: "Perfect for small teams getting started with modern HR",
    monthlyPrice: 29,
    yearlyPrice: 24,
    popular: false,
    features: [
      { name: "Up to 25 employees", included: true },
      { name: "Employee profiles & directory", included: true },
      { name: "Leave management", included: true },
      { name: "Basic attendance tracking", included: true },
      { name: "Email support", included: true },
      { name: "Mobile app access", included: true },
      { name: "Performance reviews", included: false },
      { name: "Custom workflows", included: false },
      { name: "API access", included: false },
      { name: "SSO & advanced security", included: false },
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    icon: Sparkles,
    description: "For growing companies that need powerful HR automation",
    monthlyPrice: 79,
    yearlyPrice: 65,
    popular: true,
    features: [
      { name: "Up to 200 employees", included: true },
      { name: "Everything in Starter", included: true },
      { name: "Performance reviews & 360° feedback", included: true },
      { name: "Custom approval workflows", included: true },
      { name: "Advanced analytics & reports", included: true },
      { name: "Priority support", included: true },
      { name: "Integrations (Slack, Teams)", included: true },
      { name: "Document management", included: true },
      { name: "API access", included: false },
      { name: "Dedicated account manager", included: false },
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    icon: Building2,
    description: "For large organizations with complex HR requirements",
    monthlyPrice: null,
    yearlyPrice: null,
    popular: false,
    features: [
      { name: "Unlimited employees", included: true },
      { name: "Everything in Professional", included: true },
      { name: "SSO & SAML authentication", included: true },
      { name: "Advanced security controls", included: true },
      { name: "Custom API integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom contract & SLA", included: true },
      { name: "On-premise deployment option", included: true },
      { name: "Compliance certifications", included: true },
      { name: "24/7 phone support", included: true },
    ],
    cta: "Contact Sales",
  },
];

const comparisonFeatures = [
  { category: "Team Size", starter: "Up to 25", professional: "Up to 200", enterprise: "Unlimited" },
  { category: "Employee Profiles", starter: true, professional: true, enterprise: true },
  { category: "Leave Management", starter: true, professional: true, enterprise: true },
  { category: "Attendance Tracking", starter: "Basic", professional: "Advanced", enterprise: "Advanced" },
  { category: "Performance Reviews", starter: false, professional: true, enterprise: true },
  { category: "360° Feedback", starter: false, professional: true, enterprise: true },
  { category: "Custom Workflows", starter: false, professional: true, enterprise: true },
  { category: "Analytics & Reports", starter: "Basic", professional: "Advanced", enterprise: "Custom" },
  { category: "Integrations", starter: false, professional: "5+ apps", enterprise: "Unlimited" },
  { category: "API Access", starter: false, professional: false, enterprise: true },
  { category: "SSO/SAML", starter: false, professional: false, enterprise: true },
  { category: "Support", starter: "Email", professional: "Priority", enterprise: "24/7 Phone" },
  { category: "Data Retention", starter: "1 year", professional: "3 years", enterprise: "Unlimited" },
  { category: "Custom Branding", starter: false, professional: true, enterprise: true },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge-primary"
          >
            Simple, Transparent Pricing
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="headline-xl mt-6 mb-4"
          >
            Choose the Perfect Plan
            <br />
            <span className="gradient-text">for Your Team</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="body-lg max-w-2xl mx-auto mb-10"
          >
            Start free for 14 days. No credit card required. 
            Scale as you grow with plans designed for teams of all sizes.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-4 p-1.5 bg-secondary rounded-full"
          >
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                !isYearly 
                  ? "bg-card text-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                isYearly 
                  ? "bg-card text-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={cn(
                    "relative rounded-2xl p-6 lg:p-8 transition-all duration-300",
                    plan.popular 
                      ? "bg-primary text-primary-foreground ring-2 ring-primary shadow-xl scale-[1.02] lg:scale-105" 
                      : "bg-card border border-border hover:shadow-lg"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-accent text-accent-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      plan.popular 
                        ? "bg-white/20" 
                        : "bg-primary/10"
                    )}>
                      <Icon className={cn(
                        "w-6 h-6",
                        plan.popular ? "text-white" : "text-primary"
                      )} />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className={cn(
                      "text-sm",
                      plan.popular ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    {price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">${price}</span>
                        <span className={plan.popular ? "text-white/70" : "text-muted-foreground"}>
                          /user/month
                        </span>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold">Custom</div>
                    )}
                    {isYearly && price && (
                      <p className={cn(
                        "text-sm mt-1",
                        plan.popular ? "text-white/60" : "text-muted-foreground"
                      )}>
                        Billed annually
                      </p>
                    )}
                  </div>

                  <Button
                    className={cn(
                      "w-full mb-6",
                      plan.popular 
                        ? "bg-white text-primary hover:bg-white/90" 
                        : ""
                    )}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className={cn(
                            "w-5 h-5 shrink-0 mt-0.5",
                            plan.popular ? "text-white" : "text-primary"
                          )} />
                        ) : (
                          <X className={cn(
                            "w-5 h-5 shrink-0 mt-0.5",
                            plan.popular ? "text-white/40" : "text-muted-foreground/40"
                          )} />
                        )}
                        <span className={cn(
                          "text-sm",
                          !feature.included && (plan.popular ? "text-white/50" : "text-muted-foreground/60")
                        )}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="headline-lg mb-4"
            >
              Compare All Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="body-lg"
            >
              See exactly what's included in each plan
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto overflow-x-auto"
          >
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Features</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">Professional</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr 
                    key={feature.category}
                    className={cn(
                      "border-b border-border/50",
                      index % 2 === 0 && "bg-secondary/30"
                    )}
                  >
                    <td className="py-4 px-4 text-sm font-medium text-foreground">
                      {feature.category}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <FeatureValue value={feature.starter} />
                    </td>
                    <td className="py-4 px-4 text-center bg-primary/5">
                      <FeatureValue value={feature.professional} highlight />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <FeatureValue value={feature.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* FAQ CTA */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/50 rounded-2xl p-8 lg:p-12 max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you find the perfect plan for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                View FAQ
              </Button>
              <Button size="lg">
                Talk to Sales
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureValue({ value, highlight = false }: { value: boolean | string; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className={cn("w-5 h-5 mx-auto", highlight ? "text-primary" : "text-primary")} />
    ) : (
      <X className="w-5 h-5 mx-auto text-muted-foreground/40" />
    );
  }
  return (
    <span className={cn("text-sm", highlight ? "text-primary font-medium" : "text-muted-foreground")}>
      {value}
    </span>
  );
}
