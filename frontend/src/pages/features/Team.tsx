import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type TeamMember = {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  bio: string;
  isExecutive?: boolean;
};

/* -------------------------------------------------------------------------- */
/*                                Mocked Data                                 */
/* -------------------------------------------------------------------------- */

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Chief Executive Officer",
    department: "Executive",
    email: "alex.johnson@example.com",
    bio: "Alex sets the long-term vision for LuminaHR, focusing on global scale, governance, and platform integrity.",
    isExecutive: true,
  },
  {
    id: 2,
    name: "Maria Chen",
    role: "Chief Human Resources Officer",
    department: "Executive",
    email: "maria.chen@example.com",
    bio: "Maria leads people strategy, organizational culture, and leadership development across regions.",
    isExecutive: true,
  },
  {
    id: 3,
    name: "David Smith",
    role: "HR Manager",
    department: "Human Resources",
    email: "david.smith@example.com",
    bio: "David oversees HR operations, compliance, and employee lifecycle management.",
  },
  {
    id: 4,
    name: "Sarah Lee",
    role: "UI / UX Designer",
    department: "Design",
    email: "sarah.lee@example.com",
    bio: "Sarah designs intuitive, human-centered experiences across LuminaHR’s product ecosystem.",
  },
  {
    id: 5,
    name: "Alex Morgan",
    role: "Senior Software Engineer",
    department: "Engineering",
    email: "alex.morgan@example.com",
    bio: "Alex builds scalable backend systems powering LuminaHR’s enterprise features.",
  },
];

/* -------------------------------------------------------------------------- */
/*                           Executive Spotlight                               */
/* -------------------------------------------------------------------------- */

function ExecutiveSpotlight({ executives }: { executives: TeamMember[] }) {
  return (
    <section className="mb-32">
      <div className="grid lg:grid-cols-12 gap-16 items-center">
        {/* Left */}
        <div className="lg:col-span-5">
          <span className="badge-primary">Leadership</span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Executive Leadership
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Vision, governance, and people stewardship at enterprise scale.
          </p>
        </div>

        {/* Right */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8">
          {executives.map((exec) => (
            <div
              key={exec.id}
              className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl p-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {exec.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{exec.name}</h3>
                  <p className="text-sm text-muted-foreground">{exec.role}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {exec.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Team Card                                     */
/* -------------------------------------------------------------------------- */

function TeamCard({
  member,
  expanded,
  onToggle,
}: {
  member: TeamMember;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "w-full text-left rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl p-8 transition-shadow duration-500",
          expanded &&
            "shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.25)]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="font-semibold text-primary">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>

            <div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>

          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-300",
              expanded && "rotate-180"
            )}
          />
        </div>

        {/* Hover micro-bio */}
        <div className="mt-4 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <p className="text-sm text-muted-foreground">{member.bio}</p>
        </div>
      </button>

      {/* Expanded org-card */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-8 py-6 border-x border-b border-border/60 rounded-b-2xl bg-card/60">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {member.bio}
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {member.email}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Page                                         */
/* -------------------------------------------------------------------------- */

export default function TeamPage() {
  const executives = teamMembers.filter((m) => m.isExecutive);
  const staff = teamMembers.filter((m) => !m.isExecutive);

  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Executive Spotlight */}
        <ExecutiveSpotlight executives={executives} />

        {/* Team Directory */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            Team Directory
          </h2>
          <p className="text-muted-foreground max-w-xl mb-12">
            Explore departments and roles across the organization.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => (
              <TeamCard
                key={member.id}
                member={member}
                expanded={expandedId === member.id}
                onToggle={() =>
                  setExpandedId(
                    expandedId === member.id ? null : member.id
                  )
                }
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
