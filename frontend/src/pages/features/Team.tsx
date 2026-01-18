// team.tsx
import React from "react";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  avatarUrl?: string;
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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Team</h1>
          <p className="mt-2 text-gray-600">
            Meet the people who build and support our organization.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* Avatar Placeholder */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-600">
                {member.name.charAt(0)}
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                {member.name}
              </h2>

              <p className="text-sm text-gray-500">{member.role}</p>

              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">
                    Department:
                  </span>{" "}
                  {member.department}
                </p>
                <p className="mt-1">
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  {member.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
