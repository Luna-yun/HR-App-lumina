import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  User, 
  Mail, 
  Building2, 
  MapPin, 
  Lock, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountrySelect } from "@/components/auth/CountrySelect";
import { useAuth } from "@/contexts/AuthContext";
import { passwordChangeSchema, type PasswordChangeFormData } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

export function ProfileSection() {
  const { userProfile, updateProfile, updatePassword } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: userProfile?.fullName || '',
    companyName: userProfile?.companyName || '',
    country: userProfile?.country || '',
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const handleProfileSave = async () => {
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);

    const { error } = await updateProfile({
      fullName: profileForm.fullName,
      companyName: profileForm.companyName,
      country: profileForm.country,
    });

    if (error) {
      setProfileError(error.message);
    } else {
      setProfileSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (data: PasswordChangeFormData) => {
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    const { error } = await updatePassword(data.currentPassword, data.newPassword);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setIsChangingPassword(false);
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setPasswordLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-elevated p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
              <p className="text-sm text-muted-foreground">Manage your personal details</p>
            </div>
          </div>
          {!isEditingProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
            >
              Edit
            </Button>
          )}
        </div>

        {profileSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Profile updated successfully</span>
          </motion.div>
        )}

        {profileError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">{profileError}</span>
          </motion.div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Full Name
            </label>
            {isEditingProfile ? (
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            ) : (
              <p className="text-foreground font-medium">{userProfile?.fullName || '-'}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </label>
            <p className="text-foreground font-medium">{userProfile?.email || '-'}</p>
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Company
            </label>
            {isEditingProfile ? (
              <input
                type="text"
                value={profileForm.companyName}
                onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                className="w-full h-11 px-4 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            ) : (
              <p className="text-foreground font-medium">{userProfile?.companyName || '-'}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Country
            </label>
            {isEditingProfile ? (
              <CountrySelect
                value={profileForm.country}
                onChange={(value) => setProfileForm({ ...profileForm, country: value })}
                placeholder="Select country"
              />
            ) : (
              <p className="text-foreground font-medium">{userProfile?.country || '-'}</p>
            )}
          </div>
        </div>

        {isEditingProfile && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingProfile(false);
                setProfileForm({
                  fullName: userProfile?.fullName || '',
                  companyName: userProfile?.companyName || '',
                  country: userProfile?.country || '',
                });
              }}
              disabled={profileLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProfileSave}
              disabled={profileLoading}
              className="gap-2"
            >
              {profileLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        )}
      </motion.div>

      {/* Password Change */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="card-elevated p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Password & Security</h2>
              <p className="text-sm text-muted-foreground">Update your password</p>
            </div>
          </div>
          {!isChangingPassword && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          )}
        </div>

        {passwordSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Password changed successfully</span>
          </motion.div>
        )}

        {passwordError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">{passwordError}</span>
          </motion.div>
        )}

        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  {...registerPassword("currentPassword")}
                  className={cn(
                    "w-full h-11 px-4 pr-12 rounded-lg border bg-background text-foreground transition-all",
                    passwordErrors.currentPassword 
                      ? "border-destructive focus:ring-destructive/10" 
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                  )}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  {...registerPassword("newPassword")}
                  className={cn(
                    "w-full h-11 px-4 pr-12 rounded-lg border bg-background text-foreground transition-all",
                    passwordErrors.newPassword 
                      ? "border-destructive focus:ring-destructive/10" 
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                  )}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  {...registerPassword("confirmPassword")}
                  className={cn(
                    "w-full h-11 px-4 pr-12 rounded-lg border bg-background text-foreground transition-all",
                    passwordErrors.confirmPassword 
                      ? "border-destructive focus:ring-destructive/10" 
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                  )}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-destructive">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  resetPassword();
                  setPasswordError(null);
                }}
                disabled={passwordLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={passwordLoading}
                className="gap-2"
              >
                {passwordLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Update Password
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-muted-foreground text-sm">
            For security, we recommend changing your password regularly. Your password should be at least 8 characters and include uppercase, lowercase, and numbers.
          </p>
        )}
      </motion.div>
    </div>
  );
}
