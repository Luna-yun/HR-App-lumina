import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/constants";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  country: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    companyName: string,
    country: string,
    role: UserRole
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<Pick<UserProfile, 'fullName' | 'companyName' | 'country'>>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user role from database
  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      return data?.role as UserRole | null;
    } catch (err) {
      console.error("Error fetching user role:", err);
      return null;
    }
  }, []);

  // Fetch user profile from database
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, company_name, country")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        companyName: data.company_name,
        country: data.country,
      };
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  }, []);

  // Handle auth state changes
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Defer data fetching to avoid race conditions
          setTimeout(async () => {
            const [role, profile] = await Promise.all([
              fetchUserRole(newSession.user.id),
              fetchUserProfile(newSession.user.id),
            ]);
            setUserRole(role);
            setUserProfile(profile);
            setIsLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        const [role, profile] = await Promise.all([
          fetchUserRole(existingSession.user.id),
          fetchUserProfile(existingSession.user.id),
        ]);
        setUserRole(role);
        setUserProfile(profile);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole, fetchUserProfile]);

  // Sign up function
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    companyName: string,
    country: string,
    role: UserRole
  ) => {
    try {
      const redirectUrl = window.location.origin;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (authError) {
        return { error: authError };
      }

      if (!authData.user) {
        return { error: new Error("Failed to create user") };
      }

      // Create profile with full name
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: authData.user.id,
        email,
        full_name: fullName,
        company_name: companyName,
        country,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        return { error: profileError };
      }

      // Create user role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: authData.user.id,
        role,
      });

      if (roleError) {
        console.error("Role creation error:", roleError);
        return { error: roleError };
      }

      setUserRole(role);
      setUserProfile({
        id: authData.user.id,
        fullName,
        email,
        companyName,
        country,
      });

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/dashboard");
      }

      return { error: null };
    } catch (err) {
      console.error("Sign up error:", err);
      return { error: err as Error };
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const [role, profile] = await Promise.all([
          fetchUserRole(data.user.id),
          fetchUserProfile(data.user.id),
        ]);
        
        setUserRole(role);
        setUserProfile(profile);

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
      }

      return { error: null };
    } catch (err) {
      console.error("Sign in error:", err);
      return { error: err as Error };
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    setUserProfile(null);
    navigate("/");
  };

  // Update password function
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // First verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        return { error: new Error("Current password is incorrect") };
      }

      // Update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error("Password update error:", err);
      return { error: err as Error };
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<Pick<UserProfile, 'fullName' | 'companyName' | 'country'>>) => {
    try {
      if (!user) {
        return { error: new Error("Not authenticated") };
      }

      const dbUpdates: Record<string, string> = {};
      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.companyName !== undefined) dbUpdates.company_name = updates.companyName;
      if (updates.country !== undefined) dbUpdates.country = updates.country;

      const { error } = await supabase
        .from("profiles")
        .update(dbUpdates)
        .eq("user_id", user.id);

      if (error) {
        return { error };
      }

      // Refresh profile
      const profile = await fetchUserProfile(user.id);
      setUserProfile(profile);

      return { error: null };
    } catch (err) {
      console.error("Profile update error:", err);
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        userProfile,
        isLoading,
        signUp,
        signIn,
        signOut,
        updatePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
