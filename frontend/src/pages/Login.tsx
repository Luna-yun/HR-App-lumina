import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    const { error } = await signIn(data.email, data.password);

    if (error) {
      setServerError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your LuminaHR account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          placeholder="Enter your password"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register("password")}
        />

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
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign in
              </>
            )}
          </Button>
        </motion.div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground pt-2">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-medium hover:text-primary/80 transition-colors duration-200"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
