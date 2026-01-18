// team.tsx
import React from "react";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Engineer",
    department: "Engineering",
    email: "alex.johnson@example.com",
  },
  {
    id: 2,
    name: "Maria Chen",
    role: "Product Manager",
    department: "Product",
    email: "maria.chen@example.com",
  },
  {
    id: 3,
    name: "David Smith",
    role: "HR Manager",
    department: "Human Resources",
    email: "david.smith@example.com",
  },
  {
    id: 4,
    name: "Sarah Lee",
    role: "UI/UX Designer",
    department: "Design",
    email: "sarah.lee@example.com",
  },
];

export default function TeamPage() {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-semibold text-foreground">
            Team Directory
          </h1>
          <p className="mt-2 text-muted-foreground">
            View members across departments and roles within your organization.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="bg-card border border-border/60 hover:border-border transition"
            >
              <CardContent className="p-6">
                {/* Avatar */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                  {member.name.charAt(0)}
                </div>

                {/* Name */}
                <h2 className="text-lg font-medium text-foreground">
                  {member.name}
                </h2>

                {/* Role */}
                <p className="text-sm text-muted-foreground">
                  {member.role}
                </p>

                {/* Meta */}
                <div className="mt-4 space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-medium">
                      Department:
                    </span>{" "}
                    {member.department}
                  </p>

                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
