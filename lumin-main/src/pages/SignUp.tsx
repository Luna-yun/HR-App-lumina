import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Building2, Loader2, CheckCircle, User } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { RoleToggle } from "@/components/auth/RoleToggle";
import { CountrySelect } from "@/components/auth/CountrySelect";
import { Button } from "@/components/ui/button";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { useAuth } from "@/contexts/AuthContext";
import { USER_ROLES, type UserRole } from "@/lib/constants";

export default function SignUp() {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(USER_ROLES.EMPLOYEE);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      companyName: "",
      country: "",
      role: USER_ROLES.EMPLOYEE,
    },
  });

  const selectedCountry = watch("country");

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    const { error } = await signUp(
      data.email,
      data.password,
      data.fullName,
      data.companyName,
      data.country,
      data.role
    );

    if (error) {
      setServerError(error.message);
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setValue("role", role);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your workforce with LuminaHR"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Role Toggle */}
        <div className="space-y-2.5">
          <label className="block text-sm font-medium text-foreground/80">
            I am joining as
          </label>
          <RoleToggle
            value={selectedRole}
            onChange={handleRoleChange}
            disabled={isSubmitting}
          />
          {errors.role && (
            <p className="text-destructive text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Full Name */}
        <AuthInput
          label="Full name"
          type="text"
          icon={User}
          placeholder="Enter your full name"
          error={errors.fullName?.message}
          disabled={isSubmitting}
          {...register("fullName")}
        />

        {/* Email */}
        <AuthInput
          label="Work email"
          type="email"
          icon={Mail}
          placeholder="you@company.com"
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register("email")}
        />

        {/* Password */}
        <AuthInput
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Create a strong password"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register("password")}
        />

        {/* Company Name */}
        <AuthInput
          label="Company name"
          type="text"
          icon={Building2}
          placeholder="Your organization name"
          error={errors.companyName?.message}
          disabled={isSubmitting}
          {...register("companyName")}
        />

        {/* Country Select */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground/80">
            Country
          </label>
          <CountrySelect
            value={selectedCountry}
            onChange={(value) => setValue("country", value)}
            placeholder="Select ASEAN country"
            disabled={isSubmitting}
            error={!!errors.country}
          />
          {errors.country && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm flex items-center gap-1.5"
            >
              {errors.country.message}
            </motion.p>
          )}
        </div>

        {/* Server Error */}
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
            >
              <p className="text-destructive text-sm font-medium">{serverError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-shadow duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Create account
              </>
            )}
          </Button>
        </motion.div>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:text-primary/80 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
