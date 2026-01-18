import { motion } from "framer-motion";
import { Shield, User } from "lucide-react";
import { USER_ROLES, type UserRole } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface RoleToggleProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

export function RoleToggle({ value, onChange, disabled }: RoleToggleProps) {
  const roles = [
    {
      id: USER_ROLES.ADMIN,
      label: "Admin (HR)",
      description: "Manage employees & organization",
      icon: Shield,
    },
    {
      id: USER_ROLES.EMPLOYEE,
      label: "Employee",
      description: "Access your workspace",
      icon: User,
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map((role) => {
        const isSelected = value === role.id;
        const Icon = role.icon;

        return (
          <motion.button
            key={role.id}
            type="button"
            whileHover={{ y: disabled ? 0 : -2 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => !disabled && onChange(role.id)}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-300",
              isSelected
                ? "border-primary bg-primary/[0.03]"
                : "border-border/50 bg-card hover:border-primary/30 hover:bg-primary/[0.01]",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{
              boxShadow: isSelected 
                ? "0 4px 20px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(var(--primary), 0.1)" 
                : "0 1px 3px rgba(0, 0, 0, 0.04)"
            }}
          >
            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                layoutId="roleIndicator"
                className="absolute inset-0 rounded-xl border-2 border-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <motion.div
              animate={{
                scale: isSelected ? 1 : 0.95,
                backgroundColor: isSelected 
                  ? "hsl(var(--primary))" 
                  : "hsl(var(--muted))",
              }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300",
                isSelected ? "text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
            </motion.div>

            <div className="text-center">
              <p
                className={cn(
                  "font-semibold text-sm transition-colors duration-300",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {role.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {role.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
